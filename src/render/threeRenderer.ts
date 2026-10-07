import { type NormalizedRoom, type RoomCorner } from '../domain/room.js';
import {
  chooseRoomPlacement, previewRoomPlacement, type RoomPlacement
} from '../domain/roomPlacement.js';
import {
  DEFAULT_BOARD_BOUNDS, boardDepth, boardWidth, isBoardCell
} from '../domain/spatial.js';
import { placementFromSurface } from '../domain/surfacePlacement.js';
import type {
  BoardBounds, CatalogId, GridPosition, TerrainTheme, WorldObject
} from '../domain/types.js';
import {
  createPlacementPreview, disposePlacementPreview,
  hidePlacementPreview, showPlacementPreview
} from './placementPreview.js';
import {
  createRoomPlacementPreview, disposeRoomPlacementPreview,
  hideRoomPlacementPreview, showRoomPlacementPreview
} from './roomPlacementPreview.js';
import {
  CAMERA_DISTANCE, MAX_CAMERA_DISTANCE, MIN_CAMERA_DISTANCE,
  meshFor, rotateCamera, zoomCamera
} from './threeObjects.js';
import type { BoardHandlers, BoardRenderer } from './types.js';

export async function createThreeRenderer(
  container: HTMLElement,
  handlers: BoardHandlers
): Promise<BoardRenderer> {
  const THREE: any = await import('three');
  const { OrbitControls }: any = await import('three/addons/controls/OrbitControls.js');

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x11120f);

  const camera = new THREE.PerspectiveCamera(44, 1, 0.1, 400);
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  container.replaceChildren(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.minPolarAngle = Math.PI / 3;
  controls.maxPolarAngle = Math.PI / 3;
  controls.minDistance = MIN_CAMERA_DISTANCE;
  controls.maxDistance = MAX_CAMERA_DISTANCE;
  controls.mouseButtons.LEFT = null;
  controls.mouseButtons.MIDDLE = THREE.MOUSE.PAN;
  controls.mouseButtons.RIGHT = THREE.MOUSE.ROTATE;

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

  const placementPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1),
    new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, side: THREE.DoubleSide })
  );
  placementPlane.rotation.x = -Math.PI / 2;
  scene.add(placementPlane);

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();

  let selected: CatalogId | null = null;
  let activeRoom: NormalizedRoom | null = null;
  let elevation = 0;
  let preview: any = null;
  let roomPreview: any = null;
  let currentObjects: WorldObject[] = [];
  let currentBounds: BoardBounds = { ...DEFAULT_BOARD_BOUNDS };

  function boardCenter(bounds: BoardBounds): { x: number; z: number } {
    return {
      x: (bounds.minX + bounds.maxX) / 2,
      z: (bounds.minZ + bounds.maxZ) / 2
    };
  }

  function gridGeometry(bounds: BoardBounds): any {
    const vertices: number[] = [];

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

  function updateBoardGeometry(bounds: BoardBounds): void {
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

  function frameBoard(): void {
    const center = boardCenter(currentBounds);
    const span = Math.max(boardWidth(currentBounds), boardDepth(currentBounds));
    const distance = Math.max(CAMERA_DISTANCE, span * 1.15);
    const horizontal = Math.cos(Math.PI / 6) * distance;
    const vertical = Math.sin(Math.PI / 6) * distance;

    controls.target.set(center.x, 0, center.z);
    camera.position.set(
      center.x + horizontal / Math.sqrt(2),
      vertical,
      center.z + horizontal / Math.sqrt(2)
    );
    controls.update();
  }

  function setPointer(event: PointerEvent | MouseEvent): void {
    const rect = renderer.domElement.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
  }

  function floorPosition(event: PointerEvent | MouseEvent): GridPosition | null {
    setPointer(event);
    const hit = raycaster.intersectObject(placementPlane, false)[0];
    if (!hit) return null;

    const x = Math.floor(hit.point.x);
    const z = Math.floor(hit.point.z);
    return isBoardCell(x, z, currentBounds) ? { x, z, elevation } : null;
  }

  function highestAt(x: number, z: number): number {
    return currentObjects.reduce(
      (highest, object) => object.x === x && object.z === z
        ? Math.max(highest, object.elevation)
        : highest,
      0
    );
  }

  function blockPlacementFor(event: PointerEvent | MouseEvent): GridPosition | null {
    setPointer(event);
    const hit = raycaster.intersectObjects(objectGroup.children, false)[0];
    if (!hit?.face) return floorPosition(event);

    const data = hit.object.userData;
    const normal = hit.face.normal.clone().transformDirection(hit.object.matrixWorld);
    return placementFromSurface(
      { x: Number(data.gridX), z: Number(data.gridZ), elevation: Number(data.elevation) },
      highestAt(Number(data.gridX), Number(data.gridZ)),
      { x: normal.x, y: normal.y, z: normal.z },
      elevation
    );
  }

  function roomPlacementFor(event: PointerEvent | MouseEvent): RoomPlacement | null {
    if (!activeRoom) return null;
    const corner = floorPosition(event) as RoomCorner | null;
    return corner
      ? chooseRoomPlacement(activeRoom, corner, currentObjects, currentBounds)
      : null;
  }

  function rebuildBlockPreview(): void {
    if (preview) {
      scene.remove(preview);
      disposePlacementPreview(preview);
    }
    preview = selected ? createPlacementPreview(THREE, selected) : null;
    if (preview) scene.add(preview);
  }

  function rebuildRoomPreview(): void {
    if (roomPreview) {
      scene.remove(roomPreview);
      disposeRoomPlacementPreview(roomPreview);
    }
    roomPreview = activeRoom ? createRoomPlacementPreview(THREE, activeRoom) : null;
    if (roomPreview) scene.add(roomPreview);
  }

  renderer.domElement.addEventListener('pointermove', (event: PointerEvent) => {
    if (activeRoom && roomPreview) {
      const corner = floorPosition(event) as RoomCorner | null;
      if (!corner) {
        hideRoomPlacementPreview(roomPreview);
        return;
      }

      const placement = chooseRoomPlacement(activeRoom, corner, currentObjects, currentBounds);
      showRoomPlacementPreview(
        roomPreview,
        placement ?? previewRoomPlacement(corner),
        Boolean(placement)
      );
      return;
    }

    if (!preview || !selected) return;
    const position = blockPlacementFor(event);
    position ? showPlacementPreview(preview, position) : hidePlacementPreview(preview);
  });

  renderer.domElement.addEventListener('click', (event: MouseEvent) => {
    if (activeRoom) {
      const placement = roomPlacementFor(event);
      if (placement) handlers.onRoomPlacement(placement);
      else handlers.onStatus('That room would exceed the 100 × 100 map limit or the height cap.');
      return;
    }

    if (!selected) return;
    const position = blockPlacementFor(event);
    if (position) handlers.onPlace(position);
  });

  renderer.domElement.addEventListener('contextmenu', (event: MouseEvent) => {
    event.preventDefault();
    setPointer(event);
    const hit = raycaster.intersectObjects(objectGroup.children, false)[0];
    const id = hit?.object?.userData?.objectId;
    if (id) handlers.onRemove(String(id));
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
    setTheme(theme: TerrainTheme) {
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
    setElevation(next) {
      elevation = next;
      const center = boardCenter(currentBounds);
      placementPlane.position.set(center.x, elevation, center.z);
    },
    render(state) {
      const changed =
        state.bounds.minX !== currentBounds.minX ||
        state.bounds.maxX !== currentBounds.maxX ||
        state.bounds.minZ !== currentBounds.minZ ||
        state.bounds.maxZ !== currentBounds.maxZ;
      if (changed) updateBoardGeometry(state.bounds);

      currentObjects = state.objects;
      objectGroup.clear();
      state.objects.forEach((item) => objectGroup.add(meshFor(THREE, item)));
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
      resize.disconnect();
      renderer.setAnimationLoop(null);
      ground.geometry.dispose();
      grid.geometry.dispose();
      gridMaterial.dispose();
      placementPlane.geometry.dispose();
      if (preview) disposePlacementPreview(preview);
      if (roomPreview) disposeRoomPlacementPreview(roomPreview);
      renderer.dispose();
      container.replaceChildren();
    }
  };
}
