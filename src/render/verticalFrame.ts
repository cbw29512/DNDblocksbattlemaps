import type { WorldObject } from '../domain/types.js';
/** Camera framing height for elevated cube assemblies. All dimensions are 5-ft grid cells. */
export function verticalFrame(objects: readonly WorldObject[], footprintOf: (object: WorldObject) => number) {
  let highest = 0;
  for (const object of objects) {
    if (!Number.isFinite(object.elevation)) continue;
    const footprint = footprintOf(object);
    const height = Number.isFinite(footprint) ? Math.max(1, footprint) : 1;
    highest = Math.max(highest, object.elevation + height);
  }
  return {targetY:highest / 2, highest};
}
