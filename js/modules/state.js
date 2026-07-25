import * as THREE from 'three';
import { GLTFLoader } from '../jsm/loaders/GLTFLoader.js';
import { Octree } from '../jsm/math/Octree.js';
import { Capsule } from '../jsm/math/Capsule.js';
import Stats from '../jsm/libs/stats.module.js';

// Core Three.js Engine Variables
export let scene, camera, renderer, clock, stats;
export function setScene(val) { scene = val; }
export function setCamera(val) { camera = val; }
export function setRenderer(val) { renderer = val; }
export function setClock(val) { clock = val; }
export function setStats(val) { stats = val; }

// Player & Physics State
export let worldOctree = new Octree();
export let playerCollider = new Capsule(new THREE.Vector3(0, 0.35, 10), new THREE.Vector3(0, 1.65, 10), 0.35);
export let playerVelocity = new THREE.Vector3();
export let playerDirection = new THREE.Vector3();
export let playerOnFloor = false;
export function setPlayerOnFloor(val) { playerOnFloor = val; }
export let keyStates = {};
export const GRAVITY = 25;

// Raycaster & Interactivity State
export const raycaster = new THREE.Raycaster();
export const screenCenter = new THREE.Vector2(0, 0);
export const interactiveObjects = [];
export const animatedObjects = [];
export let hoveredObject = null;
export function setHoveredObject(val) { hoveredObject = val; }
export let currentTeleportTarget = null;
export function setCurrentTeleportTarget(val) { currentTeleportTarget = val; }

// Panorama Mode State
export let isPanoramaMode = false;
export function setIsPanoramaMode(val) { isPanoramaMode = val; }
export let originalSkyBackground = null;
export function setOriginalSkyBackground(val) { originalSkyBackground = val; }
export let panoramaSkyMesh = null;
export function setPanoramaSkyMesh(val) { panoramaSkyMesh = val; }
export let panoramaHotspotsGroup = null;
export function setPanoramaHotspotsGroup(val) { panoramaHotspotsGroup = val; }

// Animation Registration Utility
export function registerAnimation(obj, animateFn) {
  obj.userData = obj.userData || {};
  obj.userData.animate = animateFn;
  animatedObjects.push(obj);
  return obj;
}

// Physics Spheres State
export const NUM_SPHERES = 25;
export const SPHERE_RADIUS = 0.25;
export const sphereGeometry = new THREE.IcosahedronGeometry(SPHERE_RADIUS, 3);
export const sphereMaterial = new THREE.MeshStandardMaterial({ color: 0x00CED1, roughness: 0.2, metalness: 0.8 });
export const spheres = [];
export let sphereIdx = 0;
export function setSphereIdx(val) { sphereIdx = val; }

// Audio & Video References
export let listener, soundMedia, positionalAudio;
export function setListener(val) { listener = val; }
export function setSoundMedia(val) { soundMedia = val; }
export function setPositionalAudio(val) { positionalAudio = val; }

export let videoCity, videoTexture, videoMaterial;
export function setVideoCity(val) { videoCity = val; }
export function setVideoTexture(val) { videoTexture = val; }
export function setVideoMaterial(val) { videoMaterial = val; }

// AR Card Booth State
export let arElementsGroup = null;
export function setArElementsGroup(val) { arElementsGroup = val; }
export let arScanTimer = null;
export function setArScanTimer(val) { arScanTimer = val; }
export let isARScanned = false;
export function setIsARScanned(val) { isARScanned = val; }

// Space Observatory State
export let matahari, planetMiller, stasiunISS, ringNebula, meteoroid, roketCone, spaceGroup;
export function setMatahari(val) { matahari = val; }
export function setPlanetMiller(val) { planetMiller = val; }
export function setStasiunISS(val) { stasiunISS = val; }
export function setRingNebula(val) { ringNebula = val; }
export function setMeteoroid(val) { meteoroid = val; }
export function setRoketCone(val) { roketCone = val; }
export function setSpaceGroup(val) { spaceGroup = val; }

// Cyberpunk Showroom State
export let cyberSamurai, flyingCar, busterDrone, scifiTowers;
export function setCyberSamurai(val) { cyberSamurai = val; }
export function setFlyingCar(val) { flyingCar = val; }
export function setBusterDrone(val) { busterDrone = val; }
export function setScifiTowers(val) { scifiTowers = val; }

export let primBox, primSphere, primCyl, primCone;
export function setPrimBox(val) { primBox = val; }
export function setPrimSphere(val) { primSphere = val; }
export function setPrimCyl(val) { primCyl = val; }
export function setPrimCone(val) { primCone = val; }

export let cylFlying = false, cylFlyProgress = 0;
export function setCylFlying(val) { cylFlying = val; }
export function setCylFlyProgress(val) { cylFlyProgress = val; }

// Score & Collectibles State
export let playerScore = 0;
export function setPlayerScore(val) { playerScore = val; }
export let collectedCount = 0;
export function setCollectedCount(val) { collectedCount = val; }
export let totalCollectibles = 0;
export function setTotalCollectibles(val) { totalCollectibles = val; }
export const collectiblesList = [];
