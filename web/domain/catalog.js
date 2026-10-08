import { SRD_MONSTER_BLOCKS } from './srdMonsterBlocks.js?v=9ce5e3e36d5e';
import { generatedCubeArt } from './faceArt.js?v=9ce5e3e36d5e';
export const TERRAIN_THEMES = {
    castle: { id: 'castle', name: 'Castle', tagline: 'Stone halls & keeps', groundColor: 0x777b77, accentCss: '#d7b56d', swatchCss: 'linear-gradient(135deg,#454946,#9aa09a)' },
    inn: { id: 'inn', name: 'Inn', tagline: 'Warm rooms & taverns', groundColor: 0x75533c, accentCss: '#e1a85e', swatchCss: 'linear-gradient(135deg,#593b2d,#bd875a)' },
    field: { id: 'field', name: 'Field', tagline: 'Grass, roads & ambushes', groundColor: 0x617c45, accentCss: '#9cc56b', swatchCss: 'linear-gradient(135deg,#405b32,#91b769)' },
    sea: { id: 'sea', name: 'Sea', tagline: 'Docks, ships & islands', groundColor: 0x315f74, accentCss: '#6bc7dc', swatchCss: 'linear-gradient(135deg,#254b61,#5da8c2)' },
    volcano: { id: 'volcano', name: 'Volcano', tagline: 'Lava, rock & danger', groundColor: 0x3b302c, accentCss: '#ff7a3d', swatchCss: 'linear-gradient(135deg,#241e1c,#b94a24)' }
};
const heroArt = (id, name) => ({
    src: 'https://raw.githubusercontent.com/cbw29512/D20-ironpit/main/frontend/assets/portraits/heroes/' + id + '.webp',
    alt: name,
    source: 'iron-pit',
    sourceId: id
});
const monsterArt = (id, name) => ({
    src: 'https://raw.githubusercontent.com/cbw29512/D20-ironpit/main/frontend/assets/portraits/monsters/' + id + '.webp',
    alt: name,
    source: 'iron-pit',
    sourceId: id
});
function cube(id, name, category, color, art, tags = []) {
    return {
        id, name, category, color, art, tags,
        shape: 'cube', height: 1, width: 1, depth: 1, footprintCells: 1
    };
}
function generated(id, name, category, color, icon, tags = []) {
    return cube(id, name, category, color, generatedCubeArt(id, name, icon, color), tags);
}
function hero(id, name, color) {
    return cube('hero-' + id, name, 'Characters', color, heroArt('hero-2024-' + id, name), ['player', 'class', id]);
}
const STARTER_2014_CR = { goblin: '1/4', skeleton: '1/4', zombie: '1/4', wolf: '1/4', mimic: '2', ghoul: '1', kobold: '1/8', bandit: '1/8', orc: '1/2' };
function monster(id, name, color) {
    return { ...cube('monster-' + id, name, 'Monsters', color, monsterArt(id, name), ['monster', id]), challengeRating: STARTER_2014_CR[id], edition: '2014' };
}
const BUILD_ITEMS = [
    generated('stone-block', 'Stone', 'Build', 0x818680, 'stone', ['stone', 'floor', 'castle', 'dungeon']),
    generated('wall', 'Stone Wall', 'Build', 0x686d68, 'wall', ['stone', 'wall', 'castle', 'dungeon']),
    generated('wood-block', 'Wood Floor', 'Build', 0x8a5d3b, 'wood', ['wood', 'floor', 'inn', 'ship']),
    generated('wood-wall', 'Wood Wall', 'Build', 0x6f4932, 'wall', ['wood', 'wall', 'inn']),
    generated('dirt', 'Dirt', 'Build', 0x76503a, 'terrain', ['ground', 'field', 'cave']),
    generated('grass', 'Grass', 'Build', 0x5f7f4b, 'terrain', ['ground', 'field']),
    generated('sand', 'Sand', 'Build', 0xb99c65, 'terrain', ['ground', 'beach', 'desert']),
    generated('water', 'Water', 'Build', 0x3e7897, 'water', ['water', 'sea', 'river']),
    generated('lava', 'Lava', 'Build', 0xb94a24, 'lava', ['lava', 'volcano', 'hazard']),
    generated('snow', 'Snow', 'Build', 0xcfd9dc, 'terrain', ['snow', 'ice', 'ground']),
    generated('mud', 'Mud', 'Build', 0x58483b, 'terrain', ['mud', 'swamp', 'ground']),
    generated('cobblestone', 'Cobblestone', 'Build', 0x777975, 'stone', ['stone', 'road', 'floor']),
    generated('dungeon-tile', 'Dungeon Tile', 'Build', 0x565b58, 'wall', ['dungeon', 'stone', 'floor']),
    generated('brick-floor', 'Brick Floor', 'Build', 0x8f6653, 'wall', ['brick', 'floor']),
    generated('brick-wall', 'Brick Wall', 'Build', 0x795244, 'wall', ['brick', 'wall']),
    generated('castle-wall', 'Castle Wall', 'Build', 0x737872, 'wall', ['castle', 'wall', 'stone']),
    generated('cave-wall', 'Cave Wall', 'Build', 0x5a554e, 'rock', ['cave', 'rock', 'wall']),
    generated('metal-wall', 'Metal Wall', 'Build', 0x66727a, 'wall', ['metal', 'wall']),
    generated('cell-bars', 'Cell Bars', 'Build', 0x687177, 'bars', ['bars', 'prison', 'gate']),
    generated('pillar', 'Pillar', 'Build', 0x94958f, 'pillar', ['column', 'stone', 'temple']),
    generated('window', 'Window', 'Build', 0x607b8b, 'window', ['window', 'wall']),
    generated('archway', 'Archway', 'Build', 0x807d72, 'arch', ['arch', 'doorway', 'castle']),
    generated('door', 'Closed Door', 'Build', 0x70472d, 'door', ['door', 'closed', 'entry']),
    generated('open-doorway', 'Open Doorway', 'Build', 0x7e715e, 'arch', ['door', 'open', 'entry']),
    generated('secret-door', 'Secret Door', 'Build', 0x696b65, 'wall', ['door', 'secret', 'hidden']),
    generated('portcullis', 'Portcullis', 'Build', 0x5c6265, 'bars', ['gate', 'castle', 'bars']),
    generated('stairs', 'Stairs', 'Build', 0x837e71, 'stairs', ['stairs', 'vertical']),
    generated('ladder', 'Ladder', 'Build', 0x8d613f, 'ladder', ['ladder', 'vertical']),
    generated('bridge', 'Bridge', 'Build', 0x815737, 'bridge', ['bridge', 'crossing']),
    generated('fence', 'Fence', 'Build', 0x795236, 'bars', ['fence', 'field', 'boundary']),
    generated('dock', 'Dock', 'Build', 0x755039, 'bridge', ['dock', 'sea', 'wood']),
    generated('ship-deck', 'Ship Deck', 'Build', 0x80583c, 'wood', ['ship', 'sea', 'deck']),
    generated('obsidian', 'Obsidian', 'Build', 0x29252e, 'stone', ['volcano', 'stone']),
    generated('ice', 'Ice', 'Build', 0x83b5c7, 'water', ['ice', 'snow']),
    generated('pit', 'Open Pit', 'Build', 0x292724, 'pit', ['pit', 'hole', 'hazard']),
    generated('trapdoor', 'Trapdoor', 'Build', 0x6e4c35, 'door', ['door', 'trap', 'floor'])
];
const PROP_ITEMS = [
    generated('table', 'Table', 'Props', 0x7c5335, 'table', ['furniture', 'inn']),
    generated('chair', 'Chair', 'Props', 0x765036, 'chair', ['furniture', 'inn']),
    generated('bed', 'Bed', 'Props', 0x735a4f, 'bed', ['furniture', 'inn']),
    generated('chest', 'Chest', 'Props', 0xa36d38, 'chest', ['storage', 'loot', 'mimic']),
    generated('barrel', 'Barrel', 'Props', 0x8a5a34, 'barrel', ['storage', 'inn', 'dock']),
    generated('crate', 'Crate', 'Props', 0x986a43, 'crate', ['storage', 'dock']),
    generated('torch', 'Torch', 'Props', 0xe08b37, 'torch', ['light', 'fire']),
    generated('bookshelf', 'Bookshelf', 'Props', 0x74543a, 'books', ['books', 'furniture']),
    generated('throne', 'Throne', 'Props', 0x8e7448, 'throne', ['castle', 'furniture']),
    generated('desk', 'Desk', 'Props', 0x704c35, 'table', ['furniture', 'study']),
    generated('cabinet', 'Cabinet', 'Props', 0x6f4b34, 'cabinet', ['storage', 'furniture']),
    generated('shelf', 'Shelf', 'Props', 0x6c4a34, 'books', ['storage', 'furniture']),
    generated('altar', 'Altar', 'Props', 0x78746a, 'altar', ['temple', 'ritual']),
    generated('statue', 'Statue', 'Props', 0x82847e, 'statue', ['stone', 'temple', 'castle']),
    generated('sarcophagus', 'Sarcophagus', 'Props', 0x716c60, 'tomb', ['crypt', 'tomb']),
    generated('fountain', 'Fountain', 'Props', 0x5e8291, 'fountain', ['water', 'town']),
    generated('well', 'Well', 'Props', 0x6c6b60, 'well', ['water', 'town']),
    generated('fireplace', 'Fireplace', 'Props', 0x9a5431, 'fire', ['fire', 'inn']),
    generated('rug', 'Rug', 'Props', 0x8c4b46, 'rug', ['furniture', 'floor']),
    generated('campfire', 'Campfire', 'Props', 0xc86d2e, 'fire', ['fire', 'camp']),
    generated('brazier', 'Brazier', 'Props', 0xa45d30, 'fire', ['fire', 'temple']),
    generated('banner', 'Banner', 'Props', 0x744a63, 'banner', ['castle', 'decoration']),
    generated('lantern', 'Lantern', 'Props', 0xd58a3c, 'lantern', ['light']),
    generated('cauldron', 'Cauldron', 'Props', 0x4f5552, 'cauldron', ['cooking', 'witch']),
    generated('anvil', 'Anvil', 'Props', 0x555d60, 'anvil', ['smith', 'forge']),
    generated('forge', 'Forge', 'Props', 0x8d4a2e, 'fire', ['smith', 'fire']),
    generated('tombstone', 'Tombstone', 'Props', 0x6f716e, 'tomb', ['grave', 'crypt']),
    generated('cage', 'Cage', 'Props', 0x5c6265, 'cage', ['prison', 'bars']),
    generated('shackles-post', 'Shackles', 'Props', 0x565b5d, 'bars', ['prison', 'restraint']),
    generated('lever', 'Lever', 'Props', 0x81613f, 'lever', ['switch', 'trigger']),
    generated('switch', 'Switch', 'Props', 0x5f6670, 'switch', ['switch', 'trigger']),
    generated('pressure-plate', 'Pressure Plate', 'Props', 0x6c675c, 'plate', ['trap', 'trigger']),
    generated('hidden-trigger', 'Hidden Trigger', 'Props', 0x4f504b, 'switch', ['hidden', 'trap', 'trigger']),
    generated('spike-trap', 'Spike Trap', 'Props', 0x6a5c52, 'trap', ['trap', 'spike', 'hazard']),
    generated('snare-trap', 'Snare Trap', 'Props', 0x6f5b42, 'trap', ['trap', 'snare', 'restraint']),
    generated('spring-trap', 'Spring Trap', 'Props', 0x6f6049, 'trap', ['trap', 'spring', 'restraint']),
    generated('flame-jet', 'Flame Jet', 'Props', 0xb85a2c, 'fire', ['trap', 'fire', 'hazard']),
    generated('dart-trap', 'Dart Trap', 'Props', 0x6b6358, 'trap', ['trap', 'dart', 'hazard']),
    generated('falling-block', 'Falling Block', 'Props', 0x6d6960, 'stone', ['trap', 'falling', 'hazard']),
    generated('collapsing-floor', 'Collapsing Floor', 'Props', 0x5a5148, 'pit', ['trap', 'floor', 'hazard']),
    generated('web-trap', 'Web Trap', 'Props', 0x6c7073, 'web', ['trap', 'web', 'restraint']),
    generated('acid-pool', 'Acid Pool', 'Props', 0x6f8b46, 'acid', ['acid', 'hazard']),
    generated('poison-cloud', 'Poison Cloud', 'Props', 0x657d4b, 'poison', ['poison', 'hazard']),
    generated('alarm-rune', 'Alarm Rune', 'Props', 0x66549a, 'rune', ['magic', 'alarm', 'trigger']),
    generated('tree', 'Tree', 'Props', 0x557849, 'tree', ['field', 'forest', 'outdoor']),
    generated('rock', 'Rock', 'Props', 0x6d6b65, 'rock', ['field', 'cave', 'outdoor']),
    generated('bush', 'Bush', 'Props', 0x567b48, 'bush', ['field', 'forest', 'outdoor']),
    generated('log', 'Log', 'Props', 0x795039, 'log', ['field', 'forest', 'outdoor']),
    generated('tent', 'Tent', 'Props', 0x887052, 'tent', ['camp', 'outdoor']),
    generated('wagon', 'Wagon', 'Props', 0x805a3c, 'wagon', ['road', 'outdoor']),
    generated('boat', 'Boat', 'Props', 0x526e79, 'boat', ['sea', 'water'])
];
const CHARACTER_ITEMS = [
    hero('barbarian', 'Barbarian', 0x8b4b3d),
    hero('bard', 'Bard', 0x8d5e87),
    hero('cleric', 'Cleric', 0xb7a87d),
    hero('druid', 'Druid', 0x5f7b52),
    hero('fighter', 'Fighter', 0x8f6d4e),
    hero('monk', 'Monk', 0x8b744e),
    hero('paladin', 'Paladin', 0xb39c65),
    hero('ranger', 'Ranger', 0x55714e),
    hero('rogue', 'Rogue', 0x5f625f),
    hero('sorcerer', 'Sorcerer', 0x895260),
    hero('warlock', 'Warlock', 0x5b536f),
    hero('wizard', 'Wizard', 0x5c608d)
];
const MONSTER_ITEMS = [
    monster('goblin', 'Goblin', 0x657b48),
    monster('skeleton', 'Skeleton', 0xb8b09d),
    monster('zombie', 'Zombie', 0x6c7457),
    monster('wolf', 'Wolf', 0x77746c),
    monster('mimic', 'Mimic', 0x79513a),
    monster('ghoul', 'Ghoul', 0x6f725b),
    monster('kobold', 'Kobold', 0x8e5d42),
    monster('bandit', 'Bandit', 0x705d4c),
    monster('orc', 'Orc', 0x577a4b)
];
const SRD_MONSTER_ITEMS = SRD_MONSTER_BLOCKS.map(([id, name, size, cr, art]) => {
    const footprint = size === 'Gargantuan' ? 4 : size === 'Huge' ? 3 : size === 'Large' ? 2 : 1;
    const artwork = art ? monsterArt(art, name) : generatedCubeArt('monster-srd-' + id, name, 'rune', 0x806347);
    return { ...cube('monster-srd-' + id, name, 'Monsters', 0x806347, artwork, ['monster', 'srd', size.toLowerCase()]),
        footprintCells: footprint, creatureSize: size, challengeRating: cr ?? undefined, edition: '2024' };
});
export const CATALOG_CATEGORIES = ['Build', 'Props', 'Characters', 'Monsters'];
export const DEFAULT_PALETTE = [
    ...BUILD_ITEMS.map((item) => item.id),
    ...PROP_ITEMS.map((item) => item.id),
    ...CHARACTER_ITEMS.map((item) => item.id),
    ...MONSTER_ITEMS.map((item) => item.id),
    ...SRD_MONSTER_ITEMS.map((item) => item.id)
];
export const PALETTE = Object.fromEntries([...BUILD_ITEMS, ...PROP_ITEMS, ...CHARACTER_ITEMS, ...MONSTER_ITEMS, ...SRD_MONSTER_ITEMS]
    .map((item) => [item.id, item]));
export function catalogIdsForCategory(category) {
    return DEFAULT_PALETTE.filter((id) => PALETTE[id]?.category === category);
}
export function catalogMatches(item, query) {
    const normalized = query.trim().toLowerCase();
    if (!normalized)
        return true;
    const haystack = [
        item.name,
        item.id,
        item.category,
        ...(item.tags ?? [])
    ].join(' ').toLowerCase();
    return haystack.includes(normalized);
}
const UNKNOWN_CATALOG_ITEM = generated('__unknown__', 'Unknown', 'Props', 0x555555, 'rune', ['unknown', 'missing']);
export function getCatalogItem(id) {
    const item = PALETTE[id];
    if (item)
        return item;
    console.warn('[catalog] Unknown catalog id; using safe fallback.', { id });
    return UNKNOWN_CATALOG_ITEM;
}
