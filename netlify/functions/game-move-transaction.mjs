import {applyMove} from './game-movement.mjs';
import {validUuid} from './game-security.mjs';

/** The caller supplies an actor resolved from trusted server authentication. */
export async function commitMove(db, command, actor) {
  if(!db?.pool || !validUuid(command?.gameId) || !validUuid(command?.actionId) ||
     !Number.isSafeInteger(command?.expectedRevision) || command.expectedRevision<0 ||
     !actor?.verified || !['dm','player'].includes(actor.role) || !actor.id)
    return {status:400,error:'Invalid movement request'};
  let client;
  try {
    client=await db.pool.connect();
    await client.query('BEGIN');
    const game=await client.query(
      'SELECT id,owner_identity_id,status FROM dnd_games WHERE id=$1 FOR UPDATE',[command.gameId]);
    if(game.rows.length!==1 || game.rows[0].status!=='open')return await abort(404,'Game not found');
    let assignments=[];
    if(actor.role==='dm') {
      if(game.rows[0].owner_identity_id!==actor.id)return await abort(403,'Not game owner');
    } else {
      const membership=await client.query(
        'SELECT id FROM dnd_players WHERE id=$1 AND game_id=$2 AND revoked_at IS NULL',
        [actor.id,command.gameId]);
      if(membership.rows.length!==1)return await abort(403,'Player session invalid');
      const owned=await client.query(
        'SELECT entity_id FROM dnd_assignments WHERE game_id=$1 AND player_id=$2',
        [command.gameId,actor.id]);
      assignments=owned.rows.map(row=>row.entity_id);
    }
    const previous=await client.query(
      'SELECT actor_identity,expected_revision,payload FROM dnd_actions WHERE game_id=$1 AND action_id=$2',
      [command.gameId,command.actionId]);
    const identity=actor.role+':'+actor.id;
    const requested=JSON.stringify({type:'move',entityId:command.entityId,destination:command.destination});
    if(previous.rows.length) {
      const past=previous.rows[0];
      if(past.actor_identity!==identity || Number(past.expected_revision)!==command.expectedRevision ||
         JSON.stringify(past.payload)!==requested)return await abort(409,'Action ID already used');
      await client.query('COMMIT');
      return {status:200,duplicate:true};
    }
    const snapshots=await client.query(
      'SELECT state,revision FROM dnd_board_snapshots WHERE game_id=$1 FOR UPDATE',[command.gameId]);
    if(snapshots.rows.length!==1)return await abort(404,'Board not initialized');
    const board=snapshots.rows[0].state;
    if(Number(snapshots.rows[0].revision)!==board?.revision)return await abort(503,'Board revision inconsistent');
    const result=applyMove(board,command,actor,assignments);
    if(result.status!==200)return await abort(result.status,result.error);
    const saved=await client.query(
      'UPDATE dnd_board_snapshots SET state=$1::jsonb,revision=$2,updated_at=now() WHERE game_id=$3 AND revision=$4 RETURNING revision',
      [JSON.stringify(result.board),result.revision,command.gameId,command.expectedRevision]);
    if(saved.rows.length!==1)return await abort(409,'Board changed');
    const advanced=await client.query(
      'UPDATE dnd_games SET revision=$1 WHERE id=$2 AND revision=$3 RETURNING revision',
      [result.revision,command.gameId,command.expectedRevision]);
    if(advanced.rows.length!==1)return await abort(409,'Game changed');
    await client.query(
      'INSERT INTO dnd_actions(game_id,action_id,actor_identity,expected_revision,payload) VALUES($1,$2,$3,$4,$5::jsonb)',
      [command.gameId,command.actionId,identity,command.expectedRevision,requested]);
    await client.query('COMMIT');
    return {status:200,revision:result.revision};
  } catch(error) {
    console.error('Atomic movement failed:',error instanceof Error?error.name:'Unknown');
    if(client)try{await client.query('ROLLBACK');}catch(rollbackError){
      console.error('Movement rollback failed:',rollbackError instanceof Error?rollbackError.name:'Unknown');
    }
    return {status:503,error:'Movement unavailable'};
  } finally {
    client?.release();
  }
  async function abort(status,error) {
    await client.query('ROLLBACK');
    return {status,error};
  }
}
