import { CONDITIONS } from '../domain/creatureMarks.js?v=00134766f884';
import { getCatalogItem } from '../domain/catalog.js?v=00134766f884';
import { resolveBrowserAssetUrl } from '../browserAssetUrl.js?v=00134766f884';
export const CAMERA_DISTANCE = 19;
export const MIN_CAMERA_DISTANCE = 5;
export const MAX_CAMERA_DISTANCE = 46;
// One shared face material per catalog ID; all copies update after a valid image loads.
const faceMaterials = new Map();
function materialFor(THREE, item) {
    const cached = faceMaterials.get(item.id);
    if (cached)
        return cached;
    // Never assign an unloaded texture: that can render black on some GPUs.
    const face = new THREE.MeshBasicMaterial({
        color: item.color,
        transparent: false
    });
    const material = [face, face, face, face, face, face];
    faceMaterials.set(item.id, material);
    if (!item.art)
        return material;
    try {
        const url = resolveBrowserAssetUrl(item.art.src);
        // SVG data URLs work in <img>, but direct WebGL upload can produce black faces.
        // Rasterize into a concrete, sized canvas before sending pixels to the GPU.
        const source = new Image();
        source.crossOrigin = 'anonymous';
        source.onload = () => {
            try {
                if (!source.naturalWidth || !source.naturalHeight)
                    throw new Error('Image has no dimensions');
                const canvas = document.createElement('canvas');
                canvas.width = 256;
                canvas.height = 256;
                const context = canvas.getContext('2d');
                if (!context)
                    throw new Error('Canvas 2D context unavailable');
                context.fillStyle = '#' + item.color.toString(16).padStart(6, '0');
                context.fillRect(0, 0, 256, 256);
                context.drawImage(source, 0, 0, 256, 256);
                const texture = new THREE.CanvasTexture(canvas);
                texture.colorSpace = THREE.SRGBColorSpace;
                face.map = texture;
                face.color.setHex(0xffffff);
                face.needsUpdate = true;
            }
            catch (error) {
                console.warn('[render] Face art rasterization failed; keeping cube color.', { id: item.id, error });
            }
        };
        source.onerror = (error) => console.warn('[render] Block art failed; keeping cube color.', { id: item.id, error });
        source.src = url;
    }
    catch (error) {
        console.warn('[render] Could not load block face art; keeping cube color.', { id: item.id, error });
    }
    return material;
}
export function geometryFor(THREE, _catalogId) {
    return new THREE.BoxGeometry(1, 1, 1);
}

const PLAYER_RING_COLORS = new Set([0x2688dc, 0x31b86b, 0xe0be3d, 0xa369d7, 0xf18b35, 0xf4f4f4]);
function creatureLabel(THREE, name) {
    const canvas = document.createElement('canvas');
    canvas.width = 384;
    canvas.height = 96;
    const ctx = canvas.getContext('2d');
    if (!ctx)
        return null;
    ctx.fillStyle = 'rgba(15,18,20,0.86)';
    ctx.fillRect(3, 8, 378, 78);
    ctx.strokeStyle = '#eee6d0';
    ctx.lineWidth = 3;
    ctx.strokeRect(3, 8, 378, 78);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 38px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const label = name.length > 19 ? name.slice(0, 18) + '…' : name;
    ctx.fillText(label, 192, 48, 356);
    const map = new THREE.CanvasTexture(canvas);
    map.colorSpace = THREE.SRGBColorSpace;
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map, transparent: true, depthTest: false }));
    sprite.position.set(0, 1.01, 0);
    sprite.scale.set(1.7, 0.425, 1);
    sprite.renderOrder = 20;
    return sprite;
}
function creatureRing(THREE, color) {
    const ring = new THREE.Mesh(new THREE.RingGeometry(0.42, 0.52, 48), new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide, depthWrite: false }));
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = -0.492;
    ring.renderOrder = 5;
    return ring;
}

export function meshFor(THREE, object) {
    const item = getCatalogItem(object.catalogId);
    const mesh = new THREE.Mesh(geometryFor(THREE, object.catalogId), materialFor(THREE, item));
    mesh.position.set(object.x + 0.5, object.elevation + 0.5, object.z + 0.5);
    mesh.castShadow = true;
    mesh.receiveShadow = false;
    mesh.userData.objectId = object.id;
    mesh.userData.gridX = object.x;
    mesh.userData.gridZ = object.z;
    mesh.userData.elevation = object.elevation;
  if (item.category === 'Characters' || item.category === 'Monsters') {
    const label = creatureLabel(THREE, item.name);
    if (label) mesh.add(label);
    if (item.category === 'Monsters') mesh.add(creatureRing(THREE, 0xd83030));
    else if (object.ringColor !== undefined && PLAYER_RING_COLORS.has(object.ringColor))
      mesh.add(creatureRing(THREE, object.ringColor));
    const conditions = (object.conditions ?? []).filter(s => CONDITIONS.includes(s));
    if ((object.exhaustion ?? 0) > 0) conditions.push('Exhaustion');
    const palette = [0xe7b94a, 0x55cad1, 0xe37aa9, 0xa8d177];
    conditions.slice(0, 4).forEach((condition, i) => {
      const ring = creatureRing(THREE, palette[i]);
      ring.scale.setScalar(1.12 + 0.17 * i);
      ring.position.y = -0.48 + 0.005 * i;
      mesh.add(ring);
    });
    if (conditions.length) {
      const statusName = conditions.map(s => s === 'Exhaustion' ? 'Exhaustion ' + object.exhaustion : s).join(' • ');
      const statusLabel = creatureLabel(THREE, statusName);
      if (statusLabel) {
        statusLabel.position.y = 1.48;
        statusLabel.scale.set(1.9, 0.42, 1);
        mesh.add(statusLabel);
      }
    }
  }
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
