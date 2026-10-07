import { PALETTE } from '../domain/catalog.js';
import { geometryFor } from './threeObjects.js';
export function createPlacementPreview(THREE, catalogId) {
    const item = PALETTE[catalogId];
    const group = new THREE.Group();
    const geometry = geometryFor(THREE, catalogId);
    const ghost = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({
        color: item.color, transparent: true, opacity: 0.70, depthWrite: false
    }));
    ghost.position.y = item.height / 2;
    const outline = new THREE.LineSegments(new THREE.EdgesGeometry(geometry), new THREE.LineBasicMaterial({ color: 0xffefb8, transparent: true, opacity: 1 }));
    outline.position.y = item.height / 2;
    outline.renderOrder = 8;
    const width = Math.max(item.width, 0.78);
    const depth = Math.max(item.depth, 0.78);
    const landing = new THREE.Mesh(new THREE.PlaneGeometry(width, depth), new THREE.MeshBasicMaterial({
        color: 0xffcf57, transparent: true, opacity: 0.38,
        depthWrite: false, side: THREE.DoubleSide
    }));
    landing.rotation.x = -Math.PI / 2;
    landing.position.y = 0.012;
    landing.renderOrder = 6;
    const shadow = new THREE.Mesh(new THREE.PlaneGeometry(width * 0.82, depth * 0.82), new THREE.MeshBasicMaterial({
        color: 0x000000, transparent: true, opacity: 0.82,
        depthWrite: false, side: THREE.DoubleSide
    }));
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = 0.020;
    shadow.renderOrder = 7;
    group.add(landing, shadow, ghost, outline);
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
