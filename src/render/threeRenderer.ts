import { BOARD_CELLS } from '../domain/spatial.js';
import { placementFromSurface } from '../domain/surfacePlacement.js';
import type { CatalogId, GridPosition, TerrainTheme } from '../domain/types.js';
import {
  createPlacementPreview, disposePlacementPreview,
  hidePlacementPreview, showPlacementPreview
} from './placementPreview.js';
import {
  MAX_CAMERA_DISTANCE, MIN_CAMERA_DISTANCE,
  meshFor, rotateCamera, setDefaultCamera, zoomCamera
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
  const camera = new THREE.PerspectiveCamera(44, 1, 0.1, 120);
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
  sun.position.set(8, 14, 7); sun.castShadow = true; scene.add(sun);

  const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x617c45, roughness: 0.92 });
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(BOARD_CELLS, BOARD_CELLS), groundMaterial);
  ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; scene.add(ground);
  const grid = new THREE.GridHelper(BOARD_CELLS, BOARD_CELLS, 0xe7dcc1, 0x353a36);
  grid.position.y = 0.012; scene.add(grid);

  const placementPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(BOARD_CELLS, BOARD_CELLS),
    new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, side: THREE.DoubleSide })
  );
  placementPlane.rotation.x = -Math.PI / 2; scene.add(placementPlane);

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  let selected: CatalogId | null = null;
  let elevation = 0;
  let preview: any = null;

  function setPointer(event: PointerEvent | MouseEvent): void {
    const rect = renderer.domElement.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
  }

  function highestAt(x: number, z: number): number {
    let highest = 0;
    for (const mesh of objectGroup.children) {
      const data = mesh.userData;
      if (Number(data.gridX) === x && Number(data.gridZ) === z) {
        highest = Math.max(highest, Number(data.elevation));
      }
    }
    return highest;
  }

  function placementFor(event: PointerEvent | MouseEvent): GridPosition | null {
    setPointer(event);
    const hit = raycaster.intersectObjects(objectGroup.children, false)[0];
    if (hit?.face) {
      const data = hit.object.userData;
      const normal = hit.face.normal.clone().transformDirection(hit.object.matrixWorld);
      return placementFromSurface(
        { x: Number(data.gridX), z: Number(data.gridZ), elevation: Number(data.elevation) },
        highestAt(Number(data.gridX), Number(data.gridZ)),
        { x: normal.x, y: normal.y, z: normal.z },
        elevation
      );
    }

    const floorHit = raycaster.intersectObject(placementPlane, false)[0];
    if (!floorHit) return null;
    const x = Math.floor(floorHit.point.x);
    const z = Math.floor(floorHit.point.z);
    return Math.abs(x) < BOARD_CELLS / 2 && Math.abs(z) < BOARD_CELLS / 2
      ? { x, z, elevation } : null;
  }

  function rebuildPreview(): void {
    if (preview) { scene.remove(preview); disposePlacementPreview(preview); }
    preview = selected ? createPlacementPreview(THREE, selected) : null;
    if (preview) scene.add(preview);
  }

  renderer.domElement.addEventListener('pointermove', (event: PointerEvent) => {
    if (!preview || !selected) return;
    const position = placementFor(event);
    if (position) showPlacementPreview(preview, position);
    else hidePlacementPreview(preview);
  });
  renderer.domElement.addEventListener('click', (event: MouseEvent) => {
    if (!selected) return;
    const position = placementFor(event);
    if (position) handlers.onPlace(position);
  });
  renderer.domElement.addEventListener('contextmenu', (event: MouseEvent) => {
    event.preventDefault(); setPointer(event);
    const hit = raycaster.intersectObjects(objectGroup.children, false)[0];
    const id = hit?.object?.userData?.objectId;
    if (id) handlers.onRemove(String(id));
  });

  const resize = new ResizeObserver(() => {
    renderer.setSize(container.clientWidth, container.clientHeight, false);
    camera.aspect = container.clientWidth / Math.max(container.clientHeight, 1);
    camera.updateProjectionMatrix();
  });
  resize.observe(container); setDefaultCamera(camera, controls);
  renderer.setAnimationLoop(() => { controls.update(); renderer.render(scene, camera); });
  handlers.onStatus('Top face builds up · side face builds out · zoom out for tall structures.');

  return {
    mode: 'three',
    setTheme(theme: TerrainTheme) { groundMaterial.color.setHex(theme.groundColor); },
    setSelectedCatalog(next) { selected = next; rebuildPreview(); },
    setElevation(next) { elevation = next; placementPlane.position.y = next; },
    render(state) { objectGroup.clear(); state.objects.forEach((item) => objectGroup.add(meshFor(THREE, item))); },
    rotate(delta) { rotateCamera(THREE, camera, controls, delta); },
    zoom(multiplier) { zoomCamera(camera, controls, multiplier); },
    resetCamera() { setDefaultCamera(camera, controls); },
    dispose() {
      resize.disconnect(); renderer.setAnimationLoop(null);
      if (preview) disposePlacementPreview(preview);
      renderer.dispose(); container.replaceChildren();
    }
  };
}
