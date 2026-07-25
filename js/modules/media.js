import * as THREE from 'three';
import { GLTFLoader } from '../jsm/loaders/GLTFLoader.js';
import {
  scene, camera, setListener, positionalAudio, setPositionalAudio
} from './state.js';

export function setupAudioAndVideo() {
  try {
    // Positional Audio BoomBox in Lobby
    const newListener = new THREE.AudioListener();
    setListener(newListener);
    camera.add(newListener);

    const audioElement = document.getElementById('music');
    if (audioElement) {
      const posAudio = new THREE.PositionalAudio(newListener);
      setPositionalAudio(posAudio);
      try {
        posAudio.setMediaElementSource(audioElement);
        posAudio.setRefDistance(3);
      } catch (e) {
        console.warn("Positional audio node notice:", e);
      }
    }

    const gltfLoader = new GLTFLoader();
    gltfLoader.load('./assets/models/BoomBox.glb', (gltf) => {
      const boomBox = gltf.scene;
      boomBox.position.set(0, 0.5, 4);
      boomBox.scale.set(25, 25, 25);
      if (positionalAudio) boomBox.add(positionalAudio);
      scene.add(boomBox);
    }, undefined, (err) => {
      console.warn("BoomBox model notice:", err);
    });
  } catch (err) {
    console.warn("setupAudioAndVideo notice:", err);
  }
}
