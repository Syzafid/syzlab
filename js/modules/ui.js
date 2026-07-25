import { camera, playerCollider, playerVelocity, isPanoramaMode } from './state.js';
import { togglePanoramaMode } from './panorama.js';
import { showHUDCard } from './interactivity.js';

export function teleportPlayer(x, z, rotY = null) {
  playerCollider.start.set(x, 0.35, z);
  playerCollider.end.set(x, 1.65, z);
  playerVelocity.set(0, 0, 0);
  if (camera) {
    camera.position.copy(playerCollider.end);
    if (rotY !== null) {
      camera.rotation.y = rotY;
    }
  }
}

export function setupUIControls() {
  const hudCloseBtn = document.getElementById('hud-close');
  if (hudCloseBtn) {
    hudCloseBtn.addEventListener('click', () => {
      document.getElementById('hud-card').classList.remove('active');
    });
  }

  const btnLobby = document.getElementById('btn-teleport-lobby');
  if (btnLobby) {
    btnLobby.addEventListener('click', () => {
      if (isPanoramaMode) togglePanoramaMode(false);
      teleportPlayer(0, 10, 0);
      showHUDCard(
        "LOBBY UTAMA",
        "Lobby Utama Gallery",
        "Ruang utama pameran metaverse Syafrizal Amri Fajar. Dilengkapi audio Interstellar, arena parkour, simulasi fisika, dan koleksi poin."
      );
    });
  }

  const btnAR = document.getElementById('btn-teleport-ar');
  if (btnAR) {
    btnAR.addEventListener('click', () => {
      if (isPanoramaMode) togglePanoramaMode(false);
      teleportPlayer(-20, 0, Math.PI / 2);
      showHUDCard(
        "BILIK 1 — AR CARD",
        "Bilik 1 — AR Card",
        "Pameran Kartu Nama AR interaktif. Pindai kartu di tengah untuk menampilkan elemen 3D, portofolio, dan Maskot Owl (spirit animal Syafrizal)."
      );
    });
  }

  const btnSpace = document.getElementById('btn-teleport-space');
  if (btnSpace) {
    btnSpace.addEventListener('click', () => {
      if (isPanoramaMode) togglePanoramaMode(false);
      teleportPlayer(0, -20, Math.PI);
      showHUDCard(
        "BILIK 2 — SPACE OBSERVATORY",
        "Bilik 2 — Space Observatory",
        "Observatorium astronomi dengan visualisasi Matahari, Planet Miller, Stasiun ISS, roket, komet, sabuk asteroid, dan anjungan pandang."
      );
    });
  }

  const btnCyber = document.getElementById('btn-teleport-cyber');
  if (btnCyber) {
    btnCyber.addEventListener('click', () => {
      if (isPanoramaMode) togglePanoramaMode(false);
      teleportPlayer(25, 4, -Math.PI / 2);
      showHUDCard(
        "BILIK 3 — CYBERPUNK VR HUB",
        "Bilik 3 — Cyberpunk VR Hub",
        "Hub eksibisi futuristik. Akses 3 Portal Black Hole menuju Geometri Primitif (Scene 1), Panorama 360° (Scene 2), dan Model GLTF (Scene 3)."
      );
    });
  }

  const arModal = document.getElementById('ar-modal');
  const btnOpenAR = document.getElementById('btn-open-ar');
  const arCloseBtn = document.getElementById('ar-close-btn');

  if (btnOpenAR && arModal) {
    btnOpenAR.addEventListener('click', () => arModal.classList.add('open'));
  }
  if (arCloseBtn && arModal) {
    arCloseBtn.addEventListener('click', () => arModal.classList.remove('open'));
  }
}
