import {validateBoardSnapshot,playerBoardSnapshot} from './game-board-schema.mjs';

/**
 * Read-only board service. Caller must supply a server-verified role, never a
 * role from HTTP input. The query must already be scoped to an authorized game.
 */
export async function readAuthorizedBoard(db, gameId, role) {
  try {
    if(role!=='dm' && role!=='player') return {status:403,error:'Access denied'};
    const rows=await db.sql`SELECT state,revision FROM dnd_board_snapshots WHERE game_id=${gameId}`;
    if(rows.length!==1)return {status:404,error:'Board not initialized'};
    const board=rows[0].state;
    if(!validateBoardSnapshot(board) || Number(rows[0].revision)!==board.revision)
      return {status:503,error:'Board state unavailable'};
    if(role==='dm')return {status:200,board};
    const safe=playerBoardSnapshot(board);
    return safe ? {status:200,board:safe} : {status:503,error:'Board state unavailable'};
  } catch(error) {
    console.error('Authorized board read failed:',error instanceof Error?error.name:'Unknown');
    return {status:503,error:'Board state unavailable'};
  }
}
