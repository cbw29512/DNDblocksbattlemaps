import { roomOuterSize, type NormalizedRoom } from '../domain/room.js';
import type { RoomPlacement } from '../domain/roomPlacement.js';

interface PreviewParts {
  line: any;
  footprint: any;
  anchor: any;
  lengthCells: number;
  widthCells: number;
}

export function createRoomPlacementPreview(THREE: any, room: NormalizedRoom): any {
  const outer = roomOuterSize(room);
  const group = new THREE.Group();
  const volume = new THREE.BoxGeometry(outer.lengthCells, room.heightLevels, outer.widthCells);

  const line = new THREE.LineSegments(
    new THREE.EdgesGeometry(volume),
    new THREE.LineBasicMaterial({ color: 0xffefb8, transparent: true, opacity: 0.95 })
  );
  line.position.y = room.heightLevels / 2;

  const footprint = new THREE.Mesh(
    new THREE.PlaneGeometry(outer.lengthCells, outer.widthCells),
    new THREE.MeshBasicMaterial({
      color: 0xffcf57, transparent: true, opacity: 0.18,
      depthWrite: false, side: THREE.DoubleSide
    })
  );
  footprint.rotation.x = -Math.PI / 2;
  footprint.position.y = 0.018;

  const anchor = new THREE.Mesh(
    new THREE.BoxGeometry(0.64, 0.12, 0.64),
    new THREE.MeshBasicMaterial({ color: 0xffdf72, transparent: true, opacity: 0.98 })
  );
  anchor.position.set(0.5, 0.065, 0.5);

  group.add(footprint, line, anchor);
  group.userData.previewParts = {
    line, footprint, anchor,
    lengthCells: outer.lengthCells,
    widthCells: outer.widthCells
  } satisfies PreviewParts;
  group.visible = false;
  return group;
}

export function showRoomPlacementPreview(
  preview: any,
  placement: RoomPlacement,
  valid: boolean
): void {
  const parts = preview.userData.previewParts as PreviewParts;
  const { corner, orientation } = placement;
  const centerX = 0.5 + orientation.x * (parts.lengthCells - 1) / 2;
  const centerZ = 0.5 + orientation.z * (parts.widthCells - 1) / 2;

  preview.position.set(corner.x, corner.elevation, corner.z);
  parts.line.position.x = centerX;
  parts.line.position.z = centerZ;
  parts.footprint.position.x = centerX;
  parts.footprint.position.z = centerZ;

  parts.line.material.color.setHex(valid ? 0xffefb8 : 0xff8175);
  parts.footprint.material.color.setHex(valid ? 0xffcf57 : 0xe06455);
  parts.anchor.material.color.setHex(valid ? 0xffdf72 : 0xff6f61);
  parts.footprint.material.opacity = valid ? 0.18 : 0.28;
  preview.visible = true;
}

export function hideRoomPlacementPreview(preview: any): void {
  preview.visible = false;
}

export function disposeRoomPlacementPreview(preview: any): void {
  preview.traverse((child: any) => {
    child.geometry?.dispose?.();
    const materials = Array.isArray(child.material) ? child.material : [child.material];
    materials.filter(Boolean).forEach((material: any) => material.dispose?.());
  });
}
