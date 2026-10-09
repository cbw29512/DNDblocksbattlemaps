import {readGuestCookie,digest,validUuid} from './game-security.mjs';
import {commitMove} from './game-move-transaction.mjs';

/** Derive actor from Netlify Identity or the scoped guest cookie, never input JSON. */
export async function moveForRequest(req,db,getDmUser,secret,command){
  try{
    if(!validUuid(command?.gameId))return {status:400,error:'Invalid game ID'};
    const user=await getDmUser();
    if(user?.id){
      const owned=await db.sql`SELECT id FROM dnd_games WHERE id=${command.gameId} AND owner_identity_id=${user.id} AND status='open'`;
      if(owned.length===1)return commitMove(db,command,{id:user.id,role:'dm',verified:true});
    }
    const token=readGuestCookie(req);
    if(!token)return {status:403,error:'Access denied'};
    const hash=digest('guest:'+token,secret);
    const members=await db.sql`SELECT p.id FROM dnd_players p JOIN dnd_games g ON g.id=p.game_id WHERE p.game_id=${command.gameId} AND p.session_hash=${hash} AND p.revoked_at IS NULL AND g.status='open'`;
    if(members.length!==1)return {status:403,error:'Access denied'};
    return commitMove(db,command,{id:members[0].id,role:'player',verified:true});
  }catch(error){
    console.error('Move authentication failed:',error instanceof Error?error.name:'Unknown');
    return {status:503,error:'Movement unavailable'};
  }
}
