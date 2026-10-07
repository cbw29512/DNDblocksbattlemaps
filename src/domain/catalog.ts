import type {
  CatalogArt, CatalogCategory, CatalogId, PaletteItem, TerrainId, TerrainTheme
} from './types.js';

export const TERRAIN_THEMES: Record<TerrainId, TerrainTheme> = {
  castle:{id:'castle',name:'Castle',tagline:'Stone halls & keeps',groundColor:0x777b77,accentCss:'#d7b56d',swatchCss:'linear-gradient(135deg,#454946,#9aa09a)'},
  inn:{id:'inn',name:'Inn',tagline:'Warm rooms & taverns',groundColor:0x75533c,accentCss:'#e1a85e',swatchCss:'linear-gradient(135deg,#593b2d,#bd875a)'},
  field:{id:'field',name:'Field',tagline:'Grass, roads & ambushes',groundColor:0x617c45,accentCss:'#9cc56b',swatchCss:'linear-gradient(135deg,#405b32,#91b769)'},
  sea:{id:'sea',name:'Sea',tagline:'Docks, ships & islands',groundColor:0x315f74,accentCss:'#6bc7dc',swatchCss:'linear-gradient(135deg,#254b61,#5da8c2)'},
  volcano:{id:'volcano',name:'Volcano',tagline:'Lava, rock & danger',groundColor:0x3b302c,accentCss:'#ff7a3d',swatchCss:'linear-gradient(135deg,#241e1c,#b94a24)'}
};

const heroArt=(id:string,name:string):CatalogArt=>({
  src:`assets/catalog/heroes/${id}.webp`,alt:name,source:'iron-pit',sourceId:id
});
const monsterArt=(id:string,name:string):CatalogArt=>({
  src:`assets/catalog/monsters/${id}.webp`,alt:name,source:'iron-pit',sourceId:id
});

export const PALETTE:Record<CatalogId,PaletteItem>={
  'stone-block':{id:'stone-block',name:'Stone',category:'Build',color:0x8c908c,shape:'cube',height:1,width:1,depth:1},
  wall:{id:'wall',name:'Stone Wall',category:'Build',color:0x666b68,shape:'cube',height:1,width:1,depth:1},
  'wood-block':{id:'wood-block',name:'Wood',category:'Build',color:0x8a5f3d,shape:'cube',height:1,width:1,depth:1},
  'wood-wall':{id:'wood-wall',name:'Wood Wall',category:'Build',color:0x6d4932,shape:'cube',height:1,width:1,depth:1},
  door:{id:'door',name:'Door',category:'Build',color:0x70472d,shape:'door',height:1,width:.82,depth:.24},
  pillar:{id:'pillar',name:'Pillar',category:'Build',color:0x97978f,shape:'pillar',height:1,width:.54,depth:.54},

  table:{id:'table',name:'Table',category:'Props',color:0x7c5335,shape:'cube',height:.42,width:.82,depth:.58},
  chair:{id:'chair',name:'Chair',category:'Props',color:0x765036,shape:'cube',height:.62,width:.42,depth:.42},
  bed:{id:'bed',name:'Bed',category:'Props',color:0x735a4f,shape:'cube',height:.28,width:.82,depth:.92},
  chest:{id:'chest',name:'Chest',category:'Props',color:0xa36d38,shape:'cube',height:.55,width:.72,depth:.72},
  barrel:{id:'barrel',name:'Barrel',category:'Props',color:0x8a5a34,shape:'barrel',height:.72,width:.56,depth:.56},
  crate:{id:'crate',name:'Crate',category:'Props',color:0x986a43,shape:'cube',height:.62,width:.66,depth:.66},
  torch:{id:'torch',name:'Torch',category:'Props',color:0xe08b37,shape:'pillar',height:.8,width:.22,depth:.22},

  'hero-fighter':{id:'hero-fighter',name:'Fighter',category:'Characters',color:0x8f6d4e,shape:'standee',height:1.18,width:.72,depth:.72,art:heroArt('hero-2024-fighter','Fighter')},
  'hero-cleric':{id:'hero-cleric',name:'Cleric',category:'Characters',color:0xb7a87d,shape:'standee',height:1.18,width:.72,depth:.72,art:heroArt('hero-2024-cleric','Cleric')},
  'hero-rogue':{id:'hero-rogue',name:'Rogue',category:'Characters',color:0x5f625f,shape:'standee',height:1.18,width:.72,depth:.72,art:heroArt('hero-2024-rogue','Rogue')},
  'hero-wizard':{id:'hero-wizard',name:'Wizard',category:'Characters',color:0x5c608d,shape:'standee',height:1.18,width:.72,depth:.72,art:heroArt('hero-2024-wizard','Wizard')},

  'monster-goblin':{id:'monster-goblin',name:'Goblin',category:'Monsters',color:0x657b48,shape:'standee',height:1.05,width:.68,depth:.68,art:monsterArt('goblin','Goblin')},
  'monster-skeleton':{id:'monster-skeleton',name:'Skeleton',category:'Monsters',color:0xb8b09d,shape:'standee',height:1.12,width:.7,depth:.7,art:monsterArt('skeleton','Skeleton')},
  'monster-zombie':{id:'monster-zombie',name:'Zombie',category:'Monsters',color:0x6c7457,shape:'standee',height:1.12,width:.72,depth:.72,art:monsterArt('zombie','Zombie')},
  'monster-wolf':{id:'monster-wolf',name:'Wolf',category:'Monsters',color:0x77746c,shape:'standee',height:.92,width:.76,depth:.76,art:monsterArt('wolf','Wolf')},
  'monster-mimic':{id:'monster-mimic',name:'Mimic',category:'Monsters',color:0x79513a,shape:'standee',height:1.02,width:.74,depth:.74,art:monsterArt('mimic','Mimic')},
  'monster-ghoul':{id:'monster-ghoul',name:'Ghoul',category:'Monsters',color:0x6f725b,shape:'standee',height:1.08,width:.7,depth:.7,art:monsterArt('ghoul','Ghoul')},
  'monster-kobold':{id:'monster-kobold',name:'Kobold',category:'Monsters',color:0x8e5d42,shape:'standee',height:1,width:.66,depth:.66,art:monsterArt('kobold','Kobold')},
  'monster-bandit':{id:'monster-bandit',name:'Bandit',category:'Monsters',color:0x705d4c,shape:'standee',height:1.1,width:.7,depth:.7,art:monsterArt('bandit','Bandit')},

  // Backward compatibility for existing prototype saves.
  orc:{id:'orc',name:'Orc',category:'Monsters',color:0x577a4b,shape:'standee',height:1.05,width:.68,depth:.68}
};

export const CATALOG_CATEGORIES:CatalogCategory[]=['Build','Props','Characters','Monsters'];
export const DEFAULT_PALETTE:CatalogId[]=[
  'stone-block','wall','wood-block','wood-wall','door','pillar',
  'table','chair','bed','chest','barrel','crate','torch',
  'hero-fighter','hero-cleric','hero-rogue','hero-wizard',
  'monster-goblin','monster-skeleton','monster-zombie','monster-wolf',
  'monster-mimic','monster-ghoul','monster-kobold','monster-bandit','orc'
];

export function catalogIdsForCategory(category:CatalogCategory):CatalogId[]{
  return DEFAULT_PALETTE.filter((id)=>PALETTE[id].category===category);
}
