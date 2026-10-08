import { MAX_BASE_ELEVATION } from './spatial.js?v=e0b1f72628a1';
export function elevationAbove(objectElevation, explicitElevation) {
    const next = Math.max(explicitElevation, objectElevation + 1);
    return next <= MAX_BASE_ELEVATION ? next : null;
}
export function highestElevationAt(objects, x, z) {
    let highest = null;
    for (const object of objects) {
        if (object.x !== x || object.z !== z)
            continue;
        highest = highest === null ? object.elevation : Math.max(highest, object.elevation);
    }
    return highest;
}
export function stackElevationAt(objects, x, z, explicitElevation) {
    if (explicitElevation > MAX_BASE_ELEVATION)
        return null;
    const highest = highestElevationAt(objects, x, z);
    return highest === null ? explicitElevation : elevationAbove(highest, explicitElevation);
}
