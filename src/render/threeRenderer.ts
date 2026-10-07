import { PALETTE } from '../domain/catalog.js';
import type { CatalogId, TerrainTheme } from '../domain/types.js';
import { geometryFor, meshFor, rotateCamera, setDefaultCamera, zoomCamera } from './threeObjects.js';
import type { BoardHandlers, BoardRenderer } from './types.js';

const GRID_SIZE = 20;

export async function createThreeRenderer(
  container: HTMLElement,
  handlers: BoardHandlers
): Promise<BoardRenderer> {
  const THREE: any = await import('three');
  const { OrbitControls }: any = await import('three/addons/controls/OrbitControls.js');
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x11120f);
  const camera = new THREE.PerspectiveCamera(44, 1, 0.1, 100);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  container.replaceChildren(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.minPolarAngle = Math.PI / 3;
  controls.maxPolarAngle = Math.PI / 3;
  controls.minDistance = 5;
  controls.maxDistance = 34;
  controls.mouseButtons.LEFT = null;
  controls.mouseButtons.MIDDLE = THREE.MOUSE.PAN;
  controls.mouseButtons.RIGHT = THREE.MOUSE.ROTATE;

  const objectGroup = new THREE.Group();
  scene.add(objectGroup);
  scene.add(new THREE.HemisphereLight(0xfff3d7, 0x26342f, 2.1));
  const sun = new THREE.DirectionalLight(0xfff1ce, 2.5);
  sun.position.set(8, 14, 7);
  sun.castShadow = true;
  scene.add(sun);

  const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x617c45, roughness: 0.92 });
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(GRID_SIZE, GRID_SIZE), groundMaterial);
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);
  const grid = new THREE.GridHelper(GRID_SIZE, GRID_SIZE, 0xe7dcc1, 0x353a36);
  grid.position.y = 0.012;
  scene.add(grid);

  const placementPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(GRID_SIZE, GRID_SIZE),
    new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, side: THREE.DoubleSide })
  );
  placementPlane.rotation.x = -Math.PI / 2;
  scene.add(placementPlane);

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  let selected: CatalogId | null = null;
  let elevation = 0;
  let ghost: any = null;

  function rebuildGhost(): void {
    if (ghost) scene.remove(ghost);
    ghost = null;
    if (!selected) return;
    const item = PALETTE[selected];
    ghost = new THREE.Mesh(
      geometryFor(THREE, selected),
      new THREE.MeshBasicMaterial({ color: item.color, transparent: true, opacity: 0.42, depthWrite: false })
    );
    ghost.visible = false;
    scene.add(ghost);
  }

  function setPointer(event: PointerEvent | MouseEvent): void {
    const rect = renderer.domElement.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
  }

  function snappedCell(event: PointerEvent | MouseEvent): { x: number; z: number } | null {
    setPointer(event);
    const hit = raycaster.intersectObject(placementPlane, false)[0];
    if (!hit) return null;
    const x = Math.floor(hit.point.x);
    const z = Math.floor(hit.point.z);
    return Math.abs(x) < GRID_SIZE / 2 && Math.abs(z) < GRID_SIZE / 2 ? { x, z } : null;
  }

  renderer.domElement.addEventListener('pointermove', (event: PointerEvent) => {
    if (!ghost || !selected) return;
    const cell = snappedCell(event);
    ghost.visible = Boolean(cell);
    if (!cell) return;
    const item = PALETTE[selected];
    ghost.position.set(cell.x + 0.5, elevation + item.height / 2, cell.z + 0.5);
  });
  renderer.domElement.addEventListener('click', (event: MouseEvent) => {
    if (!selected) return;
    const cell = snappedCell(event);
    if (cell) handlers.onPlace({ ...cell, elevation });
  });
  renderer.domElement.addEventListener('contextmenu', (event: MouseEvent) => {
    event.preventDefault();
    setPointer(event);
    const hit = raycaster.intersectObjects(objectGroup.children, false)[0];
    const id = hit?.object?.userData?.objectId;
    if (id) handlers.onRemove(String(id));
  });

  const resize = new ResizeObserver(() => {
    const { clientWidth, clientHeight } = container;
    renderer.setSize(clientWidth, clientHeight, false);
    camera.aspect = clientWidth / Math.max(clientHeight, 1);
    camera.updateProjectionMatrix();
  });
  resize.observe(container);
  setDefaultCamera(THREE, camera, controls);
  renderer.setAnimationLoop(() => { controls.update(); renderer.render(scene, camera); });
  handlers.onStatus('3D board ready — left click places, right drag orbits, wheel zooms.');

  return {
    mode: 'three',
    setTheme(theme: TerrainTheme) { groundMaterial.color.setHex(theme.groundColor); },
    setSelectedCatalog(next) { selected = next; rebuildGhost(); },
    setElevation(next) { elevation = next; placementPlane.position.y = next; },
    render(state) { objectGroup.clear(); state.objects.forEach((item) => objectGroup.add(meshFor(THREE, item))); },
    rotate(delta) { rotateCamera(THREE, camera, controls, delta); },
    zoom(multiplier) { zoomCamera(camera, controls, multiplier); },
    resetCamera() { setDefaultCamera(THREE, camera, controls); },
    dispose() { resize.disconnect(); renderer.setAnimationLoop(null); renderer.dispose(); container.replaceChildren(); }
  };
}
