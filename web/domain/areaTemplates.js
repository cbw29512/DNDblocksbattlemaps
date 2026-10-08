import { GRID_FEET } from './spatial.js';

/** Grid-center preview, not a complete RAW cover/partial-cell adjudicator. */
export function areaContainsPoint(t, p, point) {
  const cx=(point.x-p.center.x)*GRID_FEET, cz=(point.z-p.center.z)*GRID_FEET;
  const cy=(point.elevation-p.center.elevation)*GRID_FEET;
  const len=Math.hypot(cx,cz,cy);
  if (t.shape==='sphere') return len<=t.sizeFeet+EPSILON;
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
export function areaCells(t,p,limits)[] {
  const cells=[];
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
