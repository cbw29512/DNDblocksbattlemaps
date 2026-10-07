import { roomOuterSize, type NormalizedRoom, type RoomCorner } from '../domain/room.js';

interface PreviewMaterials {
  line: any;
  footprint: any;
  anchor: any;
}

export function createRoomPlacementPreview(THREE: any, room: NormalizedRoom): any {
  const outer = roomOuterSize(room);
  const group = new THREE.Group();

  const volumeGeometry = new THREE.BoxGeometry(
    outer.lengthCells,
    room.heightLevels,
    outer.widthCells
  );
  const line = new THREE.LineSegments(
    new THREE.EdgesGeometry(volumeGeometry),
    new THREE.LineBasicMaterial({ color: 0xffefb8, transparent: true, opacity: 0.95 })
  );
  line.position.set(outer.lengthCells / 2, room.heightLevels / 2, outer.widthCells / 2);

  const footprint = new THREE.Mesh(
    new THREE.PlaneGeometry(outer.lengthCells, outer.widthCells),
    new THREE.MeshBasicMaterial({
      color: 0xffcf57,
      transparent: true,
      opacity: 0.18,
      depthWrite: false,
      side: THREE.DoubleSide
    })
  );
  footprint.rotation.x = -Math.PI / 2;
  footprint.position.set(outer.lengthCells / 2, 0.018, outer.widthCells / 2);

  const anchor = new THREE.Mesh(
    new THREE.BoxGeometry(0.58, 0.10, 0.58),
    new THREE.MeshBasicMaterial({ color: 0xffdf72, transparent: true, opacity: 0.96 })
  );
  anchor.position.set(0.5, 0.055, 0.5);

  group.add(footprint, line, anchor);
  group.userData.previewMaterials = {
    line: line.material,
    footprint: footprint.material,
    anchor: anchor.material
  } satisfies PreviewMaterials;
  group.visible = false;
  return group;
}

export function showRoomPlacementPreview(
  preview: any,
  corner: RoomCorner,
  valid: boolean
): void {
  preview.position.set(corner.x, corner.elevation, corner.z);
  const materials = preview.userData.previewMaterials as PreviewMaterials;
  const color = valid ? 0xffcf57 : 0xe06455;
  materials.line.color.setHex(valid ? 0xffefb8 : 0xff8175);
  materials.footprint.color.setHex(color);
  materials.anchor.color.setHex(valid ? 0xffdf72 : 0xff6f61);
  materials.footprint.opacity = valid ? 0.18 : 0.28;
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
