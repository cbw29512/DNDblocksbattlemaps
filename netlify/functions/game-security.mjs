import { createHmac, randomBytes } from 'node:crypto';

const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
/** 32-character alphabet divides 256 exactly: uniform code selection. */
export function newGameCode() {
  const chars = [];
  while(chars.length < 6) {
    for(const byte of randomBytes(12)) {
      chars.push(ALPHABET[byte % ALPHABET.length]);
      if(chars.length === 6) break;
    }
  }
  return chars.join('');
}
export function cleanCode(input) {
  const code=typeof input==='string' ? input.trim().replace(/[\s-]/g,'').toUpperCase() : '';
  return code.length===6 && [...code].every(char=>ALPHABET.includes(char)) ? code : null;
}
export function cleanName(input,max=40) {
  const name=typeof input==='string' ? input.trim().replace(/\s+/g,' ') : '';
  return name.length>=1 && name.length<=max && !/[\x00-\x1f\x7f<>]/.test(name) ? name : null;
}
export function digest(value,secret) {
  if(typeof secret!=='string'||secret.length<32) throw new Error('Signing secret unavailable');
  return createHmac('sha256',secret).update(value).digest('hex');
}
export const newGuestToken = () => randomBytes(32).toString('base64url');
export function cookieForGuest(token) {
  return 'dnd_guest='+encodeURIComponent(token)+'; Path=/.netlify/functions/; Max-Age=2592000; Secure; HttpOnly; SameSite=Strict';
}
export function readGuestCookie(req) {
  const raw=req.headers.get('cookie')||'';
  const part=raw.split(';').map(x=>x.trim()).find(x=>x.startsWith('dnd_guest='));
  if(!part)return null;
  const token=part.slice(10);
  return /^[A-Za-z0-9_-]{43}$/.test(token)?token:null;
}
export function allowedOrigin(req) {
  const origin=req.headers.get('origin');
  if(!origin)return false;
  try{return new URL(origin).origin === new URL(req.url).origin;}catch{return false;}
}
export const validUuid = input => typeof input === 'string' && /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(input);
export function validAction(method,action) {
  return (method==='GET'&&['my-games','my-player-session','players','get-board'].includes(action)) ||
    (method==='POST'&&['create-game','new-invite','join-game','assign-piece','leave-game'].includes(action));
}
