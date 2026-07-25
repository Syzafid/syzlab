import * as THREE from 'three';
import {
  scene, playerCollider, playerScore, setPlayerScore,
  collectedCount, setCollectedCount, totalCollectibles, setTotalCollectibles,
  collectiblesList
} from './state.js';

// Reusable Shared Geometries & Materials (Zero GPU allocations!)
const crystalGeo = new THREE.OctahedronGeometry(0.35, 0);
const rareCrystalGeo = new THREE.OctahedronGeometry(0.55, 0);

const normalMat = new THREE.MeshStandardMaterial({
  color: 0x00CED1,
  emissive: 0x00CED1,
  emissiveIntensity: 0.8,
  roughness: 0.1,
  metalness: 0.9
});

const rareMat = new THREE.MeshStandardMaterial({
  color: 0xFFD700,
  emissive: 0xFFD700,
  emissiveIntensity: 1.2,
  roughness: 0.1,
  metalness: 0.95
});

const ringGeo = new THREE.RingGeometry(0.4, 0.52, 12);
const normalRingMat = new THREE.MeshBasicMaterial({ color: 0x00CED1, side: THREE.DoubleSide, transparent: true, opacity: 0.7 });
const rareRingMat = new THREE.MeshBasicMaterial({ color: 0xFFD700, side: THREE.DoubleSide, transparent: true, opacity: 0.8 });

export function createCollectible(x, y, z, isRare = false, label = "") {
  const mesh = new THREE.Mesh(isRare ? rareCrystalGeo : crystalGeo, isRare ? rareMat : normalMat);
  mesh.position.set(x, y, z);
  mesh.castShadow = true;

  // Add subtle outer glowing ring
  const ring = new THREE.Mesh(ringGeo, isRare ? rareRingMat : normalRingMat);
  ring.rotation.x = Math.PI / 2;
  mesh.add(ring);

  const itemData = {
    mesh,
    x,
    baseY: y,
    z,
    isRare,
    points: isRare ? 50 : 10,
    label: label || (isRare ? "Rare Gold Crystal (+50 Poin)" : "Cyan Crystal (+10 Poin)"),
    isCollected: false,
    popProgress: 0
  };

  mesh.userData = itemData;

  scene.add(mesh);
  collectiblesList.push(itemData);
  setTotalCollectibles(collectiblesList.length);
  updateHUDCounter();
  return mesh;
}

// ULTRA-FAST SINGLE PASS LOOP: Rotates, floats, and checks distance in 1 pass!
export function updateCollectibles(deltaTime) {
  const px = playerCollider.end.x;
  const py = playerCollider.end.y;
  const pz = playerCollider.end.z;
  const time = performance.now() * 0.0015;

  for (let i = 0, len = collectiblesList.length; i < len; i++) {
    const item = collectiblesList[i];

    if (!item.isCollected) {
      // 1. Single pass float & rotate animation
      const mesh = item.mesh;
      mesh.position.y = item.baseY + Math.sin(time * 2.0 + item.x) * 0.15;
      mesh.rotation.y = time * 1.2;

      // 2. Fast bounding box / squared distance check (Pickup radius: ~1.8m)
      const dx = px - item.x;
      const dy = py - mesh.position.y;
      const dz = pz - item.z;

      if (dx * dx + dy * dy + dz * dz < 3.24) {
        collectItem(item);
      }
    } else if (item.popProgress < 1) {
      // Pick-up animation: floats up and shrinks out
      item.popProgress += deltaTime * 3.5;
      item.mesh.position.y += deltaTime * 2.5;
      const s = Math.max(0, 1 - item.popProgress);
      item.mesh.scale.set(s, s, s);
      if (item.popProgress >= 1) {
        item.mesh.visible = false;
        scene.remove(item.mesh);
      }
    }
  }
}

function collectItem(item) {
  item.isCollected = true;
  setPlayerScore(playerScore + item.points);
  setCollectedCount(collectedCount + 1);

  updateHUDCounter();
  showScoreToast(`+${item.points} Poin! (${item.label})`);

  playChimeSound(item.isRare);

  if (collectedCount === totalCollectibles && totalCollectibles > 0) {
    setTimeout(() => {
      showScoreToast("🏆 SELAMAT! Semua Kristal Terkumpul! - Master Explorer!");
    }, 500);
  }
}

function updateHUDCounter() {
  const scoreEl = document.getElementById('hud-score-val');
  const countEl = document.getElementById('hud-count-val');
  if (scoreEl) scoreEl.innerText = playerScore;
  if (countEl) countEl.innerText = `${collectedCount} / ${totalCollectibles}`;
}

function showScoreToast(msg) {
  let toastContainer = document.getElementById('toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.className = 'score-toast';
  toast.innerText = msg;
  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('fade-out');
    setTimeout(() => toast.remove(), 400);
  }, 1800);
}

// Lightweight Audio Synthesizer (Instant SFX)
function playChimeSound(isRare) {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    const freq = isRare ? 880 : 587.33;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.5, ctx.currentTime + 0.12);

    gain.gain.setValueAtTime(0.18, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.2);
  } catch (e) {
    // Ignore audio context block
  }
}
