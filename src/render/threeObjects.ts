import { PALETTE } from '../domain/catalog.js';
import type { CatalogId, WorldObject } from '../domain/types.js';

export const CAMERA_DISTANCE = 19;

export function geometryFor(THREE: any, catalogId: CatalogId): any {
  const item = PALETTE[catalogId];
  if (item.shape === 'creature') {
    return new THREE.CylinderGeometry(item.width / 2, item.width * 0.58, item.height, 8);
  }
  return new THREE.BoxGeometry(item.width, item.height, item.depth);
}

export function meshFor(THREE: any, object: WorldObject): any {
  const item = PALETTE[object.catalogId];
  const mesh = new THREE.Mesh(
    geometryFor(THREE, object.catalogId),
    new THREE.MeshStandardMaterial({ color: item.color, roughness: 0.72 })
  );
  mesh.position.set(object.x + 0.5, object.elevation + item.height / 2, object.z + 0.5);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  mesh.userData.objectId = object.id;
  return mesh;
}

export function setDefaultCamera(THREE: any, camera: any, controls: any): void {
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
  if (offset.length() >= 5 && offset.length() <= 34) {
    camera.position.copy(controls.target).add(offset);
  }
  controls.update();
}
