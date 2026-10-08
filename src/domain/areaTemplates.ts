import { GRID_FEET } from './spatial.js';

export type AreaShape = 'sphere' | 'cone' | 'line' | 'cube' | 'cylinder';
export type EffectVisual = 'fire' | 'lightning' | 'cold' | 'acid' | 'poison' | 'necrotic' | 'radiant' | 'force' | 'psychic' | 'neutral';
export interface AreaPoint { x: number; z: number; elevation: number; }
export interface AreaTemplate {
  id: string;
  label: string;
  shape: AreaShape;
  sizeFeet: number;
  maxRangeFeet: number;
  visual: EffectVisual;
  /** Cube measures side length; sphere/cylinder measure radius; cone/line measure length. */
  widthFeet?: number;
  heightFeet?: number;
}
export interface AreaPlacement { origin: AreaPoint; center: AreaPoint; }
export const AREA_PRESETS: readonly AreaTemplate[] = [
  { id:'fireball', label:'Fireball', shape:'sphere', sizeFeet:20, maxRangeFeet:150, visual:'fire' },
  { id:'lightning-bolt', label:'Lightning Bolt', shape:'line', sizeFeet:100, widthFeet:5, maxRangeFeet:0, visual:'lightning' },
  { id:'burning-hands', label:'Burning Hands', shape:'cone', sizeFeet:15, maxRangeFeet:0, visual:'fire' },
  { id:'cone-of-cold', label:'Cone of Cold', shape:'cone', sizeFeet:60, maxRangeFeet:0, visual:'cold' },
  { id:'dragon-fire-cone', label:'Dragon Fire Breath (cone)', shape:'cone', sizeFeet:30, maxRangeFeet:0, visual:'fire' },
  { id:'dragon-fire-line', label:'Dragon Fire Breath (line)', shape:'line', sizeFeet:60, widthFeet:5, maxRangeFeet:0, visual:'fire' },
  { id:'cloudkill', label:'Cloudkill', shape:'sphere', sizeFeet:20, maxRangeFeet:120, visual:'poison' },
  { id:'darkness', label:'Darkness', shape:'sphere', sizeFeet:15, maxRangeFeet:60, visual:'neutral' }
];
const EPSILON = 0.000001;
export function feetBetween(a: AreaPoint,b: AreaPoint): number {
  return Math.hypot(a.x-b.x,a.z-b.z,a.elevation-b.elevation)*GRID_FEET;
}
/** Grid-center preview, not a complete RAW cover/partial-cell adjudicator. */
export function areaContainsPoint(t: AreaTemplate, p: AreaPlacement, point: AreaPoint): boolean {
  const cx=(point.x-p.center.x)*GRID_FEET, cz=(point.z-p.center.z)*GRID_FEET;
  const cy=(point.elevation-p.center.elevation)*GRID_FEET;
  if (t.shape==='sphere') {
    const sliceRadius=Math.sqrt(Math.max(0,t.sizeFeet*t.sizeFeet-cy*cy));
    return Math.abs(cy)<t.sizeFeet+EPSILON &&
      circularGridCellAffected(sliceRadius,p.center.x,p.center.z,point.x,point.z);
  }
  if (t.shape==='cylinder') return Math.hypot(cx,cz)<=t.sizeFeet+EPSILON &&
    cy>=-EPSILON && cy<=(t.heightFeet ?? 20)+EPSILON;
  if (t.shape==='cube') {
    const half=t.sizeFeet/2;
    return Math.max(Math.abs(cx),Math.abs(cz),Math.abs(cy))<=half+EPSILON;
  }
  const dx=(p.center.x-p.origin.x)*GRID_FEET, dz=(p.center.z-p.origin.z)*GRID_FEET;
  const dy=(p.center.elevation-p.origin.elevation)*GRID_FEET;
  const dirLength=Math.hypot(dx,dz,dy);
  if(dirLength<EPSILON) return false;
  const ox=(point.x-p.origin.x)*GRID_FEET, oz=(point.z-p.origin.z)*GRID_FEET;
  const oy=(point.elevation-p.origin.elevation)*GRID_FEET;
  const forward=(ox*dx+oz*dz+oy*dy)/dirLength;
  if(forward < -EPSILON || forward>t.sizeFeet+EPSILON)return false;
  const perpendicular=Math.sqrt(Math.max(0,ox*ox+oz*oz+oy*oy-forward*forward));
  return perpendicular <= (t.shape==='line'?(t.widthFeet??5)/2:forward/2)+EPSILON;
}
export function areaCells(t: AreaTemplate,p: AreaPlacement,limits:{minX:number;maxX:number;minZ:number;maxZ:number;minElevation:number;maxElevation:number}): AreaPoint[] {
  const cells:AreaPoint[]=[];
  for(let y=limits.minElevation;y<=limits.maxElevation;y++)
    for(let z=limits.minZ;z<limits.maxZ;z++)
      for(let x=limits.minX;x<limits.maxX;x++) {
        const cell={x,z,elevation:y};
        if(areaContainsPoint(t,p,cell))cells.push(cell);
      }
  return cells;
}
export function isInCastingRange(t:AreaTemplate,p:AreaPlacement):boolean {
  return t.maxRangeFeet===0 || feetBetween(p.origin,p.center)<=t.maxRangeFeet+EPSILON;
}

/**
 * Grid-template rule for a circular horizontal cross-section (2014/2024 DMG).
 * Uses the exact circle/square intersection geometry with Simpson integration;
 * the 5-foot cell is included when at least half its area lies inside the circle.
 * The center is a grid intersection. Vertical slices are NOT certified by this helper.
 */
export function circularSquareCoverage(radiusFeet: number, originX: number, originZ: number, cellX: number, cellZ: number): number {
  if (!Number.isFinite(radiusFeet) || radiusFeet <= 0) return 0;
  const r=radiusFeet/GRID_FEET;
  const step=1/128;
  let sum=0;
  for(let i=0;i<=128;i++){
    const x=cellX+i*step;
    const dx=x-originX;
    const extent=Math.sqrt(Math.max(0,r*r-dx*dx));
    const clipped=Math.abs(dx)>r ? 0 : Math.max(0,Math.min(cellZ+1,originZ+extent)-Math.max(cellZ,originZ-extent));
    sum+=(i===0||i===128?1:i%2===0?2:4)*clipped;
  }
  return Math.min(1,Math.max(0,sum*step/3));
}
export function circularGridCellAffected(radiusFeet: number, originX: number, originZ: number, cellX: number, cellZ: number): boolean {
  return circularSquareCoverage(radiusFeet,originX,originZ,cellX,cellZ)>=0.5-1e-9;
}
