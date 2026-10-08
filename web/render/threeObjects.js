import { getCatalogItem } from '../domain/catalog.js?v=094a169f6732';
import { resolveBrowserAssetUrl } from '../browserAssetUrl.js?v=094a169f6732';
export const CAMERA_DISTANCE = 19;
export const MIN_CAMERA_DISTANCE = 5;
export const MAX_CAMERA_DISTANCE = 46;
const textureCache = new Map();
function textureFor(THREE, src) {
    const resolved = resolveBrowserAssetUrl(src);
    const cached = textureCache.get(resolved);
    if (cached)
        return cached;
    const texture = new THREE.TextureLoader().load(resolved, undefined, undefined, (error) => console.warn('[render] Catalog face art failed to load.', { resolved, error }));
    texture.colorSpace = THREE.SRGBColorSpace;
    textureCache.set(resolved, texture);
    return texture;
}
function materialFor(THREE, item) {
    if (!item.art) {
        return new THREE.MeshStandardMaterial({ color: item.color, roughness: 0.76 });
    }
    const face = new THREE.MeshStandardMaterial({
        // Always draw a solid color if face art is unavailable.
        color: item.color,
        map: textureFor(THREE, item.art.src),
        transparent: false,
        alphaTest: 0,
        roughness: 0.82
    });
    // Every side of a DND Block represents the same object identity.
    // Use the same face art on all six cube faces so orbiting never hides what the block is.
    return [face, face, face, face, face, face];
}
export function geometryFor(THREE, _catalogId) {
    return new THREE.BoxGeometry(1, 1, 1);
}
export function meshFor(THREE, object) {
    const item = getCatalogItem(object.catalogId);
    const mesh = new THREE.Mesh(geometryFor(THREE, object.catalogId), materialFor(THREE, item));
    mesh.position.set(object.x + 0.5, object.elevation + 0.5, object.z + 0.5);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.userData.objectId = object.id;
    mesh.userData.gridX = object.x;
    mesh.userData.gridZ = object.z;
    mesh.userData.elevation = object.elevation;
    return mesh;
}
export function setDefaultCamera(camera, controls) {
    const horizontal = Math.cos(Math.PI / 6) * CAMERA_DISTANCE;
    camera.position.set(horizontal / Math.sqrt(2), CAMERA_DISTANCE / 2, horizontal / Math.sqrt(2));
    controls.target.set(0, 0, 0);
    controls.update();
}
export function rotateCamera(THREE, camera, controls, delta) {
    const offset = camera.position.clone().sub(controls.target);
    offset.applyAxisAngle(new THREE.Vector3(0, 1, 0), delta);
    camera.position.copy(controls.target).add(offset);
    controls.update();
}
export function zoomCamera(camera, controls, multiplier) {
    const offset = camera.position.clone().sub(controls.target).multiplyScalar(multiplier);
    const maxDistance = Number.isFinite(controls.maxDistance)
        ? controls.maxDistance
        : MAX_CAMERA_DISTANCE;
    if (offset.length() >= MIN_CAMERA_DISTANCE && offset.length() <= maxDistance) {
        camera.position.copy(controls.target).add(offset);
    }
    controls.update();
}
