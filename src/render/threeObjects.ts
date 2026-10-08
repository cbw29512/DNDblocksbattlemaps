import { getCatalogItem } from '../domain/catalog.js';
import type { CatalogId, PaletteItem, WorldObject } from '../domain/types.js';
import { resolveBrowserAssetUrl } from '../browserAssetUrl.js';

export const CAMERA_DISTANCE = 19;
export const MIN_CAMERA_DISTANCE = 5;
export const MAX_CAMERA_DISTANCE = 46;

// One shared face material per catalog ID; all copies update after a valid image loads.
const faceMaterials = new Map<string, any>();

function materialFor(THREE: any, item: PaletteItem): any {
  const cached = faceMaterials.get(item.id);
  if (cached) return cached;

  // Never assign an unloaded texture: that can render black on some GPUs.
  const face = new THREE.MeshBasicMaterial({
    color: item.color,
    transparent: false
  });
  const material = [face, face, face, face, face, face];
  faceMaterials.set(item.id, material);
  if (!item.art) return material;

  try {
    const url = resolveBrowserAssetUrl(item.art.src);
    // SVG data URLs work in <img>, but direct WebGL upload can produce black faces.
    // Rasterize into a concrete, sized canvas before sending pixels to the GPU.
    const source = new Image();
    source.crossOrigin = 'anonymous';
    source.onload = () => {
      try {
        if (!source.naturalWidth || !source.naturalHeight) throw new Error('Image has no dimensions');
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const context = canvas.getContext('2d');
        if (!context) throw new Error('Canvas 2D context unavailable');
        context.fillStyle = '#' + item.color.toString(16).padStart(6, '0');
        context.fillRect(0, 0, 256, 256);
        context.drawImage(source, 0, 0, 256, 256);
        const texture = new THREE.CanvasTexture(canvas);
        texture.colorSpace = THREE.SRGBColorSpace;
        face.map = texture;
        face.color.setHex(0xffffff);
        face.needsUpdate = true;
      } catch (error) {
        console.warn('[render] Face art rasterization failed; keeping cube color.', { id: item.id, error });
      }
    };
    source.onerror = (error: unknown) => console.warn('[render] Block art failed; keeping cube color.', { id: item.id, error });
    source.src = url;
  } catch (error) {
    console.warn('[render] Could not load block face art; keeping cube color.', { id: item.id, error });
  }
  return material;
}

export function geometryFor(THREE: any, _catalogId: CatalogId): any {
  return new THREE.BoxGeometry(1, 1, 1);
}

export function meshFor(THREE: any, object: WorldObject): any {
  const item = getCatalogItem(object.catalogId);
  const mesh = new THREE.Mesh(geometryFor(THREE, object.catalogId), materialFor(THREE, item));
  mesh.position.set(object.x + 0.5, object.elevation + 0.5, object.z + 0.5);
  mesh.castShadow = true;
  mesh.receiveShadow = false;
  mesh.userData.objectId = object.id;
  mesh.userData.gridX = object.x;
  mesh.userData.gridZ = object.z;
  mesh.userData.elevation = object.elevation;
  return mesh;
}

export function setDefaultCamera(camera: any, controls: any): void {
  const horizontal = Math.cos(Math.PI / 6) * CAMERA_DISTANCE;
  camera.position.set(horizontal / Math.sqrt(2), CAMERA_DISTANCE / 2, horizontal / Math.sqrt(2));
  controls.target.set(0, 0, 0);
  controls.update();
}

export function rotateCamera(THREE: any, camera: any, controls: any, delta: number): void {
  const offset = camera.position.clone().sub(controls.target);
  offset.applyAxisAngle(new THREE.Vector3(0, 1, 0), delta);
  camera.position.copy(controls.target).add(offset);
  controls.update();
}

export function zoomCamera(camera: any, controls: any, multiplier: number): void {
  const offset = camera.position.clone().sub(controls.target).multiplyScalar(multiplier);
  const maxDistance = Number.isFinite(controls.maxDistance)
    ? controls.maxDistance
    : MAX_CAMERA_DISTANCE;
  if (offset.length() >= MIN_CAMERA_DISTANCE && offset.length() <= maxDistance) {
    camera.position.copy(controls.target).add(offset);
  }
  controls.update();
}
