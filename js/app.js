import * as THREE from 'three';
import { GLTFLoader } from 'https://unpkg.com/three@0.152.2/examples/jsm/loaders/GLTFLoader.js';
import { Octree } from 'https://unpkg.com/three@0.152.2/examples/jsm/math/Octree.js';
import { Capsule } from 'https://unpkg.com/three@0.152.2/examples/jsm/math/Capsule.js';

import {
  scene, setScene, camera, setCamera, renderer, setRenderer, clock, setClock,
  playerCollider, playerVelocity, playerDirection, keyStates, animatedObjects
} from './modules/state.js';
import { initPhysicsSpheres, updateControls, updatePlayer, updateSpheres, throwBall } from './modules/physics.js';
import { updateRaycaster, triggerRaycastClick, checkHoverAutoClick, showHUDCard } from './modules/interactivity.js';
import { setupUIControls } from './modules/ui.js';
import { setupAudioAndVideo } from './modules/media.js';
import { buildGalleryWorld } from './modules/gallery.js';
import { buildARCardBooth, updateARCardAnimations } from './modules/booth1_ar.js';
import { buildSpaceBooth, updateSpaceAnimations } from './modules/booth2_space.js';
import { buildCyberpunkBooth, updateCyberpunkAnimations } from './modules/booth3_cyber.js';
import { updateCollectibles } from './modules/collectibles.js';

/* =========================================================================
   APPLICATION INITIALIZATION
   ========================================================================= */
function init() {
  setClock(new THREE.Clock());

  // 1. Scene Setup
  const newScene = new THREE.Scene();
  newScene.background = new THREE.Color(0x070913);
  newScene.fog = new THREE.FogExp2(0x070913, 0.012);
  setScene(newScene);

  // 2. Camera Setup
  const newCamera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 500);
  newCamera.rotation.order = 'YXZ';
  setCamera(newCamera);

  // 3. Renderer Setup
  const container = document.getElementById('canvas-container');
  container.innerHTML = '';
  const newRenderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
  newRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25));
  newRenderer.setSize(window.innerWidth, window.innerHeight);
  newRenderer.shadowMap.enabled = true;
  newRenderer.shadowMap.type = THREE.PCFShadowMap;
  newRenderer.toneMapping = THREE.ACESFilmicToneMapping;
  newRenderer.toneMappingExposure = 1.1;
  container.appendChild(newRenderer.domElement);
  setRenderer(newRenderer);

  // 4. Lighting System
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  const hemiLight = new THREE.HemisphereLight(0x4488ff, 0x111122, 0.8);
  hemiLight.position.set(0, 20, 0);
  scene.add(hemiLight);

  const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
  dirLight.position.set(-15, 25, 10);
  dirLight.castShadow = true;
  dirLight.shadow.bias = -0.0005;
  dirLight.shadow.normalBias = 0.02;
  dirLight.shadow.mapSize.width = 1024;
  dirLight.shadow.mapSize.height = 1024;
  dirLight.shadow.camera.near = 0.5;
  dirLight.shadow.camera.far = 100;
  dirLight.shadow.camera.left = -30;
  dirLight.shadow.camera.right = 30;
  dirLight.shadow.camera.top = 30;
  dirLight.shadow.camera.bottom = -30;
  scene.add(dirLight);

  // 5. Physics Collision & Player Setup
  camera.position.copy(playerCollider.end);

  // Create Thrown Spheres Pool
  initPhysicsSpheres();

  // 6. Build Exhibition Gallery World Architecture
  buildGalleryWorld();

  // 7. Populate Booth 1: AR Card
  buildARCardBooth();

  // 8. Populate Booth 2: Space Observatory
  buildSpaceBooth();

  // 9. Populate Booth 3: Cyberpunk VR
  buildCyberpunkBooth();

  // 10. Audio & Video Setup
  setupAudioAndVideo();

  // 11. Event Listeners
  setupEventListeners();

  // 12. UI Control Bindings
  setupUIControls();

  // Initial Welcome HUD Card
  showHUDCard(
    "LOBBY UTAMA",
    "Lobby Utama Gallery",
    "Ruang utama pameran metaverse Syafrizal Amri Fajar. Dilengkapi audio Interstellar, arena parkour, simulasi fisika, dan koleksi poin."
  );
}

/* =========================================================================
   EVENT LISTENERS & CONTROLS
   ========================================================================= */
function setupEventListeners() {
  document.addEventListener('keydown', (e) => keyStates[e.code] = true);
  document.addEventListener('keyup', (e) => keyStates[e.code] = false);

  const container = document.getElementById('canvas-container');
  if (container) {
    container.addEventListener('mousedown', () => {
      if (document.pointerLockElement !== document.body) {
        const p = document.body.requestPointerLock();
        if (p && p.catch) p.catch(() => {});
      }
      const audioElement = document.getElementById('music');
      if (audioElement && audioElement.paused) {
        audioElement.play().catch(() => { });
      }
    });
  }

  document.addEventListener('mouseup', () => {
    if (document.pointerLockElement === document.body) {
      const clickedObject = triggerRaycastClick();
      if (!clickedObject) {
        throwBall();
      }
    }
  });

  document.body.addEventListener('mousemove', (e) => {
    if (document.pointerLockElement === document.body) {
      camera.rotation.y -= e.movementX / 500;
      camera.rotation.x -= e.movementY / 500;
      camera.rotation.x = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, camera.rotation.x));
    }
  });

  window.addEventListener('resize', onWindowResize);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

/* =========================================================================
   ANIMATION LOOP (HIGH PERFORMANCE OPTIMIZED)
   ========================================================================= */
function animate() {
  const deltaTime = Math.min(0.05, clock.getDelta());
  const elapsedTime = clock.getElapsedTime();

  updateControls(deltaTime);
  updatePlayer(deltaTime);
  updateSpheres(deltaTime);

  // Ultra-Fast Direct Animated Objects Loop (No CPU scene tree traversal!)
  for (let i = 0, len = animatedObjects.length; i < len; i++) {
    const obj = animatedObjects[i];
    if (obj.userData && obj.userData.animate) {
      obj.userData.animate(elapsedTime);
    }
  }

  // 🚀 Distance-Based Booth Animation Throttling (Zero CPU waste for distant rooms!)
  const cx = camera.position.x;
  const cz = camera.position.z;

  // Bilik 1: AR Card Booth (around x = -25, z = 0)
  const distSqAR = (cx + 25) * (cx + 25) + cz * cz;
  if (distSqAR < 4900) { // Within 70m
    updateARCardAnimations(elapsedTime, deltaTime);
  }

  // Bilik 2: Space Observatory (around x = 0, z = -45)
  const distSqSpace = cx * cx + (cz + 45) * (cz + 45);
  if (distSqSpace < 10000) { // Within 100m
    updateSpaceAnimations(elapsedTime);
  }

  // Bilik 3: Cyberpunk VR Hub & Rooms 3A/3C
  const distSqCyber = (cx - 25) * (cx - 25) + cz * cz;
  if (distSqCyber < 10000 || cx > 40 || cz > 45) { // Active in Hub or sub-rooms 3A/3C
    updateCyberpunkAnimations(elapsedTime);
  }

  updateCollectibles(deltaTime);

  // Raycaster & Interactivity
  updateRaycaster();
  // Auto‑click after 5 s hover
  checkHoverAutoClick();

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

// Start Application
init();
animate();
