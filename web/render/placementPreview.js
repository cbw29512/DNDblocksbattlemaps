import { PALETTE } from '../domain/catalog.js';
import { geometryFor } from './threeObjects.js';
export function createPlacementPreview(THREE, catalogId) {
    const item = PALETTE[catalogId];
    const group = new THREE.Group();
    const geometry = geometryFor(THREE, catalogId);
    const ghost = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({
        color: item.color, transparent: true, opacity: 0.68, depthWrite: false
    }));
    ghost.position.y = item.height / 2;
    const outline = new THREE.LineSegments(new THREE.EdgesGeometry(geometry), new THREE.LineBasicMaterial({ color: 0xffe3a0, transparent: true, opacity: 1 }));
    outline.position.y = item.height / 2;
    outline.renderOrder = 6;
    const width = Math.max(item.width, 0.72);
    const depth = Math.max(item.depth, 0.72);
    const halo = new THREE.Mesh(new THREE.PlaneGeometry(width, depth), new THREE.MeshBasicMaterial({
        color: 0xffd36a, transparent: true, opacity: 0.30,
        depthWrite: false, side: THREE.DoubleSide
    }));
    halo.rotation.x = -Math.PI / 2;
    halo.position.y = 0.010;
    const shadow = new THREE.Mesh(new THREE.PlaneGeometry(width * 0.72, depth * 0.72), new THREE.MeshBasicMaterial({
        color: 0x000000, transparent: true, opacity: 0.72,
        depthWrite: false, side: THREE.DoubleSide
    }));
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = 0.018;
    group.add(halo, shadow, ghost, outline);
    group.visible = false;
    return group;
}
export function showPlacementPreview(preview, position) {
    preview.position.set(position.x + 0.5, position.elevation, position.z + 0.5);
    preview.visible = true;
}
export function hidePlacementPreview(preview) {
    preview.visible = false;
}
export function disposePlacementPreview(preview) {
    preview.traverse((child) => {
        child.geometry?.dispose?.();
        const materials = Array.isArray(child.material) ? child.material : [child.material];
        materials.filter(Boolean).forEach((material) => material.dispose?.());
    });
}
