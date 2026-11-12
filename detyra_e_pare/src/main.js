import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { buildRoom } from './room.js';
import { loadFurniture } from './furniture.js';
import './style.css';

const container = document.getElementById('scene');
const status = document.getElementById('status');
const scene = new THREE.Scene();
scene.background = new THREE.Color('#edeae3');
scene.fog = new THREE.Fog('#edeae3', 28, 70);

let renderer;
try {
  renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
} catch (error) {
  status.textContent = 'Shfletuesi nuk arriti të aktivizojë WebGL.';
  throw error;
}
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.shadowMap.autoUpdate = false;
renderer.shadowMap.needsUpdate = true;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.12;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.domElement.setAttribute('aria-label', 'Pamja 3D. Tërhiq për të rrotulluar dhe përdor rrotëzën për afrim.');
container.appendChild(renderer.domElement);

const pmrem = new THREE.PMREMGenerator(renderer);
const environment = new RoomEnvironment();
const environmentMap = pmrem.fromScene(environment, .04);
scene.environment = environmentMap.texture;
scene.environmentIntensity = .32;
environment.dispose();
pmrem.dispose();

const camera = new THREE.PerspectiveCamera(39, window.innerWidth / window.innerHeight, .1, 100);
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = .075;
controls.minDistance = 3;
controls.maxDistance = 42;
controls.maxPolarAngle = Math.PI / 2 - .045;
controls.minPolarAngle = .0001;
controls.minAzimuthAngle = -.38;
controls.maxAzimuthAngle = Math.PI / 2 + .38;
controls.enablePan = false;

buildRoom(scene);
let animationFrame = 0;

function fitCamera() {
  const target = new THREE.Vector3(0, .9, 0);
  const factor = Math.min(3.2, Math.max(1, 1.1 / camera.aspect));
  camera.position.set(7.3, 6.1, 8.2).sub(target).multiplyScalar(factor).add(target);
  controls.target.copy(target);
  controls.update();
}

// Render only when the view changes, including the final frames of orbit damping.
function requestRender() {
  if (!animationFrame && !document.hidden) animationFrame = requestAnimationFrame(render);
}
function render() {
  animationFrame = 0;
  controls.update();
  renderer.render(scene, camera);
}
controls.addEventListener('change', requestRender);
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  fitCamera();
  requestRender();
});
document.addEventListener('visibilitychange', () => { if (!document.hidden) requestRender(); });
renderer.domElement.addEventListener('webglcontextlost', event => {
  event.preventDefault();
  status.textContent = 'Lidhja me kartën grafike u ndërpre. Ringarko faqen.';
});

fitCamera();

try {
  await loadFurniture(scene, renderer);
  await renderer.compileAsync(scene, camera);
  renderer.shadowMap.needsUpdate = true;
  renderer.render(scene, camera);
  container.setAttribute('aria-busy', 'false');
  requestRender();
} catch (error) {
  console.error('Gabim gjatë ngarkimit të modeleve:', error);
  status.textContent = 'Ambienti nuk u ngarkua. Kontrollo skedarët e modeleve dhe ringarko faqen.';
}
