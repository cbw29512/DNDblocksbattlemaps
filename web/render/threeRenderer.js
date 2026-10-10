import { creatureOccupiedCells } from '../domain/areaTargets.js?v=b5ed9895f361';
import { areaCells } from '../domain/areaTemplates.js?v=b5ed9895f361';
import { getCatalogItem } from '../domain/catalog.js?v=b5ed9895f361';
import { chooseRoomPlacement, previewRoomPlacement } from '../domain/roomPlacement.js?v=b5ed9895f361';
import { DEFAULT_BOARD_BOUNDS, boardDepth, boardWidth, isBoardCell } from '../domain/spatial.js?v=b5ed9895f361';
import { placementFromSurface } from '../domain/surfacePlacement.js?v=b5ed9895f361';
import { verticalFrame } from './verticalFrame.js?v=b5ed9895f361';
import { createPlacementPreview, disposePlacementPreview, hidePlacementPreview, showPlacementPreview } from './placementPreview.js?v=b5ed9895f361';
import { createRoomPlacementPreview, disposeRoomPlacementPreview, hideRoomPlacementPreview, showRoomPlacementPreview } from './roomPlacementPreview.js?v=b5ed9895f361';
import { CAMERA_DISTANCE, MAX_CAMERA_DISTANCE, MIN_CAMERA_DISTANCE, meshFor, rotateCamera, zoomCamera } from './threeObjects.js?v=b5ed9895f361';
export async function createThreeRenderer(container, handlers) {
    const THREE = await import('three');
    const { OrbitControls } = await import('three/addons/controls/OrbitControls.js');
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x11120f);
    const camera = new THREE.PerspectiveCamera(44, 1, 0.1, 400);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.replaceChildren(renderer.domElement);
    const hoverLabel = document.createElement('div');
    hoverLabel.setAttribute('role', 'tooltip');
    hoverLabel.hidden = true;
    Object.assign(hoverLabel.style, {
        position: 'fixed', zIndex: '10000', pointerEvents: 'none',
        padding: '5px 9px', borderRadius: '6px', background: '#171a1e',
        color: '#fff', border: '1px solid #d7b56d', font: '600 13px system-ui',
        boxShadow: '0 3px 12px #0008', maxWidth: '240px'
    });
    document.body.append(hoverLabel);
    function updateHoverLabel(event) {
        if (event.pointerType === 'touch') {
            hoverLabel.hidden = true;
            return;
        }
        if (!inspectMode) { hoverLabel.hidden = true; return; }
        setPointer(event);
        // Ignore underlying blocks when the pointer is over the placement ghost.
        if (preview?.visible && raycaster.intersectObject(preview.children[2], true).length) {
            hoverLabel.hidden = true;
            return;
        }
        const hit = raycaster.intersectObjects(objectGroup.children, true)
            .find((result) => result.object.userData.objectId);
        const object = currentObjects.find(item => item.id === hit?.object.userData.objectId);
        if (!object) {
            hoverLabel.hidden = true;
            return;
        }
        const item = getCatalogItem(object.catalogId);
        if (!inspectMode && (item.category === 'Characters' || item.category === 'Monsters')) {
            hoverLabel.hidden = true;
            return;
        }
        hoverLabel.textContent = /mimic/i.test(item.name) ? 'Old Chest' : /secret/i.test(item.name) ? 'Stone Wall' : item.name;
        hoverLabel.style.left = Math.min(event.clientX + 14, window.innerWidth - 250) + 'px';
        hoverLabel.style.top = Math.min(event.clientY + 16, window.innerHeight - 38) + 'px';
        hoverLabel.hidden = false;
    }
    renderer.domElement.addEventListener('pointerleave', () => { hoverLabel.hidden = true; });
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.minPolarAngle = Math.PI / 3;
    controls.maxPolarAngle = Math.PI / 3;
    controls.minDistance = MIN_CAMERA_DISTANCE;
    controls.maxDistance = MAX_CAMERA_DISTANCE;
    controls.mouseButtons.LEFT = null;
    controls.mouseButtons.MIDDLE = THREE.MOUSE.PAN;
    controls.mouseButtons.RIGHT = THREE.MOUSE.ROTATE;
    // Non-shadow-casting block lights: nearest sources win, with a strict GPU budget.
    const lightSpecs = {
        torch: [0xffa345, 1.6, 5], lantern: [0xffce74, 1.25, 4],
        campfire: [0xffa247, 8, 9], brazier: [0xff8c3c, 2.0, 6],
        fireplace: [0xff8738, 1.8, 6], forge: [0xff5a29, 2.0, 6],
        lava: [0xff5824, 1.25, 4]
    };
    const MAX_BLOCK_LIGHTS = 12;
    const blockLights = [];
    // A soft additive ground pool makes fire visible even on brightly lit maps.
    // Point lights still illuminate nearby cube faces; the pool does not alter cube geometry.
    const glowCanvas = document.createElement('canvas');
    glowCanvas.width = glowCanvas.height = 128;
    const glowContext = glowCanvas.getContext('2d');
    if (glowContext) {
        const gradient = glowContext.createRadialGradient(64, 64, 5, 64, 64, 64);
        gradient.addColorStop(0, 'rgba(255,177,70,.62)');
        gradient.addColorStop(.35, 'rgba(255,123,28,.31)');
        gradient.addColorStop(1, 'rgba(255,105,10,0)');
        glowContext.fillStyle = gradient;
        glowContext.fillRect(0, 0, 128, 128);
    }
    const glowTexture = new THREE.CanvasTexture(glowCanvas);
    const glowGroup = new THREE.Group();
    scene.add(glowGroup);
    const lightGroup = new THREE.Group();
    scene.add(lightGroup);
    function updateBlockLights(objects) {
        glowGroup.traverse((node) => { if (node.isMesh) {
            node.geometry.dispose();
            node.material.dispose();
        } });
        glowGroup.clear();
        lightGroup.clear();
        blockLights.length = 0;
        const sources = objects.filter(o => lightSpecs[o.catalogId]);
        sources.sort((a, b) => {
            const da = (a.x - camera.position.x) ** 2 + (a.z - camera.position.z) ** 2;
            const db = (b.x - camera.position.x) ** 2 + (b.z - camera.position.z) ** 2;
            return da - db || a.id.localeCompare(b.id);
        });
        for (const o of sources.slice(0, MAX_BLOCK_LIGHTS)) {
            const spec = lightSpecs[o.catalogId];
            if (!spec)
                continue;
            const [color, intensity, distance] = spec;
            const light = new THREE.PointLight(color, intensity, distance, 2);
            light.position.set(o.x + .5, o.elevation + .8, o.z + .5);
            light.castShadow = false;
            lightGroup.add(light);
            blockLights.push(light);
            if (o.catalogId === 'campfire' && o.elevation === 0) {
                const pool = new THREE.Mesh(new THREE.PlaneGeometry(7, 7), new THREE.MeshBasicMaterial({
                    map: glowTexture, transparent: true, opacity: .72,
                    depthWrite: false, blending: THREE.AdditiveBlending,
                    polygonOffset: true, polygonOffsetFactor: -1
                }));
                pool.rotation.x = -Math.PI / 2;
                pool.position.set(o.x + .5, .023, o.z + .5);
                pool.raycast = () => { };
                glowGroup.add(pool);
            }
        }
    }
    const objectGroup = new THREE.Group();
    scene.add(objectGroup, new THREE.HemisphereLight(0xfff3d7, 0x26342f, 2.1));
    const sun = new THREE.DirectionalLight(0xfff1ce, 2.5);
    sun.position.set(8, 14, 7);
    sun.castShadow = true;
    scene.add(sun);
    const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x617c45, roughness: 0.92 });
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);
    const gridMaterial = new THREE.LineBasicMaterial({ color: 0x353a36, transparent: true, opacity: 0.92 });
    const grid = new THREE.LineSegments(new THREE.BufferGeometry(), gridMaterial);
    grid.position.y = 0.012;
    scene.add(grid);
    const placementPlane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, side: THREE.DoubleSide }));
    placementPlane.rotation.x = -Math.PI / 2;
    scene.add(placementPlane);
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let selected = null;
    let movingCreatureId = null;
    let creatureMoveMode = false;
    let inspectMode = false;
    let activeRoom = null;
    let elevation = 0;
    let preview = null;
    let roomPreview = null;
    let currentObjects = [];
    let currentBounds = { ...DEFAULT_BOARD_BOUNDS };
    let activeArea = null;
    let areaPlacement = null;
    let areaTargetIds = new Set();
    const targetGroup = new THREE.Group();
    scene.add(targetGroup);
    function rebuildTargetOutlines() {
        for (const child of [...targetGroup.children]) {
            targetGroup.remove(child);
            child.geometry.dispose();
            child.material.dispose();
        }
        // Confirmed cast outlines persist after the temporary AoE disappears.
        for (const o of currentObjects.filter(o => areaTargetIds.has(o.id))) {
            for (const cell of creatureOccupiedCells(o)) {
                const line = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(1.025, 1.025, 1.025)), new THREE.LineBasicMaterial({ color: 0xfff08d, depthTest: false, transparent: true, opacity: 1 }));
                line.position.set(cell.x + .5, cell.elevation + .5, cell.z + .5);
                line.raycast = () => { };
                targetGroup.add(line);
            }
        }
    }
    const areaGroup = new THREE.Group();
    scene.add(areaGroup);
    function rebuildAreaCubes() {
        for (const mesh of [...areaGroup.children]) {
            areaGroup.remove(mesh);
            mesh.geometry.dispose();
            mesh.material.dispose();
        }
        if (!activeArea || !areaPlacement)
            return;
        const n = Math.ceil(activeArea.sizeFeet / 5) + 1;
        const center = areaPlacement.center;
        const extent = activeArea.shape === 'line' ? Math.ceil(activeArea.sizeFeet / 5) + 1 : n;
        const bounds = { minX: Math.min(center.x, areaPlacement.origin.x) - extent, maxX: Math.max(center.x, areaPlacement.origin.x) + extent + 1, minZ: Math.min(center.z, areaPlacement.origin.z) - extent, maxZ: Math.max(center.z, areaPlacement.origin.z) + extent + 1, minElevation: Math.min(center.elevation, areaPlacement.origin.elevation) - extent, maxElevation: Math.max(center.elevation, areaPlacement.origin.elevation) + extent };
        const color = activeArea.visual === 'fire' ? 0xff391c : activeArea.visual === 'lightning' ? 0xf6f4e9 : 0x93979e;
        const cells = areaCells(activeArea, areaPlacement, bounds);
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: .5, depthWrite: false, side: THREE.DoubleSide });
        for (const cell of cells) {
            const cube = new THREE.Mesh(geometry, material);
            cube.position.set(cell.x + .5, cell.elevation + .5, cell.z + .5);
            cube.raycast = () => { };
            areaGroup.add(cube);
        }
        // Cubes form the recognizable voxel silhouette; no smooth sphere or cone mesh.
    }
    function boardCenter(bounds) {
        return {
            x: (bounds.minX + bounds.maxX) / 2,
            z: (bounds.minZ + bounds.maxZ) / 2
        };
    }
    function gridGeometry(bounds) {
        const vertices = [];
        for (let x = bounds.minX; x <= bounds.maxX; x += 1) {
            vertices.push(x, 0, bounds.minZ, x, 0, bounds.maxZ);
        }
        for (let z = bounds.minZ; z <= bounds.maxZ; z += 1) {
            vertices.push(bounds.minX, 0, z, bounds.maxX, 0, z);
        }
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        return geometry;
    }
    function updateBoardGeometry(bounds) {
        const width = boardWidth(bounds);
        const depth = boardDepth(bounds);
        const center = boardCenter(bounds);
        ground.geometry.dispose();
        ground.geometry = new THREE.PlaneGeometry(width, depth);
        ground.position.set(center.x, 0, center.z);
        grid.geometry.dispose();
        grid.geometry = gridGeometry(bounds);
        placementPlane.geometry.dispose();
        placementPlane.geometry = new THREE.PlaneGeometry(width, depth);
        placementPlane.position.set(center.x, elevation, center.z);
        currentBounds = { ...bounds };
        controls.maxDistance = Math.max(MAX_CAMERA_DISTANCE, Math.max(width, depth) * 2.2);
    }
    function frameBoard() {
        const center = boardCenter(currentBounds);
        const span = Math.max(boardWidth(currentBounds), boardDepth(currentBounds));
        const { targetY, highest } = verticalFrame(currentObjects, object => {
            const item = getCatalogItem(object.catalogId);
            return item.category === 'Monsters' ? (item.footprintCells ?? 1) : 1;
        });
        const distance = Math.max(CAMERA_DISTANCE, span * 1.15, highest * 3);
        const horizontal = Math.cos(Math.PI / 6) * distance;
        const vertical = Math.sin(Math.PI / 6) * distance;
        controls.target.set(center.x, targetY, center.z);
        camera.position.set(center.x + horizontal / Math.sqrt(2), vertical + targetY, center.z + horizontal / Math.sqrt(2));
        controls.update();
    }
    function setPointer(event) {
        const rect = renderer.domElement.getBoundingClientRect();
        pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.setFromCamera(pointer, camera);
    }
    function floorPosition(event) {
        // Intersect the camera ray with the desired elevation directly.
        // An invisible mesh is not needed for ordinary empty-grid clicks.
        setPointer(event);
        const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -elevation);
        const point = raycaster.ray.intersectPlane(plane, new THREE.Vector3());
        if (!point)
            return null;
        const x = Math.floor(point.x);
        const z = Math.floor(point.z);
        return isBoardCell(x, z, currentBounds) ? { x, z, elevation } : null;
    }
    function highestAt(x, z) {
        return currentObjects.reduce((highest, object) => object.x === x && object.z === z
            ? Math.max(highest, object.elevation)
            : highest, 0);
    }
    function blockPlacementFor(event) {
        // Airborne creatures use the explicitly selected altitude rather than a
        // ground block's side/top intersection, which can silently shift elevation.
        if (selected && elevation > 0 && ['Characters', 'Monsters'].includes(getCatalogItem(selected).category)) {
            return floorPosition(event);
        }
        setPointer(event);
        const hit = raycaster.intersectObjects(objectGroup.children, true).find((hit) => hit.object.userData.objectId);
        if (!hit?.face)
            return floorPosition(event);
        const data = hit.object.userData;
        const normal = hit.face.normal.clone().transformDirection(hit.object.matrixWorld);
        return placementFromSurface({ x: Number(data.gridX), z: Number(data.gridZ), elevation: Number(data.elevation) }, highestAt(Number(data.gridX), Number(data.gridZ)), { x: normal.x, y: normal.y, z: normal.z }, elevation);
    }
    function roomPlacementFor(event) {
        if (!activeRoom)
            return null;
        const corner = floorPosition(event);
        return corner
            ? chooseRoomPlacement(activeRoom, corner, currentObjects, currentBounds)
            : null;
    }
    function rebuildBlockPreview() {
        if (preview) {
            scene.remove(preview);
            disposePlacementPreview(preview);
        }
        preview = selected && !creatureMoveMode ? createPlacementPreview(THREE, selected) : null;
        if (preview)
            scene.add(preview);
    }
    function rebuildRoomPreview() {
        if (roomPreview) {
            scene.remove(roomPreview);
            disposeRoomPlacementPreview(roomPreview);
        }
        roomPreview = activeRoom ? createRoomPlacementPreview(THREE, activeRoom) : null;
        if (roomPreview)
            scene.add(roomPreview);
    }
    renderer.domElement.addEventListener('pointermove', (event) => {
        updateHoverLabel(event);
        if (inspectMode) return;
        if (inspectMode) return;
        if (activeArea) {
            const point = floorPosition(event);
            if (point)
                handlers.onAreaPoint(point, false);
            return;
        }
        if (activeRoom && roomPreview) {
            const corner = floorPosition(event);
            if (!corner) {
                hideRoomPlacementPreview(roomPreview);
                return;
            }
            const placement = chooseRoomPlacement(activeRoom, corner, currentObjects, currentBounds);
            showRoomPlacementPreview(roomPreview, placement ?? previewRoomPlacement(corner), Boolean(placement));
            return;
        }
        if (creatureMoveMode || !preview || !selected)
            return;
        const position = blockPlacementFor(event);
        position ? showPlacementPreview(preview, position) : hidePlacementPreview(preview);
    });
    let dragStart = null;
    let suppressClick = false;
    const objectAt = event => {
        setPointer(event);
        return raycaster.intersectObjects(objectGroup.children, true).find(h => h.object.userData.objectId)?.object.userData.objectId;
    };
    renderer.domElement.addEventListener('pointerdown', event => {
        if (inspectMode || event.button !== 0) return;
        const id = objectAt(event);
        if (!id) return;
        const object = currentObjects.find(o => o.id === id);
        if (!object || (creatureMoveMode && !['Characters','Monsters'].includes(getCatalogItem(object.catalogId).category))) return;
        dragStart = {id, x:event.clientX, y:event.clientY};
    });
    renderer.domElement.addEventListener('pointerup', event => {
        if (!dragStart) return;
        const start=dragStart; dragStart=null;
        if (inspectMode || Math.hypot(event.clientX-start.x,event.clientY-start.y)<8) return;
        suppressClick=true;
        const position=floorPosition(event);
        if (position) handlers.onDragMove(String(start.id),position);
    });
    renderer.domElement.addEventListener('pointercancel',()=>{dragStart=null;});
    let lastPointerWasTouch = false;
    renderer.domElement.addEventListener('pointerdown', (event) => { lastPointerWasTouch = event.pointerType === 'touch'; });
    renderer.domElement.addEventListener('click', (event) => {
        if (suppressClick) { suppressClick=false; return; }
                if (inspectMode) {
            setPointer(event);
            const hit = raycaster.intersectObjects(objectGroup.children, true).find((h) => h.object.userData.objectId);
            if (hit) handlers.onInspect(String(hit.object.userData.objectId));
            return;
        }
if (activeArea) {
            const point = floorPosition(event);
            if (point)
                handlers.onAreaPoint(point, true, lastPointerWasTouch || event.pointerType === 'touch');
            lastPointerWasTouch = false;
            return;
        }
        setPointer(event);
        const marked = raycaster.intersectObjects(objectGroup.children, true)
            .find((hit) => hit.object.userData.objectId)?.object?.userData?.objectId;
        if (marked && handlers.onMarkTarget(String(marked)))
            return;
        if (activeRoom) {
            const placement = roomPlacementFor(event);
            if (placement)
                handlers.onRoomPlacement(placement);
            else
                handlers.onStatus('That room would exceed the 100 × 100 map limit or the height cap.');
            return;
        }
        if (creatureMoveMode && !movingCreatureId) {
            setPointer(event);
            const candidate = raycaster.intersectObjects(objectGroup.children.filter((mesh) => currentObjects.some(o => o.id === mesh.userData.objectId && ['Characters', 'Monsters'].includes(getCatalogItem(o.catalogId).category))), true).find((hit) => hit.object.userData.objectId);
            const id = candidate?.object?.userData?.objectId;
            if (id)
                handlers.onPickCreature(String(id));
            else
                handlers.onStatus('Move Creatures: click a character or monster to pick it up.');
            return;
        }
        if (movingCreatureId) {
            const destination = floorPosition(event);
            if (destination)
                handlers.onMoveCreature(destination);
            else
                handlers.onStatus('Choose a square inside the map to move this creature.');
            return;
        }
        if (!selected)
            return;
        setPointer(event);
        const clicked = raycaster.intersectObjects(objectGroup.children, true).find((hit) => hit.object.userData.objectId)?.object?.userData?.objectId;
        if (clicked && currentObjects.some(o => o.id === clicked && ['Characters', 'Monsters'].includes(getCatalogItem(o.catalogId).category))) {
            handlers.onPickCreature(String(clicked));
            return;
        }
        if (!selected)
            return;
        const position = blockPlacementFor(event);
        if (position)
            handlers.onPlace(position);
        else
            handlers.onStatus('Could not place at that point. Use Reset Camera and click inside the grid.');
    });
    renderer.domElement.addEventListener('dragover', (event) => { event.preventDefault(); });
    renderer.domElement.addEventListener('drop', (event) => {
        event.preventDefault();
        setPointer(event);
        const hit = raycaster.intersectObjects(objectGroup.children, true).find((hit) => hit.object.userData.objectId);
        const id = hit?.object?.userData?.objectId;
        const payload = event.dataTransfer?.getData('text/plain');
        if (id && payload)
            handlers.onMarkDrop(String(id), payload);
        else
            handlers.onStatus('Drop a ring directly onto a character or monster cube.');
    });
    renderer.domElement.addEventListener('contextmenu', (event) => {
        event.preventDefault();
        if (inspectMode) return;
        setPointer(event);
        const hit = raycaster.intersectObjects(objectGroup.children, true).find((hit) => hit.object.userData.objectId);
        const id = hit?.object?.userData?.objectId;
        if (id) handlers.onObjectContext(String(id),event.clientX,event.clientY);
    });
    const resize = new ResizeObserver(() => {
        renderer.setSize(container.clientWidth, container.clientHeight, false);
        camera.aspect = container.clientWidth / Math.max(container.clientHeight, 1);
        camera.updateProjectionMatrix();
    });
    resize.observe(container);
    updateBoardGeometry(currentBounds);
    frameBoard();
    renderer.setAnimationLoop(() => {
        controls.update();
        renderer.render(scene, camera);
    });
    handlers.onStatus('Build toward an edge and the map grows automatically.');
    return {
        mode: 'three',
        setAreaTargets(ids) { areaTargetIds = new Set(ids); rebuildTargetOutlines(); },
        setAreaPreview(template, placement) { activeArea = template; areaPlacement = placement; rebuildAreaCubes(); rebuildTargetOutlines(); },
        setTheme(theme) {
            groundMaterial.color.setHex(theme.groundColor);
        },
        setSelectedCatalog(next) {
            selected = next;
            rebuildBlockPreview();
        },
        setRoomPlacement(next) {
            activeRoom = next;
            rebuildRoomPreview();
        },
        setMovingCreature(id) { movingCreatureId = id; },
        setCreatureMoveMode(enabled) { creatureMoveMode = enabled; rebuildBlockPreview(); },
        setInspectMode(enabled) { inspectMode = enabled; hoverLabel.hidden = true; if (preview) preview.visible = false; },
        setElevation(next) {
            elevation = next;
            const center = boardCenter(currentBounds);
            placementPlane.position.set(center.x, elevation, center.z);
        },
        render(state) {
            const changed = state.bounds.minX !== currentBounds.minX ||
                state.bounds.maxX !== currentBounds.maxX ||
                state.bounds.minZ !== currentBounds.minZ ||
                state.bounds.maxZ !== currentBounds.maxZ;
            if (changed)
                updateBoardGeometry(state.bounds);
            const previousHeight = verticalFrame(currentObjects, object => {
                const item = getCatalogItem(object.catalogId);
                return item.category === 'Monsters' ? (item.footprintCells ?? 1) : 1;
            }).highest;
            currentObjects = state.objects;
            const nextHeight = verticalFrame(currentObjects, object => {
                const item = getCatalogItem(object.catalogId);
                return item.category === 'Monsters' ? (item.footprintCells ?? 1) : 1;
            }).highest;
            if (nextHeight > previousHeight && nextHeight >= 4)
                frameBoard();
            updateBlockLights(state.objects);
            objectGroup.clear();
            state.objects.forEach((item) => objectGroup.add(meshFor(THREE, item)));
            rebuildTargetOutlines();
        },
        rotate(delta) {
            rotateCamera(THREE, camera, controls, delta);
        },
        zoom(multiplier) {
            zoomCamera(camera, controls, multiplier);
        },
        resetCamera() {
            frameBoard();
        },
        dispose() {
            hoverLabel.remove();
            resize.disconnect();
            lightGroup.clear();
            scene.remove(lightGroup);
            glowGroup.traverse((node) => { if (node.isMesh) {
                node.geometry.dispose();
                node.material.dispose();
            } });
            scene.remove(glowGroup);
            glowTexture.dispose();
            renderer.setAnimationLoop(null);
            for (const mesh of areaGroup.children) {
                mesh.geometry.dispose();
                mesh.material.dispose();
            }
            scene.remove(areaGroup);
            for (const child of targetGroup.children) {
                child.geometry.dispose();
                child.material.dispose();
            }
            scene.remove(targetGroup);
            ground.geometry.dispose();
            grid.geometry.dispose();
            gridMaterial.dispose();
            placementPlane.geometry.dispose();
            if (preview)
                disposePlacementPreview(preview);
            if (roomPreview)
                disposeRoomPlacementPreview(roomPreview);
            renderer.dispose();
            container.replaceChildren();
        }
    };
}
