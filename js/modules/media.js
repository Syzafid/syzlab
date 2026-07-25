// Media module – sets up positional audio and interactive BoomBox model
import * as THREE from 'three';
import { GLTFLoader } from 'https://unpkg.com/three@0.152.2/examples/jsm/loaders/GLTFLoader.js';
import { scene, camera, setListener, positionalAudio, setPositionalAudio, interactiveObjects } from './state.js';
import { showHUDCard } from './interactivity.js';

export function setupAudioAndVideo() {
  try {
    // 1️⃣ Positional Audio listener
    const listener = new THREE.AudioListener();
    setListener(listener);
    camera.add(listener);

    // 2️⃣ HTML <audio> element – wait for user interaction to start playback
    const audioEl = document.getElementById('music');
    let posAudio = null;

    if (audioEl) {
      posAudio = new THREE.PositionalAudio(listener);
      setPositionalAudio(posAudio);
      try {
        posAudio.setMediaElementSource(audioEl);
        posAudio.setRefDistance(3);
      } catch (e) {
        console.warn('Positional audio node notice:', e);
      }

      // Start playback when user first interacts with the page
      const startAudio = () => {
        if (listener && listener.context && listener.context.state === 'suspended') {
          listener.context.resume();
        }
        if (audioEl) {
          audioEl.play().catch(err => console.warn('Audio autoplay notice:', err));
        }
      };

      document.addEventListener('click', startAudio, { once: true });
      document.addEventListener('keydown', startAudio, { once: true });
    }

    // 3️⃣ Load BoomBox model as the interactive speaker
    const loader = new GLTFLoader();
    loader.load(
      './assets/models/BoomBox.glb',
      gltf => {
        const boomBox = gltf.scene;
        boomBox.position.set(0, 0.5, 4);
        boomBox.scale.set(25, 25, 25);

        // Interaction configuration for BoomBox
        const boomBoxData = {
          isInteractive: true,
          tag: 'BoomBox Audio',
          title: 'Pengaturan Volume Musik',
          desc: 'Klik atau tatap speaker ini selama 5 detik untuk mengubah volume musik (Interstellar).',
          onClick: () => {
            if (!audioEl) return;
            // Ensure audio context is active
            if (listener && listener.context && listener.context.state === 'suspended') {
              listener.context.resume();
            }
            if (audioEl.paused) {
              audioEl.play().catch(err => console.warn('Audio play notice:', err));
            }
            let newVol = audioEl.volume + 0.25;
            if (newVol > 1.01) newVol = 0;
            audioEl.volume = Math.min(1.0, newVol);
            const displayVol = Math.round(audioEl.volume * 100);
            showHUDCard(
              'BoomBox Audio',
              'Volume Musik',
              displayVol === 0 ? 'Volume: MUTE (0%)' : `Volume: ${displayVol}%`
            );
          }
        };

        boomBox.userData = boomBoxData;
        boomBox.traverse(child => {
          if (child.isMesh) {
            child.userData = boomBoxData;
          }
        });

        if (posAudio) boomBox.add(posAudio);
        scene.add(boomBox);
        interactiveObjects.push(boomBox);
      },
      undefined,
      err => console.warn('BoomBox model load notice:', err)
    );
  } catch (err) {
    console.warn('setupAudioAndVideo notice:', err);
  }
}

