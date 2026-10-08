import { CONDITIONS, CONDITION_COLORS } from '../domain/creatureMarks.js?v=81e60cc34a5e';
import { getCatalogItem } from '../domain/catalog.js?v=81e60cc34a5e';
import { resolveBrowserAssetUrl } from '../browserAssetUrl.js?v=81e60cc34a5e';
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
const creatureLabelMaterials = new Map();
const creatureRingMaterials = new Map();
let creatureRingGeometry = null;
function configureLabel(sprite) {
    sprite.position.set(0, 1.01, 0);
    sprite.scale.set(1.7, 0.425, 1);
    sprite.renderOrder = 20;
    return sprite;
}
function creatureLabel(THREE, name) {
    const cached = creatureLabelMaterials.get(name);
    if (cached)
        return configureLabel(new THREE.Sprite(cached));
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
    const material = new THREE.SpriteMaterial({ map, transparent: true, depthTest: false });
    creatureLabelMaterials.set(name, material);
    const sprite = new THREE.Sprite(material);
    sprite.position.set(0, 1.01, 0);
    sprite.scale.set(1.7, 0.425, 1);
    sprite.renderOrder = 20;
    return sprite;
}
function creatureRing(THREE, color) {
    creatureRingGeometry ??= new THREE.RingGeometry(0.42, 0.52, 48);
    let material = creatureRingMaterials.get(color);
    if (!material) {
        material = new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide, depthWrite: false });
        creatureRingMaterials.set(color, material);
    }
    const ring = new THREE.Mesh(creatureRingGeometry, material);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = -0.492;
    ring.renderOrder = 5;
    return ring;
}
// Large creatures are solid n x n x n assemblies of 5-foot cubes.
// The portrait spans each exterior face, rather than repeating on every cell.
function monsterExterior(THREE, root, item, n) {
    if (!item.art)
        return;
    const source = new Image();
    source.crossOrigin = 'anonymous';
    source.onload = () => {
        if (!source.naturalWidth || !source.naturalHeight)
            return;
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');
        if (!ctx)
            return;
        ctx.fillStyle = '#' + item.color.toString(16).padStart(6, '0');
        ctx.fillRect(0, 0, 512, 512);
        const ratio = Math.min(512 / source.naturalWidth, 512 / source.naturalHeight);
        const w = source.naturalWidth * ratio, h = source.naturalHeight * ratio;
        ctx.drawImage(source, (512 - w) / 2, (512 - h) / 2, w, h);
        ctx.strokeStyle = 'rgba(0,0,0,0.5)';
        ctx.lineWidth = 3;
        for (let cell = 1; cell < n; cell++) {
            const pos = 512 * cell / n;
            ctx.beginPath();
            ctx.moveTo(pos, 0);
            ctx.lineTo(pos, 512);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(0, pos);
            ctx.lineTo(512, pos);
            ctx.stroke();
        }
        const texture = new THREE.CanvasTexture(canvas);
        texture.colorSpace = THREE.SRGBColorSpace;
        const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
        const center = (n - 1) / 2, far = n - 0.498, near = -0.502;
        const sides = [
            [center, center, far, 0, 0, 0],
            [center, center, near, 0, Math.PI, 0],
            [far, center, center, 0, Math.PI / 2, 0],
            [near, center, center, 0, -Math.PI / 2, 0],
            [center, far, center, -Math.PI / 2, 0, 0]
        ];
        for (const [x, y, z, rx, ry, rz] of sides) {
            const panel = new THREE.Mesh(new THREE.PlaneGeometry(n, n), material);
            panel.position.set(x, y, z);
            panel.rotation.set(rx, ry, rz);
            panel.userData.objectId = root.userData.objectId;
            panel.userData.gridX = root.userData.gridX;
            panel.userData.gridZ = root.userData.gridZ;
            panel.userData.elevation = root.userData.elevation;
            root.add(panel);
        }
    };
    source.onerror = () => { };
    source.src = resolveBrowserAssetUrl(item.art.src);
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
    const footprint = item.category === 'Monsters' ? (item.footprintCells ?? 1) : 1;
    if (footprint > 1) {
        monsterExterior(THREE, mesh, item, footprint);
        for (let dx = 0; dx < footprint; dx += 1) {
            for (let dz = 0; dz < footprint; dz += 1) {
                for (let dy = 0; dy < footprint; dy += 1) {
                    if (dx === 0 && dy === 0 && dz === 0)
                        continue;
                    const segment = new THREE.Mesh(geometryFor(THREE, object.catalogId), materialFor(THREE, item));
                    segment.position.set(dx, dy, dz);
                    segment.castShadow = true;
                    segment.receiveShadow = false;
                    segment.userData.objectId = object.id;
                    segment.userData.gridX = object.x + dx;
                    segment.userData.gridZ = object.z + dz;
                    segment.userData.elevation = object.elevation;
                    mesh.add(segment);
                }
            }
        }
    }
    if (item.category === 'Characters' || item.category === 'Monsters') {
        const label = creatureLabel(THREE, item.name);
        if (label) {
            label.position.x = (footprint - 1) / 2;
            label.position.z = (footprint - 1) / 2;
            label.position.y = footprint + 0.04;
            mesh.add(label);
        }
        if (item.category === 'Monsters') {
            const ring = creatureRing(THREE, 0xd83030);
            ring.position.x = (footprint - 1) / 2;
            ring.position.z = (footprint - 1) / 2;
            ring.scale.setScalar(footprint);
            mesh.add(ring);
        }
        else if (object.ringColor !== undefined && PLAYER_RING_COLORS.has(object.ringColor))
            mesh.add(creatureRing(THREE, object.ringColor));
        const conditions = (object.conditions ?? []).filter(s => CONDITIONS.some(condition => condition === s));
        if ((object.exhaustion ?? 0) > 0)
            conditions.push('Exhaustion');
        conditions.slice(0, 4).forEach((condition, i) => {
            const ring = creatureRing(THREE, CONDITION_COLORS[condition] ?? 0xe7b94a);
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
