import { AREA_PRESETS } from './areaTemplates.js?v=2693d6ceb233';
/** No sample below is certified RAW; each edition has an independent identity. */
export const AREA_ABILITY_REGISTRY = ['2014', '2024']
    .flatMap(edition => AREA_PRESETS.map(area => ({
    key: `${edition}:sample:${area.id}`,
    edition,
    sourceEntityId: 'sample',
    actionId: area.id,
    sourceReference: null,
    verification: 'illustrative',
    area
})));
export function getAreaAbility(key) {
    return AREA_ABILITY_REGISTRY.find(record => record.key === key) ?? null;
}
export function isRawCertified(record) {
    return record.verification === 'source-reviewed' && Boolean(record.sourceReference);
}
