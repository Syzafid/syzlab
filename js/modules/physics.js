import * as THREE from 'three';
import {
  scene, camera, worldOctree, playerCollider, playerVelocity, playerDirection,
  playerOnFloor, setPlayerOnFloor, keyStates, GRAVITY, spheres, sphereIdx, setSphereIdx,
  sphereGeometry, sphereMaterial, NUM_SPHERES
} from './state.js';

// Pre-allocated static vectors to eliminate Garbage Collection allocations per frame!
const _tempDeltaPos = new THREE.Vector3();
const _forwardVec = new THREE.Vector3();
const _sideVec = new THREE.Vector3();

export function teleportPlayer(x, z) {
  playerCollider.start.set(x, 0.35, z);
  playerCollider.end.set(x, 1.65, z);
  playerVelocity.set(0, 0, 0);
  if (camera) camera.position.copy(playerCollider.end);
}

export function initPhysicsSpheres() {
  for (let i = 0; i < NUM_SPHERES; i++) {
    const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphereMesh.castShadow = true;
    sphereMesh.receiveShadow = true;
    scene.add(sphereMesh);

    spheres.push({
      mesh: sphereMesh,
      collider: new THREE.Sphere(new THREE.Vector3(0, -100, 0), 0.25),
      velocity: new THREE.Vector3()
    });
  }
}

export function throwBall() {
  if (spheres.length === 0) return;
  const sphere = spheres[sphereIdx];
  camera.getWorldDirection(playerDirection);

  sphere.collider.center.copy(playerCollider.end).addScaledVector(playerDirection, playerCollider.radius * 1.5);
  const impulse = 30;
  sphere.velocity.copy(playerDirection).multiplyScalar(impulse);
  sphere.velocity.addScaledVector(playerVelocity, 2);

  setSphereIdx((sphereIdx + 1) % NUM_SPHERES);
}

export function playerCollisions() {
  const result = worldOctree.capsuleIntersect(playerCollider);
  setPlayerOnFloor(false);
  if (result) {
    setPlayerOnFloor(result.normal.y > 0);
    if (!playerOnFloor) {
      playerVelocity.addScaledVector(result.normal, -result.normal.dot(playerVelocity));
    }
    playerCollider.translate(result.normal.multiplyScalar(result.depth));
  }
}

export function updatePlayer(deltaTime) {
  let damping = Math.exp(-4 * deltaTime) - 1;
  if (!playerOnFloor) {
    playerVelocity.y -= GRAVITY * deltaTime;
    damping *= 0.1;
  }
  playerVelocity.addScaledVector(playerVelocity, damping);
  _tempDeltaPos.copy(playerVelocity).multiplyScalar(deltaTime);
  playerCollider.translate(_tempDeltaPos);
  playerCollisions();
  camera.position.copy(playerCollider.end);
}

export function getForwardVector() {
  camera.getWorldDirection(_forwardVec);
  _forwardVec.y = 0;
  _forwardVec.normalize();
  return _forwardVec;
}

export function getSideVector() {
  camera.getWorldDirection(_sideVec);
  _sideVec.y = 0;
  _sideVec.normalize();
  _sideVec.cross(camera.up);
  return _sideVec;
}

export function updateControls(deltaTime) {
  const speedDelta = deltaTime * (playerOnFloor ? 25 : 8);
  if (keyStates['KeyW']) playerVelocity.add(getForwardVector().multiplyScalar(speedDelta));
  if (keyStates['KeyS']) playerVelocity.add(getForwardVector().multiplyScalar(-speedDelta));
  if (keyStates['KeyA']) playerVelocity.add(getSideVector().multiplyScalar(-speedDelta));
  if (keyStates['KeyD']) playerVelocity.add(getSideVector().multiplyScalar(speedDelta));

  if (playerOnFloor && keyStates['Space']) {
    playerVelocity.y = 12;
  }
}

export function updateSpheres(deltaTime) {
  for (let i = 0; i < spheres.length; i++) {
    const sphere = spheres[i];
    if (sphere.collider.center.y < -50) continue;
    sphere.collider.center.addScaledVector(sphere.velocity, deltaTime);
    const result = worldOctree.sphereIntersect(sphere.collider);
    if (result) {
      sphere.velocity.addScaledVector(result.normal, -result.normal.dot(sphere.velocity) * 1.5);
      sphere.collider.center.add(result.normal.multiplyScalar(result.depth));
    } else {
      sphere.velocity.y -= GRAVITY * deltaTime;
    }
    const damping = Math.exp(-1.5 * deltaTime) - 1;
    sphere.velocity.addScaledVector(sphere.velocity, damping);
    sphere.mesh.position.copy(sphere.collider.center);
  }
}
