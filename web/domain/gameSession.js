/** Public game entry validation. Authentication/permissions are always server-enforced. */
export const GAME_CODE_LENGTH = 6;
const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
export function normalizeGameCode(input): string {
  return input.trim().replace(/[\s-]/g, '').toUpperCase();
}
export function validateGameCode(input): string | {
  const code = normalizeGameCode(input);
  return code.length === GAME_CODE_LENGTH && [...code].every(ch => CODE_ALPHABET.includes(ch)) ? code :;
}
export function validatePlayerName(input): string | {
  const name = input.trim().replace(/\s+/g, ' ');
  if (name.length < 1 || name.length > 40 || /[\x00-\x1f\x7f<>]/.test(name)) return;
  return name;
}
export function createJoinUrl(siteUrl, code): string {
  const validated = validateGameCode(code);
  if (!validated) throw new Error('Invalid game code');
  const url = new URL(siteUrl);
  url.search = '';
  url.hash = '';
  url.searchParams.set('view', 'join');
  url.searchParams.set('code', validated);
  return url.toString();
}
export function mayControlEntity(role, assignedEntityIds: readonly string[], entityId: string) {
  return role === 'dm' || assignedEntityIds.includes(entityId);
}
export function mayEditMap(role) { return role === 'dm'; }
