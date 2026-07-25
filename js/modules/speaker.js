import * as THREE from 'three';
import { showHUDCard } from './interactivity.js';
import { scene, interactiveObjects, positionalAudio } from './state.js';

/**
 * Build a simple speaker mesh that toggles music volume on click.
 * Each click increases volume by 25% and wraps back to 0 (mute).
 */
export function buildSpeaker() {
  const geometry = new THREE.BoxGeometry(0.5, 1, 0.5);
  const material = new THREE.MeshStandardMaterial({ color: 0x777777, metalness: 0.6, roughness: 0.2 });
  const speaker = new THREE.Mesh(geometry, material);

  // Position the speaker near the entrance for easy access
  speaker.position.set(0, 1, -4);
  speaker.castShadow = true;
  speaker.receiveShadow = true;

  // Interaction data
  speaker.userData = {
    isInteractive: true,
    tag: 'Speaker',
    title: 'Pengaturan Volume',
    desc: 'Klik speaker untuk mengubah volume musik.',
    onClick: () => {
      const musicEl = document.getElementById('music');
      if (!musicEl) return;
      // Increase volume by 0.25 (25%); wrap to 0 after exceeding 1
      let newVol = musicEl.volume + 0.25;
      if (newVol > 1) newVol = 0;
      musicEl.volume = newVol;
      // Show HUD feedback
      showHUDCard('Speaker', 'Volume', `Volume: ${Math.round(musicEl.volume * 100)}%`);
    }
  };

  // Attach positional audio if it exists (BoomBox removed, speaker now carries audio)
  if (positionalAudio) speaker.add(positionalAudio);

  // Add to scene and interactive list
  scene.add(speaker);
  interactiveObjects.push(speaker);
}
