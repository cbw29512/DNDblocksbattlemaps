import type { BoardState } from './types.js';
import type { PartyRoster } from './party.js';
import { createBoardState, createWorldObject } from './commands.js';
import { reconcilePartyOnMap } from './party.js';

export const STARTER_TEMPLATES = [
  { id: 'inn', name: 'Roadside Inn', terrain: 'inn', description: 'Common room, bar, kitchen, guest rooms, and a welcoming front door.' },
  { id: 'castle', name: 'Castle Keep', terrain: 'castle', description: 'Courtyard, gate, watch posts, and a fortified hall.' },
  { id: 'dungeon', name: 'Starter Dungeon', terrain: 'castle', description: 'Four connected chambers, doors, traps, and a treasure room.' },
  { id: 'forest', name: 'Forest Camp', terrain: 'field', description: 'Campsite, tents, trees, a trail, and cover.' },
  { id: 'harbor', name: 'Harbor Dock', terrain: 'sea', description: 'Piers, cargo, warehouse, and a moored boat.' },
  { id: 'cave', name: 'Goblin Cave', terrain: 'castle', description: 'Winding stone chambers, crates, campfire, and an ambush.' },
  { id: 'temple', name: 'Ancient Temple', terrain: 'castle', description: 'Antechamber, columns, altar, and sealed inner sanctum.' },
  { id: 'ruins', name: 'Ruined Outpost', terrain: 'field', description: 'Broken walls, collapsed sections, and scattered supplies.' }
] as const;

export function buildStarterTemplate(templateId: string, mapId: string, roster: PartyRoster = {}): BoardState {
  const template = STARTER_TEMPLATES.find(t => t.id === templateId);
  if (!template) throw new Error('Unknown starter template');
  if (!/^[a-z0-9-]{6,80}$/.test(mapId)) throw new Error('Invalid map identifier');
  const state = createBoardState(template.terrain);
  state.mapId = mapId;
  state.partyStart = { x: 0, z: 11, elevation: 1 };
  const objects: BoardState['objects'] = [];
  const seen = new Set();
  let sequence = 0;
  const add = (id: string, x: number, z: number, y = 1): void => {
    const key = [id,x,z,y].join(':');
    if (seen.has(key)) return;
    seen.add(key);
    objects.push(createWorldObject('template-' + mapId + '-' + sequence++, id, { x, z, elevation: y }, sequence));
  };
  const line = (id: string, x1: number, z1: number, x2: number, z2: number, y = 1): void => {
    if (x1 === x2) for (let z=Math.min(z1,z2);z<=Math.max(z1,z2);z++) add(id,x1,z,y);
    else if (z1 === z2) for (let x=Math.min(x1,x2);x<=Math.max(x1,x2);x++) add(id,x,z1,y);
  };
  const floor = (id: string, x1: number, z1: number, x2: number, z2: number): void => {
    for (let x=x1;x<=x2;x++) for(let z=z1;z<=z2;z++) add(id,x,z,0);
  };
  const walls = (id: string, x1: number, z1: number, x2: number, z2: number, doorX?: number, doorZ?: number): void => {
    line(id,x1,z1,x2,z1);line(id,x1,z2,x2,z2);
    line(id,x1,z1,x1,z2);line(id,x2,z1,x2,z2);
    if (doorX!==undefined) {
      const index=objects.findIndex(o=>o.catalogId===id&&o.x===doorX&&o.z===doorZ&&o.elevation===1);
      if(index>=0)objects.splice(index,1);
      add('open-doorway',doorX,doorZ);
    }
  };
  const doorway = (x: number, z: number): void => {
    for(let i=objects.length-1;i>=0;i--){
      const block = objects[i];
      if(block && block.x===x && block.z===z && block.elevation===1 &&
        ['wood-wall','stone-wall','cave-wall','castle-wall'].includes(block.catalogId)) objects.splice(i,1);
    }
    add('open-doorway',x,z);
  };
  if (templateId === 'inn') {
    floor('wood-block',-9,-8,9,9);
    walls('wood-wall',-9,-8,9,9,0,9);
    line('wood-wall',-9,-1,9,-1); doorway(0,-1);
    line('wood-wall',-2,-8,-2,-2); doorway(-2,-5);
    line('wood-wall',4,-8,4,-2); doorway(4,-5);
    for (const [x,z] of [[-6,4],[0,4],[6,4]]) {
      add('table',x,z); add('chair',x-1,z); add('chair',x+1,z);
    }
    line('table',-7,0,-3,0); add('barrel',-8,-6);add('barrel',-7,-6);
    add('chest',0,-7);add('bed',6,-6);add('bed',8,-6);add('bed',-5,-6);
    add('fireplace',8,-1);add('stairs',-7,-2);
  } else if (templateId === 'castle') {
    floor('cobblestone',-11,-10,11,10);walls('castle-wall',-11,-10,11,10,0,10);
    walls('stone-wall',-7,-7,7,-2,0,-2);add('stairs',-5,-3);
    for (const [x,z] of [[-10,-9],[10,-9],[-10,9],[10,9]])add('pillar',x,z);
    add('chest',3,-5);add('table',0,-5);
  } else if (templateId === 'dungeon') {
    floor('dungeon-tile',-10,-10,10,9);walls('stone-wall',-10,-10,10,9,0,9);
    line('stone-wall',-3,-10,-3,5);line('stone-wall',4,-10,4,5);
    line('stone-wall',-10,2,10,2);
    for (const [x,z] of [[-3,-4],[4,-4],[-3,2],[4,2]]) doorway(x,z);
    add('trapdoor',-7,-5);add('chest',7,-7);add('stairs',0,8);add('pillar',-7,5);
  } else if (templateId === 'forest') {
    floor('grass',-11,-10,11,10);
    for (const [x,z] of [[-10,-8],[-7,-7],[9,-7],[10,4],[-9,6],[-7,9],[6,8],[9,9]]) add('tree',x,z);
    line('dirt',0,-10,0,10,0);add('campfire',2,-1);add('tent',4,2);add('tent',-3,3);add('wagon',-5,-5);
    state.partyStart={x:0,z:9,elevation:1};
  } else if(templateId==='harbor') {
    floor('water',-11,-10,11,10);
    floor('dock',-11,-9,-5,9);floor('ship-deck',3,-6,9,-2);
    line('dock',-5,-4,3,-4,0);floor('wood-block',-11,-10,-5,-3);
    walls('wood-wall',-10,-9,-6,-5,-8,-5);add('barrel',-9,-3);add('crate',-8,-3);
    add('boat',6,-4);state.partyStart={x:-7,z:7,elevation:1};
  } else if(templateId==='cave') {
    floor('dirt',-10,-9,10,9);walls('cave-wall',-10,-9,10,9,0,9);
    line('cave-wall',-4,-9,-4,0);line('cave-wall',3,0,3,9);
    doorway(-4,-3);doorway(3,5);add('chest',8,-7);
    add('rock',-7,1);add('rock',6,2);add('campfire',-1,-5);
  } else if(templateId==='temple') {
    floor('stone-block',-10,-9,10,9);walls('stone-wall',-10,-9,10,9,0,9);
    line('stone-wall',-10,-2,10,-2);doorway(0,-2);
    for (const x of [-7,-3,3,7]) for(const z of [-6,3])add('pillar',x,z);
    add('table',0,-7);add('chest',-7,-7);
  } else {
    floor('grass',-10,-9,10,9);line('stone-wall',-9,-8,9,-8);
    line('stone-wall',-9,-8,-9,7);line('stone-wall',9,-8,9,7);
    line('stone-wall',-9,7,-2,7);line('stone-wall',3,7,9,7);
    for(const [x,z] of [[-7,-6],[6,-6],[-7,5]])add('rock',x,z);
    add('crate',-3,1);add('barrel',-4,1);
  }
  return reconcilePartyOnMap({ ...state, objects, revision: 1 }, roster);
}
