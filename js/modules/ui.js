import { camera, playerCollider, playerVelocity, isPanoramaMode } from './state.js';
import { togglePanoramaMode } from './panorama.js';

export function teleportPlayer(x, z) {
  playerCollider.start.set(x, 0.35, z);
  playerCollider.end.set(x, 1.65, z);
  playerVelocity.set(0, 0, 0);
  camera.position.copy(playerCollider.end);
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
      teleportPlayer(0, 10);
    });
  }

  const btnAR = document.getElementById('btn-teleport-ar');
  if (btnAR) {
    btnAR.addEventListener('click', () => {
      if (isPanoramaMode) togglePanoramaMode(false);
      teleportPlayer(-20, 0);
      camera.rotation.y = Math.PI / 2;
    });
  }

  const btnSpace = document.getElementById('btn-teleport-space');
  if (btnSpace) {
    btnSpace.addEventListener('click', () => {
      if (isPanoramaMode) togglePanoramaMode(false);
      teleportPlayer(0, -20);
    });
  }

  const btnCyber = document.getElementById('btn-teleport-cyber');
  if (btnCyber) {
    btnCyber.addEventListener('click', () => {
      if (isPanoramaMode) togglePanoramaMode(false);
      teleportPlayer(25, 4);
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
