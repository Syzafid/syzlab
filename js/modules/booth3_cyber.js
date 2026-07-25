import * as THREE from 'three';
import {
  scene, interactiveObjects, flyingCar, busterDrone, scifiTowers, primBox, primSphere, primCyl, primCone,
  setCyberSamurai, setFlyingCar, setBusterDrone, setScifiTowers,
  setPrimBox, setPrimSphere, setPrimCyl, setPrimCone,
  cylFlying, setCylFlying, setCylFlyProgress
} from './state.js';
import { showHUDCard } from './interactivity.js';
import { teleportPlayer } from './physics.js';
import { createSubWorldHeader } from './gallery.js';
import { GLTFLoader } from 'https://unpkg.com/three@0.152.2/examples/jsm/loaders/GLTFLoader.js';

let gltfLoader = null;

function createBlackHolePortal(group, px, py, pz, titleTag, cardTitle, cardDesc, hexColor, onTeleport, rotY = 0) {
  const portalGroup = new THREE.Group();
  portalGroup.position.set(px, py, pz);
  portalGroup.rotation.y = rotY;

  const ringGeo = new THREE.TorusGeometry(1.8, 0.12, 16, 64);
  const ringMat = new THREE.MeshStandardMaterial({
    color: hexColor,
    emissive: hexColor,
    emissiveIntensity: 1.5,
    roughness: 0.1,
    metalness: 0.9
  });
  const ringMesh = new THREE.Mesh(ringGeo, ringMat);
  portalGroup.add(ringMesh);

  const innerRingGeo = new THREE.TorusGeometry(1.4, 0.06, 16, 48);
  const innerRingMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const innerRingMesh = new THREE.Mesh(innerRingGeo, innerRingMat);
  portalGroup.add(innerRingMesh);

  const holeGeo = new THREE.PlaneGeometry(3.2, 3.2);
  const holeMat = new THREE.MeshBasicMaterial({ color: 0x020205, side: THREE.DoubleSide });
  const holeMesh = new THREE.Mesh(holeGeo, holeMat);
  portalGroup.add(holeMesh);

  portalGroup.userData = {
    isInteractive: true,
    tag: titleTag,
    title: cardTitle,
    desc: cardDesc,
    onClick: onTeleport
  };

  group.add(portalGroup);
  interactiveObjects.push(portalGroup);
  return portalGroup;
}

export function buildCyberpunkBooth() {
  gltfLoader = new GLTFLoader();
  const cyberpunkGroup = new THREE.Group();
  cyberpunkGroup.position.set(25, 0, 0);

  createSubWorldHeader(cyberpunkGroup, "🤖 BILIK 3: CYBERPUNK VR HUB", 0x9370DB, 0, 6.2, -9.5);

  // 🌐 PORTAL 1: SCENE 1 — PRIMITIF 3D VR ARENA (Sisi Kiri: pz = -5.5, px = 6.0, rotY = -Math.PI/2)
  createBlackHolePortal(
    cyberpunkGroup,
    6.0, 2.0, -5.5,
    "🌐 PORTAL 1: SCENE 1 (PRIMITIF VR)",
    "PORTAL SCENE 1 — BILIK KHUSUS PRIMITIF VR",
    "Masuk ke Portal Black Hole ini untuk berpindah ke Bilik Khusus Scene 1 (Arena Eksperimen Geometri 3D Primitif)!",
    0x9370DB,
    () => {
      // Teleport to Room 3A: positioned at (25, 67.5) in front of 3A portal (at z=70), facing Math.PI (into room 3A, away from portal)
      teleportPlayer(25, 67.5, Math.PI);
      showHUDCard(
        "BILIK 3A — SCENE 1",
        "Bilik 3A — Geometri 3D Primitif",
        "Bilik eksperimen bentuk 3D primitif: Kubus, Bola, Silinder Terbang, dan Kerucut Rotasi. Gunakan portal di belakang untuk kembali."
      );
    },
    -Math.PI / 2
  );

  // 📷 PORTAL 2: SCENE 2 — PANORAMA 360° VR (Sisi Tengah: pz = 0.0, px = 6.0, rotY = -Math.PI/2)
  createBlackHolePortal(
    cyberpunkGroup,
    6.0, 2.0, 0.0,
    "📷 PORTAL 2: SCENE 2 (PANORAMA 360°)",
    "PORTAL SCENE 2 — PANORAMA 360° STANDALONE",
    "Masuk ke Portal Black Hole ini untuk membuka halaman Scene 2 Panorama 360° Standalone (A-Frame VR)!",
    0x00CED1,
    () => {
      window.location.href = './scene2.html';
    },
    -Math.PI / 2
  );

  // 🤖 PORTAL 3: SCENE 3 — MODEL GLTF SHOWROOM (Sisi Kanan: pz = 5.5, px = 6.0, rotY = -Math.PI/2)
  createBlackHolePortal(
    cyberpunkGroup,
    6.0, 2.0, 5.5,
    "🤖 PORTAL 3: SCENE 3 (MODEL GLTF)",
    "PORTAL SCENE 3 — BILIK KHUSUS MODEL GLTF",
    "Masuk ke Portal Black Hole ini untuk berpindah ke Bilik Khusus Scene 3 (Pameran Model GLTF Sci-Fi)!",
    0xFFD700,
    () => {
      // Teleport to Room 3C: positioned at (65, 7.5) in front of 3C portal (at z=10), facing Math.PI (into room 3C, away from portal)
      teleportPlayer(65, 7.5, Math.PI);
      showHUDCard(
        "BILIK 3C — SCENE 3",
        "Bilik 3C — Showroom Model 3D",
        "Pameran model 3D sci-fi: Cyber Samurai, Mobil Terbang, Buster Drone, dan Menara Sci-Fi. Gunakan portal di belakang untuk kembali."
      );
    },
    -Math.PI / 2
  );

  // ── BILIK KHUSUS 3A (SCENE 1: PRIMITIF 3D VR ARENA) ──────────────────────
  const room3AGroup = new THREE.Group();
  room3AGroup.position.set(0, 0, 60);

  createSubWorldHeader(room3AGroup, "🌐 BILIK KHUSUS 3A: SCENE 1 PRIMITIF VR", 0x9370DB, 0, 6.2, -10.5);

  const stageMat = new THREE.MeshStandardMaterial({ color: 0x111628, roughness: 0.3, metalness: 0.8 });
  const primStage = new THREE.Mesh(new THREE.BoxGeometry(14, 0.3, 3.5), stageMat);
  primStage.position.set(0, 0.15, 0);
  primStage.receiveShadow = true;
  room3AGroup.add(primStage);

  const stageTrim = new THREE.Mesh(new THREE.BoxGeometry(14.1, 0.04, 3.6), new THREE.MeshBasicMaterial({ color: 0x9370DB }));
  stageTrim.position.set(0, 0.3, 0);
  room3AGroup.add(stageTrim);

  // 1. Box
  const boxMat = new THREE.MeshStandardMaterial({ color: 0x00CED1, roughness: 0.3, metalness: 0.5 });
  const pBox = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.2, 1.2), boxMat);
  pBox.position.set(-4.5, 1.1, 0);
  pBox.castShadow = true;
  setPrimBox(pBox);
  const boxPalet = ['#00CED1', '#FF6347', '#9370DB', '#FFD700', '#00E5A0', '#FF6B9D'];
  pBox.userData = {
    isInteractive: true,
    tag: "SCENE 1 — PRIMITIF VR",
    title: "Kubus Interaktif (Interactive Box)",
    desc: "Kubus 3D beranimasi rotasi & denyut skala. Klik untuk mengubah warna secara acak!",
    onClick: () => {
      const randColor = boxPalet[Math.floor(Math.random() * boxPalet.length)];
      boxMat.color.setStyle(randColor);
    }
  };
  room3AGroup.add(pBox);
  interactiveObjects.push(pBox);

  // 2. Sphere
  const sphereMat = new THREE.MeshStandardMaterial({ color: 0xFF6347, roughness: 0.3, metalness: 0.5 });
  const pSphere = new THREE.Mesh(new THREE.SphereGeometry(0.7, 32, 32), sphereMat);
  pSphere.position.set(-1.5, 1.1, 0);
  pSphere.castShadow = true;
  setPrimSphere(pSphere);
  pSphere.userData = {
    isInteractive: true,
    tag: "SCENE 1 — PRIMITIF VR",
    title: "Bola Interaktif (Interactive Sphere)",
    desc: "Bola 3D yang bergerak sinusoidal. Sorot kursor untuk mengubah warna jadi Emas, klik untuk spin 360°!",
    onHover: () => sphereMat.color.setStyle('#FFD700'),
    onUnhover: () => sphereMat.color.setStyle('#FF6347'),
    onClick: () => {
      let startT = performance.now();
      function spinAnim() {
        let elapsed = performance.now() - startT;
        let p = Math.min(1, elapsed / 800);
        pSphere.rotation.y = p * Math.PI * 2;
        if (p < 1) requestAnimationFrame(spinAnim);
      }
      spinAnim();
    }
  };
  room3AGroup.add(pSphere);
  interactiveObjects.push(pSphere);

  // 3. Cylinder
  const cylMat = new THREE.MeshStandardMaterial({ color: 0x9370DB, roughness: 0.3, metalness: 0.5 });
  const pCyl = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 1.4, 32), cylMat);
  pCyl.position.set(1.5, 1.1, 0);
  pCyl.castShadow = true;
  setPrimCyl(pCyl);
  pCyl.userData = {
    isInteractive: true,
    tag: "SCENE 1 — PRIMITIF VR",
    title: "Silinder Terbang (Fly-Up Cylinder)",
    desc: "Silinder 3D interaktif. Klik untuk meluncurkan silinder terbang ke atas lalu mendarat kembali!",
    onClick: () => {
      if (cylFlying) return;
      setCylFlying(true);
      let startT = performance.now();
      function flyAnim() {
        let elapsed = performance.now() - startT;
        if (elapsed < 400) {
          pCyl.position.y = 1.1 + (elapsed / 400) * 3.5;
          requestAnimationFrame(flyAnim);
        } else if (elapsed < 900) {
          let p = (elapsed - 400) / 500;
          pCyl.position.y = 4.6 - p * 3.5;
          requestAnimationFrame(flyAnim);
        } else {
          pCyl.position.y = 1.1;
          setCylFlying(false);
        }
      }
      flyAnim();
    }
  };
  room3AGroup.add(pCyl);
  interactiveObjects.push(pCyl);

  // 4. Cone
  const coneMat = new THREE.MeshStandardMaterial({ color: 0x00CED1, roughness: 0.3, metalness: 0.5 });
  const pCone = new THREE.Mesh(new THREE.ConeGeometry(0.55, 1.3, 32), coneMat);
  pCone.position.set(4.5, 1.1, 0);
  pCone.castShadow = true;
  setPrimCone(pCone);
  const coneColors = ['#FF6347', '#9370DB', '#FFD700', '#00CED1'];
  let coneIdx = 0;
  pCone.userData = {
    isInteractive: true,
    tag: "SCENE 1 — PRIMITIF VR",
    title: "Kerucut Rotasi (Rotating Cone)",
    desc: "Kerucut 3D yang terus berputar. Klik untuk mengganti variasi warna pastel sci-fi!",
    onClick: () => {
      coneIdx = (coneIdx + 1) % coneColors.length;
      coneMat.color.setStyle(coneColors[coneIdx]);
    }
  };
  room3AGroup.add(pCone);
  interactiveObjects.push(pCone);

  // Portal 3A Return
  createBlackHolePortal(
    room3AGroup,
    0, 2.0, 10.0,
    "🌌 KEMBALI KE BILIK 3 HUB",
    "PORTAL KEMBALI — BILIK KHUSUS 3A",
    "Masuk ke Black Hole ini untuk kembali ke Bilik 3 Cyberpunk Hub!",
    0x9370DB,
    () => {
      // Return to Hub: spawn at (28.5, -5.5) in front of Portal 1 (at x=31, z=-5.5), facing -Math.PI/2 (into Hub, away from portal)
      teleportPlayer(28.5, -5.5, -Math.PI / 2);
      showHUDCard("BILIK 3 — CYBERPUNK HUB", "Bilik 3 — Cyberpunk VR Hub", "Kembali ke Hub Cyberpunk VR. Portal eksibisi berada di belakang Anda.");
    }
  );

  cyberpunkGroup.add(room3AGroup);

  // ── BILIK KHUSUS 3C (SCENE 3: MODEL GLTF SHOWROOM HARMONIS & RAPI) ────────
  const room3CGroup = new THREE.Group();
  room3CGroup.position.set(40, 0, 0);

  createSubWorldHeader(room3CGroup, "🤖 BILIK KHUSUS 3C: SCENE 3 MODEL GLTF", 0xFFD700, 0, 6.2, -10.5);

  // Pedestal Stand Generator untuk 4 Model GLTF tersusun rapi & seimbang!
  const pedestalGeo = new THREE.CylinderGeometry(1.2, 1.4, 0.4, 32);
  const pedestalMat = new THREE.MeshStandardMaterial({ color: 0x161c30, roughness: 0.2, metalness: 0.8 });
  const pedestalRingMat = new THREE.MeshBasicMaterial({ color: 0xFFD700 });

  function createPedestal(px, pz) {
    const pMesh = new THREE.Mesh(pedestalGeo, pedestalMat);
    pMesh.position.set(px, 0.2, pz);
    pMesh.receiveShadow = true;
    room3CGroup.add(pMesh);

    const ring = new THREE.Mesh(new THREE.TorusGeometry(1.22, 0.03, 12, 32), pedestalRingMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.set(px, 0.41, pz);
    room3CGroup.add(ring);
  }

  // Build 4 Matching Display Pedestals at x = -6, -2, 2, 6 along z = -2
  createPedestal(-6.0, -2.0);
  createPedestal(-2.0, -2.0);
  createPedestal(2.0, -2.0);
  createPedestal(6.0, -2.0);

  // 1. Model GLTF: Cyber Samurai (Display Height ~2.2m)
  gltfLoader.load('./assets/models/cyber_samurai.glb', (gltf) => {
    const samurai = gltf.scene;
    samurai.position.set(-6.0, 0.4, -2.0);
    samurai.scale.set(1.2, 1.2, 1.2);
    samurai.traverse((child) => { if (child.isMesh) child.castShadow = true; });
    samurai.userData = {
      isInteractive: true,
      tag: "SCENE 3 — MODEL GLTF",
      title: "Cyber Samurai",
      desc: "Model 3D Karakter Futuristik Cyber Samurai lengkap dengan armor sci-fi berpendar neon.",
      onClick: () => {
        let startT = performance.now();
        function spin() {
          let p = (performance.now() - startT) / 1000;
          samurai.rotation.y = p * Math.PI * 2;
          if (p < 1) requestAnimationFrame(spin);
        }
        spin();
      }
    };
    setCyberSamurai(samurai);
    room3CGroup.add(samurai);
    interactiveObjects.push(samurai);
  });

  // 2. Model GLTF: Mobil Terbang / Hover Car (Display Height Harmonized ~2.2m)
  gltfLoader.load('./assets/models/flying_car.glb', (gltf) => {
    const car = gltf.scene;
    car.position.set(-2.0, 1.3, -2.0);
    car.scale.set(0.65, 0.65, 0.65);
    car.traverse((child) => { if (child.isMesh) child.castShadow = true; });
    car.userData = {
      isInteractive: true,
      tag: "SCENE 3 — MODEL GLTF",
      title: "Mobil Terbang (Hover Car)",
      desc: "Kendaraan otonom masa depan berteknologi anti-gravitasi untuk transportasi udara perkotaan.",
      onClick: () => {
        let startT = performance.now();
        function spin() {
          let p = (performance.now() - startT) / 1000;
          car.rotation.y = p * Math.PI * 2;
          if (p < 1) requestAnimationFrame(spin);
        }
        spin();
      }
    };
    setFlyingCar(car);
    room3CGroup.add(car);
    interactiveObjects.push(car);
  });

  // 3. Model GLTF: Buster Drone Sci-Fi (Display Height Harmonized ~2.2m)
  gltfLoader.load('./assets/models/buster_drone.glb', (gltf) => {
    const drone = gltf.scene;
    drone.position.set(2.0, 1.3, -2.0);
    drone.scale.set(0.85, 0.85, 0.85);
    drone.traverse((child) => { if (child.isMesh) child.castShadow = true; });
    drone.userData = {
      isInteractive: true,
      tag: "SCENE 3 — MODEL GLTF",
      title: "Buster Drone Sci-Fi",
      desc: "Drone otonom multi-fungsi berkemampuan navigasi cepat untuk pengawasan zona kota.",
      onClick: () => {
        let startT = performance.now();
        function spin() {
          let p = (performance.now() - startT) / 1000;
          drone.rotation.y = p * Math.PI * 2;
          if (p < 1) requestAnimationFrame(spin);
        }
        spin();
      }
    };
    setBusterDrone(drone);
    room3CGroup.add(drone);
    interactiveObjects.push(drone);
  });

  // 4. Model GLTF: Menara & Gedung Sci-Fi (Display Height Harmonized ~2.2m)
  gltfLoader.load('./assets/models/free_scifi_towers_in_2_colors.glb', (gltf) => {
    const towers = gltf.scene;
    towers.position.set(6.0, 0.4, -2.0);
    towers.scale.set(0.065, 0.065, 0.065);
    towers.traverse((child) => { if (child.isMesh) child.castShadow = true; });
    towers.userData = {
      isInteractive: true,
      tag: "SCENE 3 — MODEL GLTF",
      title: "Menara & Gedung Sci-Fi (Free Sci-Fi Towers)",
      desc: "Struktur arsitektur pencakar langit bermaterial futuristik dua variasi warna neon.",
      onClick: () => {
        let startT = performance.now();
        function spin() {
          let p = (performance.now() - startT) / 1000;
          towers.rotation.y = p * Math.PI * 2;
          if (p < 1) requestAnimationFrame(spin);
        }
        spin();
      }
    };
    setScifiTowers(towers);
    room3CGroup.add(towers);
    interactiveObjects.push(towers);
  });

  // Portal 3C Return
  createBlackHolePortal(
    room3CGroup,
    0, 2.0, 10.0,
    "🌌 KEMBALI KE BILIK 3 HUB",
    "PORTAL KEMBALI — BILIK KHUSUS 3C",
    "Masuk ke Black Hole ini untuk kembali ke Bilik 3 Cyberpunk Hub!",
    0xFFD700,
    () => {
      // Return to Hub: spawn at (28.5, 5.5) in front of Portal 3 (at x=31, z=5.5), facing -Math.PI/2 (into Hub, away from portal)
      teleportPlayer(28.5, 5.5, -Math.PI / 2);
      showHUDCard("BILIK 3 — CYBERPUNK HUB", "Bilik 3 — Cyberpunk VR Hub", "Kembali ke Hub Cyberpunk VR. Portal eksibisi berada di belakang Anda.");
    }
  );

  cyberpunkGroup.add(room3CGroup);

  scene.add(cyberpunkGroup);
}

export function updateCyberpunkAnimations(t) {
  if (typeof flyingCar !== 'undefined' && flyingCar) flyingCar.position.y = 1.3 + Math.sin(t * 1.5) * 0.12;
  if (typeof busterDrone !== 'undefined' && busterDrone) {
    busterDrone.position.y = 1.3 + Math.cos(t * 2.0) * 0.12;
    busterDrone.rotation.y += 0.008;
  }
  if (scifiTowers) {
    scifiTowers.rotation.y = Math.sin(t * 0.2) * 0.15;
  }

  if (primBox) {
    primBox.rotation.y = t * 1.2;
    primBox.rotation.x = t * 0.6;
    const pulseScale = 1.0 + Math.sin(t * 3) * 0.15;
    primBox.scale.set(pulseScale, pulseScale, pulseScale);
  }
  if (primSphere) {
    primSphere.position.x = -1.5 + Math.sin(t * 1.8) * 0.8;
  }
  if (primCone) {
    primCone.rotation.y = t * 1.5;
  }
}
