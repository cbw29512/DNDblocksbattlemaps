import {readGuestCookie,digest,validUuid} from './game-security.mjs';
import {readAuthorizedBoard} from './game-board-read.mjs';

/** Resolve permissions from trusted Identity and the signed guest cookie only. */
export async function getBoardForRequest(req,db,getDmUser,secret){
  try{
    const gameId=new URL(req.url).searchParams.get('gameId');
    if(!validUuid(gameId))return {status:400,error:'Invalid game ID'};
    const user=await getDmUser();
    if(user?.id){
      const owned=await db.sql`SELECT id FROM dnd_games WHERE id=${gameId} AND owner_identity_id=${user.id} AND status='open'`;
      if(owned.length===1)return readAuthorizedBoard(db,gameId,'dm');
    }
    const token=readGuestCookie(req);
    if(!token)return {status:404,error:'Game not found'};
    const hash=digest('guest:'+token,secret);
    const members=await db.sql`SELECT p.id FROM dnd_players p JOIN dnd_games g ON g.id=p.game_id WHERE p.game_id=${gameId} AND p.session_hash=${hash} AND p.revoked_at IS NULL AND g.status='open'`;
    if(members.length!==1)return {status:404,error:'Game not found'};
    return readAuthorizedBoard(db,gameId,'player');
  }catch(error){
    console.error('Board membership check failed:',error instanceof Error?error.name:'Unknown');
    return {status:503,error:'Board service unavailable'};
  }
}
