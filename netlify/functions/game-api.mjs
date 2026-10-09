/** Netlify-only backend. No credentials or authoritative game state in the browser. */
import { getUser } from '@netlify/identity';
import { getDatabase } from '@netlify/database';
import {getBoardForRequest} from './game-board-access.mjs';
import { newGameCode,cleanCode,cleanName,digest,newGuestToken,cookieForGuest,readGuestCookie,allowedOrigin,validUuid,validAction } from './game-security.mjs';

const reply=(data,status=200,headers={})=>Response.json(data,{status,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff',...headers}});
const fail=(status,error)=>reply({error},status);
const signingKey=()=>process.env.DND_SESSION_SIGNING_SECRET;
async function payload(req) {
  if(Number(req.headers.get('content-length')||0)>8192)throw new RangeError('Request too large');
  const input=await req.text();
  if(input.length>8192)throw new RangeError('Request too large');
  return JSON.parse(input||'{}');
}
const dm=async()=>{const user=await getUser();return user?.id ? user : null;};
export default async function handler(req, context) {
  const action=new URL(req.url).searchParams.get('action');
  if(!validAction(req.method,action))return fail(404,'Unknown action');
  if(req.method==='POST'&&!allowedOrigin(req))return fail(403,'Invalid request origin');
  if(!signingKey()||signingKey().length<32)return fail(503,'Game service is not configured');
  try {
    const db=getDatabase();
    if(action==='get-board') {
      const result=await getBoardForRequest(req,db,dm,signingKey());
      return reply(result.board?{board:result.board}:{error:result.error},result.status);
    }
    if(action==='my-games') {
      const user=await dm();if(!user)return fail(401,'DM sign-in required');
      const games=await db.sql`SELECT id,name,revision,status,created_at FROM dnd_games WHERE owner_identity_id=${user.id} ORDER BY created_at DESC LIMIT 100`;
      return reply({games});
    }
    if(action==='create-game') {
      const user=await dm();if(!user)return fail(401,'DM sign-in required');
      const data=await payload(req),name=cleanName(data.name,100);
      if(!name)return fail(400,'Invalid game name');
      const game=await db.sql`INSERT INTO dnd_games(owner_identity_id,name) VALUES (${user.id},${name}) RETURNING id,name,revision,status`;
      return reply({game:game[0]},201);
    }
    if(action==='new-invite') {
      const user=await dm();if(!user)return fail(401,'DM sign-in required');
      const data=await payload(req);if(!validUuid(data.gameId))return fail(400,'Invalid game ID');
      const owned=await db.sql`SELECT id FROM dnd_games WHERE id=${data.gameId} AND owner_identity_id=${user.id} AND status='open'`;
      if(!owned.length)return fail(404,'Game not found');
      for(let attempt=0;attempt<6;attempt++){
        const code=newGameCode(),hash=digest('invite:'+code,signingKey());
        const rows=await db.sql`INSERT INTO dnd_invitations(game_id,code_hash,expires_at) VALUES (${data.gameId},${hash},now()+interval '24 hours') ON CONFLICT(code_hash) DO NOTHING RETURNING id,expires_at`;
        if(rows.length)return reply({code,expiresAt:rows[0].expires_at},201);
      }
      return fail(503,'Could not issue an invitation');
    }
    if(action==='join-game'){
      // Check an atomic, database-backed 15-minute window before looking up a code.
      // Never rely on caller-supplied forwarding headers for client IP.
      const remoteAddress=context?.ip;
      if(typeof remoteAddress!=='string'||remoteAddress.length<3)return fail(503,'Join service temporarily unavailable');
      const actorHash=digest('join-ip:'+remoteAddress,signingKey());
      const attempts=await db.sql`
        INSERT INTO dnd_join_attempts(actor_hash,window_started,attempts)
        VALUES (${actorHash},now(),1)
        ON CONFLICT(actor_hash) DO UPDATE SET
          attempts=CASE WHEN dnd_join_attempts.window_started<now()-interval '15 minutes' THEN 1 ELSE dnd_join_attempts.attempts+1 END,
          window_started=CASE WHEN dnd_join_attempts.window_started<now()-interval '15 minutes' THEN now() ELSE dnd_join_attempts.window_started END
        RETURNING attempts`;
      if(Number(attempts[0]?.attempts)>8)return reply({error:'Too many join attempts. Try again in 15 minutes.'},429,{'Retry-After':'900'});
      const data=await payload(req),code=cleanCode(data.code),name=cleanName(data.name);
      if(!code||!name)return fail(400,'Invalid game code or name');
      const hash=digest('invite:'+code,signingKey());
      const found=await db.sql`SELECT i.game_id,g.name FROM dnd_invitations i JOIN dnd_games g ON g.id=i.game_id WHERE i.code_hash=${hash} AND i.revoked_at IS NULL AND i.expires_at>now() AND g.status='open'`;
      if(found.length!==1)return fail(404,'Game code not found or expired');
      const token=newGuestToken(),sessionHash=digest('guest:'+token,signingKey());
      const rows=await db.sql`INSERT INTO dnd_players(game_id,display_name,session_hash) VALUES (${found[0].game_id},${name},${sessionHash}) RETURNING id,game_id,display_name`;
      return reply({player:rows[0],gameName:found[0].name},201,{'Set-Cookie':cookieForGuest(token)});
    }
    if(action==='my-player-session'||action==='leave-game'){
      const token=readGuestCookie(req);if(!token)return fail(401,'No player session');
      const hash=digest('guest:'+token,signingKey());
      const matches=await db.sql`SELECT p.id,p.game_id,p.display_name,g.name AS game_name FROM dnd_players p JOIN dnd_games g ON g.id=p.game_id WHERE p.session_hash=${hash} AND p.revoked_at IS NULL AND g.status='open'`;
      if(!matches.length)return fail(401,'Player session expired');
      if(action==='leave-game'){
        await db.sql`UPDATE dnd_players SET revoked_at=now() WHERE session_hash=${hash}`;
        return reply({ok:true},200,{'Set-Cookie':'dnd_guest=; Path=/.netlify/functions/; Max-Age=0; Secure; HttpOnly; SameSite=Strict'});
      }
      // Restore only the authenticated guest's own assignments. Never expose board state here.
      const member=matches[0];
      const assignments=await db.sql`SELECT entity_id FROM dnd_assignments WHERE game_id=${member.game_id} AND player_id=${member.id} ORDER BY entity_id`;
      await db.sql`UPDATE dnd_players SET last_seen_at=now() WHERE id=${member.id} AND revoked_at IS NULL`;
      return reply({player:member,assignedEntityIds:assignments.map(row=>row.entity_id)});
    }
    if(action==='players'||action==='assign-piece') {
      const user=await dm();if(!user)return fail(401,'DM sign-in required');
      const data=action==='players'?Object.fromEntries(new URL(req.url).searchParams):await payload(req);
      if(!validUuid(data.gameId))return fail(400,'Invalid game ID');
      const owned=await db.sql`SELECT id FROM dnd_games WHERE id=${data.gameId} AND owner_identity_id=${user.id} AND status='open'`;
      if(!owned.length)return fail(404,'Game not found');
      if(action==='players'){
        const players=await db.sql`SELECT id,display_name,joined_at,last_seen_at FROM dnd_players WHERE game_id=${data.gameId} AND revoked_at IS NULL ORDER BY joined_at`;
        return reply({players});
      }
      if(!validUuid(data.playerId)||typeof data.entityId!=='string'||data.entityId.length<1||data.entityId.length>128)return fail(400,'Invalid assignment');
      const player=await db.sql`SELECT id FROM dnd_players WHERE id=${data.playerId} AND game_id=${data.gameId} AND revoked_at IS NULL`;
      if(!player.length)return fail(404,'Player not found');
      await db.sql`INSERT INTO dnd_assignments(game_id,player_id,entity_id) VALUES (${data.gameId},${data.playerId},${data.entityId}) ON CONFLICT(game_id,entity_id) DO UPDATE SET player_id=EXCLUDED.player_id`;
      return reply({ok:true});
    }
    return fail(404,'Unknown action');
  }catch(err){
    if(err instanceof RangeError||err instanceof SyntaxError)return fail(400,'Invalid request body');
    console.error('Game API error:',err instanceof Error?err.name:'Unknown');
    return fail(503,'Game service temporarily unavailable');
  }
}
