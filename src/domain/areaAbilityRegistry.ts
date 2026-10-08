import { AREA_PRESETS, type AreaTemplate } from './areaTemplates.js';
export type RulesEdition = '2014' | '2024';
export type VerificationStatus = 'illustrative' | 'source-reviewed';
export interface AreaAbilityRecord {
  key: string;
  edition: RulesEdition;
  sourceEntityId: string;
  actionId: string;
  sourceReference: string | null;
  verification: VerificationStatus;
  area: AreaTemplate;
}
/** No sample below is certified RAW; each edition has an independent identity. */
export const AREA_ABILITY_REGISTRY: readonly AreaAbilityRecord[] = (['2014','2024'] as const)
  .flatMap(edition=>AREA_PRESETS.map(area=>({
    key:`${edition}:sample:${area.id}`,
    edition,
    sourceEntityId:'sample',
    actionId:area.id,
    sourceReference:null,
    verification:'illustrative' as const,
    area
  })));
export function getAreaAbility(key:string):AreaAbilityRecord | null {
  return AREA_ABILITY_REGISTRY.find(record=>record.key===key) ?? null;
}
export function isRawCertified(record:AreaAbilityRecord):boolean {
  return record.verification==='source-reviewed' && Boolean(record.sourceReference);
}
