import * as THREE from 'three';
import { GLTFLoader } from 'https://unpkg.com/three@0.152.2/examples/jsm/loaders/GLTFLoader.js';
import {
  scene, interactiveObjects, arElementsGroup, setArElementsGroup,
  arScanTimer, setArScanTimer, isARScanned, setIsARScanned
} from './state.js';
import { showHUDCard } from './interactivity.js';

// Module state for smooth 60fps spring animations
let targetArScale = 0;
let currentArScale = 0;
let physicalCardMesh = null;
let scanLineMesh = null;
let bannerMesh = null;
let hologramRingMesh = null;
let hologramRingMat = null;
let owlMixer = null;
let owlModelMesh = null;
let webPanelMesh = null;
const socialBtnMeshes = [];
const neonLights = [];

export function createNeonPillar(group, x, y, z, colorHex, phaseOffset = 0) {
  const pillarGeo = new THREE.CylinderGeometry(0.18, 0.22, 8, 16);
  const pillarMat = new THREE.MeshBasicMaterial({ color: colorHex });
  const pillar = new THREE.Mesh(pillarGeo, pillarMat);
  pillar.position.set(x, 4, z);
  group.add(pillar);

  const pillarLight = new THREE.PointLight(colorHex, 1.2, 14);
  pillarLight.position.set(x, 8.2, z);
  pillarLight.userData = { phaseOffset };
  group.add(pillarLight);
  neonLights.push(pillarLight);
}

export function triggerARCardScan(isFound) {
  if (!arElementsGroup) return;
  clearTimeout(arScanTimer);

  if (isFound) {
    targetArScale = 1.0;
    arElementsGroup.visible = true;
    if (!isARScanned) {
      setIsARScanned(true);
      showHUDCard("AR CARD - MARKER FOUND", "🟢 MARKER TERDETEKSI!", "Tampilan AR 3D Syafrizal Amri Fajar berhasil dipindai & dimunculkan melayang secara interaktif!");
    }
  } else {
    targetArScale = 0.0;
    if (isARScanned) {
      setIsARScanned(false);
      showHUDCard("AR CARD - MARKER LOST", "🔴 MENCARI MARKER...", "Kursor dijauhkan dari kartu nama. Elemen AR 3D tersembunyi kembali.");
    }
  }
}

export function scheduleARCardHide() {
  const timer = setTimeout(() => {
    triggerARCardScan(false);
  }, 4000);
  setArScanTimer(timer);
}

export function createHotspot(group, x, y, z, colorHex, tagText, titleText, descText) {
  const hotspotGeo = new THREE.SphereGeometry(0.4, 32, 32);
  const hotspotMat = new THREE.MeshStandardMaterial({
    color: colorHex,
    emissive: colorHex,
    emissiveIntensity: 0.6,
    roughness: 0.2
  });
  const hotspot = new THREE.Mesh(hotspotGeo, hotspotMat);
  hotspot.position.set(x, y, z);
  hotspot.castShadow = true;

  const pulseGeo = new THREE.RingGeometry(0.5, 0.65, 32);
  const pulseMat = new THREE.MeshBasicMaterial({ color: colorHex, side: THREE.DoubleSide, transparent: true, opacity: 0.8 });
  const pulseRing = new THREE.Mesh(pulseGeo, pulseMat);
  pulseRing.rotation.x = Math.PI / 2;
  hotspot.add(pulseRing);

  hotspot.userData = {
    isInteractive: true,
    tag: tagText,
    title: titleText,
    desc: descText,
    onHover: () => {
      hotspot.scale.set(1.3, 1.3, 1.3);
      hotspotMat.emissiveIntensity = 1.0;
    },
    onUnhover: () => {
      hotspot.scale.set(1, 1, 1);
      hotspotMat.emissiveIntensity = 0.6;
    }
  };

  group.add(hotspot);
  interactiveObjects.push(hotspot);
}

export function buildARCardBooth() {
  const boothGroup = new THREE.Group();
  boothGroup.position.set(-25, 0, 0);
  boothGroup.rotation.y = Math.PI / 2;

  const textureLoader = new THREE.TextureLoader();
  const rimMat = new THREE.MeshBasicMaterial({ color: 0xC8A97A });

  // Neon Pillars
  createNeonPillar(boothGroup, -8.5, 0, -8.5, 0xC41E1E, 0);
  createNeonPillar(boothGroup, 8.5, 0, -8.5, 0xC8A97A, 1.5);
  createNeonPillar(boothGroup, -8.5, 0, 8.5, 0xC8A97A, 3.0);
  createNeonPillar(boothGroup, 8.5, 0, 8.5, 0xC41E1E, 4.5);

  // Pedestal Architecture
  const floorRingOuter = new THREE.Mesh(new THREE.TorusGeometry(2.2, 0.05, 8, 64), rimMat);
  floorRingOuter.rotation.x = -Math.PI / 2;
  floorRingOuter.position.set(0, 0.03, 0);
  boothGroup.add(floorRingOuter);

  const pedestalMat = new THREE.MeshStandardMaterial({ color: 0x130808, roughness: 0.12, metalness: 0.98 });

  const baseMesh = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.7, 0.28, 32), pedestalMat);
  baseMesh.position.set(0, 0.14, 0);
  boothGroup.add(baseMesh);
  const baseRim = new THREE.Mesh(new THREE.TorusGeometry(1.4, 0.045, 16, 64), rimMat);
  baseRim.rotation.x = Math.PI / 2;
  baseRim.position.set(0, 0.28, 0);
  boothGroup.add(baseRim);

  const column = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.35, 0.9, 32), pedestalMat);
  column.position.set(0, 0.73, 0);
  column.castShadow = true;
  boothGroup.add(column);

  const capMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.2, 0.1, 32), pedestalMat);
  capMesh.position.set(0, 1.23, 0);
  boothGroup.add(capMesh);
  const capRim = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.035, 16, 32), rimMat);
  capRim.rotation.x = Math.PI / 2;
  capRim.position.set(0, 1.28, 0);
  boothGroup.add(capRim);

  const columnLight = new THREE.PointLight(0xC8A97A, 3, 12);
  columnLight.position.set(0, 4, 0);
  boothGroup.add(columnLight);

  // 🎴 Physical AR Marker Card
  textureLoader.load('./assets/ar-card/kartu.png', (texture) => {
    const cardMat = new THREE.MeshStandardMaterial({ color: 0xfafafa, roughness: 0.15 });
    const cardFaceMat = new THREE.MeshBasicMaterial({ map: texture });
    physicalCardMesh = new THREE.Mesh(
      new THREE.BoxGeometry(3.4, 2.0, 0.06),
      [cardMat, cardMat, cardMat, cardMat, cardFaceMat, cardMat]
    );
    physicalCardMesh.position.set(0, 2.8, 0);
    physicalCardMesh.castShadow = true;

    // Glowing Laser Scan Line
    const scanLineMat = new THREE.MeshBasicMaterial({ color: 0x00FF88, transparent: true, opacity: 0.9 });
    scanLineMesh = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 0.06), scanLineMat);
    scanLineMesh.position.set(0, 0, 0.04);
    physicalCardMesh.add(scanLineMesh);

    physicalCardMesh.userData = {
      isInteractive: true,
      tag: "AR CARD — MARKER TARGET (kartu.png)",
      title: "Kartu Nama AR — Syafrizal Amri Fajar",
      desc: "Arahkan kursor / tatap kartu ini untuk memindai Marker AR. Elemen profil 3D akan bermunculan melayang!",
      onHover: () => triggerARCardScan(true),
      onUnhover: () => scheduleARCardHide(),
      onClick: () => triggerARCardScan(true)
    };
    boothGroup.add(physicalCardMesh);
    interactiveObjects.push(physicalCardMesh);

    const spot = new THREE.SpotLight(0xFFFFCC, 5, 18, Math.PI / 7, 0.4);
    spot.position.set(0, 6, 6);
    spot.target = physicalCardMesh;
    boothGroup.add(spot);
    boothGroup.add(spot.target);
  });

  // Banner Header
  const bannerCanvas = document.createElement('canvas');
  bannerCanvas.width = 512; bannerCanvas.height = 80;
  const bCtx = bannerCanvas.getContext('2d');
  bCtx.clearRect(0, 0, 512, 80);
  bCtx.fillStyle = '#C8A97A';
  bCtx.font = 'bold 30px Outfit, sans-serif';
  bCtx.textAlign = 'center';
  bCtx.textBaseline = 'middle';
  bCtx.fillText('✦  SYAFRIZAL AMRI FAJAR  ✦', 256, 40);
  const bannerTex = new THREE.CanvasTexture(bannerCanvas);
  bannerMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(4.5, 0.65),
    new THREE.MeshBasicMaterial({ map: bannerTex, transparent: true, side: THREE.DoubleSide })
  );
  bannerMesh.position.set(0, 4.7, 0);
  boothGroup.add(bannerMesh);

  // Instruction Sign
  const signCanvas = document.createElement('canvas');
  signCanvas.width = 512; signCanvas.height = 112;
  const sCtx = signCanvas.getContext('2d');
  sCtx.fillStyle = '#120606';
  sCtx.fillRect(0, 0, 512, 112);
  sCtx.lineWidth = 5;
  sCtx.strokeStyle = '#C8A97A';
  sCtx.strokeRect(5, 5, 502, 102);
  sCtx.fillStyle = '#C8A97A';
  sCtx.font = 'bold 22px Outfit, sans-serif';
  sCtx.textAlign = 'center';
  sCtx.textBaseline = 'middle';
  sCtx.fillText('📷  ARAHKAN KURSOR KE KARTU UNTUK SCAN', 256, 56);
  const signTex = new THREE.CanvasTexture(signCanvas);
  const arSignMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(3.8, 0.88),
    new THREE.MeshBasicMaterial({ map: signTex })
  );
  arSignMesh.position.set(0, 0.75, 3.2);
  arSignMesh.rotation.set(-Math.PI / 10, 0, 0);
  boothGroup.add(arSignMesh);

  // 🌟 AR Holographic Elements Group
  const arGroup = new THREE.Group();
  arGroup.position.set(0, 2.8, 0);
  arGroup.scale.set(0, 0, 0);
  arGroup.visible = false;
  setArElementsGroup(arGroup);
  boothGroup.add(arGroup);

  // Hologram Base Ring Floor Grid
  const holoGeo = new THREE.RingGeometry(0.8, 4.2, 64);
  hologramRingMat = new THREE.MeshBasicMaterial({ color: 0x00E5FF, side: THREE.DoubleSide, transparent: true, opacity: 0.6 });
  hologramRingMesh = new THREE.Mesh(holoGeo, hologramRingMat);
  hologramRingMesh.rotation.x = -Math.PI / 2;
  hologramRingMesh.position.set(0, -1.2, 0);
  arGroup.add(hologramRingMesh);

  // 1️⃣ Owl 3D Mascot Model (GLTF)
  const gltfLoader = new GLTFLoader();
  gltfLoader.load('./assets/ar-card/owl.glb', (gltf) => {
    owlModelMesh = gltf.scene;
    owlModelMesh.position.set(-3.8, 0.2, 0);
    owlModelMesh.scale.set(0.7, 0.7, 0.7);
    owlModelMesh.traverse((c) => { if (c.isMesh) c.castShadow = true; });

    if (gltf.animations && gltf.animations.length > 0) {
      owlMixer = new THREE.AnimationMixer(owlModelMesh);
      gltf.animations.forEach((clip) => {
        owlMixer.clipAction(clip).play();
      });
    }

    owlModelMesh.userData = {
      isInteractive: true,
      tag: "AR CARD — SPIRIT ANIMAL",
      title: "Owl 3D (Spirit Animal)",
      desc: "Maskot Burung Hantu 3D ini merupakan spirit animal Syafrizal Amri Fajar, melambangkan kebijaksanaan, fokus, dan ketekunan belajar di dunia teknologi."
    };
    arGroup.add(owlModelMesh);
    interactiveObjects.push(owlModelMesh);
  }, undefined, (err) => console.warn("Owl model notice:", err));

  // 2️⃣ Portfolio Website Preview Panel
  textureLoader.load('./assets/ar-card/website.png', (texture) => {
    webPanelMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(3.0, 1.8),
      new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide })
    );
    webPanelMesh.position.set(3.8, 0.2, 0);
    webPanelMesh.userData = {
      isInteractive: true,
      tag: "AR CARD — PORTFOLIO WEBSITE",
      title: "syzaf.dev — Portfolio",
      desc: "Pratinjau situs portofolio Syafrizal Amri Fajar. Klik untuk membuka syzaf.dev!",
      onClick: () => window.open('https://syzaf.dev', '_blank')
    };
    arGroup.add(webPanelMesh);
    interactiveObjects.push(webPanelMesh);
  });

  // 3️⃣ Social Media Hologram Interactive Buttons
  const socialButtons = [
    { name: "Website",   color: 0xdddddd, x: -2.5, url: "https://syzaf.dev",                                       tag: "syzaf.dev",              icon: null },
    { name: "Instagram", color: 0xE1306C, x: -1.5, url: "https://instagram.com/syzaf.id",                           tag: "@syzaf.id",               icon: null },
    { name: "WhatsApp",  color: 0x25D366, x: -0.5, url: "https://wa.me/6285767973635",                              tag: "+62 857-6797-3635",       icon: "./assets/ar-card/whatsapp.png" },
    { name: "LinkedIn",  color: 0x0077B5, x:  0.5, url: "https://linkedin.com/in/syafrizal-amri-fajar-a839b127a/", tag: "Syafrizal Amri Fajar",    icon: "./assets/ar-card/linkedin.png" },
    { name: "GitHub",    color: 0xffffff, x:  1.5, url: "https://github.com/syzafid",                               tag: "@syzafid",                icon: "./assets/ar-card/github.png" },
    { name: "Email",     color: 0xEA4335, x:  2.5, url: "mailto:syafrizalaf93@gmail.com",                           tag: "syafrizalaf93@gmail.com", icon: "./assets/ar-card/email.png" },
  ];

  socialButtons.forEach((btn, idx) => {
    const btnMat = new THREE.MeshStandardMaterial({ color: btn.color, roughness: 0.12, metalness: 0.75, emissive: btn.color, emissiveIntensity: 0.1 });
    const btnMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.12, 32), btnMat);
    btnMesh.position.set(btn.x, -1.5, 1.8);
    btnMesh.rotation.x = Math.PI / 2;
    btnMesh.castShadow = true;

    if (btn.icon) {
      textureLoader.load(btn.icon, (tex) => {
        const iconMesh = new THREE.Mesh(
          new THREE.PlaneGeometry(0.38, 0.38),
          new THREE.MeshBasicMaterial({ map: tex, transparent: true })
        );
        iconMesh.position.set(0, 0.07, 0);
        iconMesh.rotation.x = -Math.PI / 2;
        btnMesh.add(iconMesh);
      });
    }

    btnMesh.userData = {
      isInteractive: true,
      index: idx,
      baseX: btn.x,
      baseY: -1.5,
      targetScale: 1.0,
      tag: `AR CARD — ${btn.name.toUpperCase()}`,
      title: btn.name,
      desc: `${btn.name} Syafrizal Amri Fajar (${btn.tag}). Klik untuk membuka link!`,
      onHover: () => {
        btnMesh.userData.targetScale = 1.35;
        btnMat.emissiveIntensity = 0.5;
      },
      onUnhover: () => {
        btnMesh.userData.targetScale = 1.0;
        btnMat.emissiveIntensity = 0.1;
      },
      onClick: () => {
        if (btn.url.startsWith('mailto:')) window.location.href = btn.url;
        else window.open(btn.url, '_blank');
      }
    };

    arGroup.add(btnMesh);
    interactiveObjects.push(btnMesh);
    socialBtnMeshes.push(btnMesh);
  });

  scene.add(boothGroup);
}

/**
 * High-Performance Animation Loop for AR Card Booth
 * Handles smooth 60fps spring transitions, floating bobbing, mixer playback, and laser scan
 */
export function updateARCardAnimations(elapsedTime, deltaTime) {
  // 1. Smooth Spring Lerp for AR Hologram Group Scale
  currentArScale += (targetArScale - currentArScale) * Math.min(1.0, deltaTime * 8.0);
  if (arElementsGroup) {
    arElementsGroup.scale.set(currentArScale, currentArScale, currentArScale);
    arElementsGroup.visible = currentArScale > 0.005;
    arElementsGroup.rotation.y = Math.sin(elapsedTime * 0.4) * 0.08;
  }

  // 2. Hologram Base Disc Rotation & Opacity Pulse
  if (hologramRingMesh) {
    hologramRingMesh.rotation.z = elapsedTime * 0.5;
  }
  if (hologramRingMat) {
    hologramRingMat.opacity = Math.max(0, (0.5 + Math.sin(elapsedTime * 3.0) * 0.2) * currentArScale);
  }

  // 3. Physical AR Marker Card Floating & Tilting
  if (physicalCardMesh) {
    physicalCardMesh.position.y = 2.8 + Math.sin(elapsedTime * 1.5) * 0.15;
    physicalCardMesh.rotation.x = Math.sin(elapsedTime * 1.0) * 0.04;
    physicalCardMesh.rotation.z = Math.cos(elapsedTime * 1.2) * 0.04;
  }

  // 4. Laser Scan Line Animation
  if (scanLineMesh) {
    scanLineMesh.position.y = Math.sin(elapsedTime * 3.8) * 0.85;
  }

  // 5. Header Banner Float
  if (bannerMesh) {
    bannerMesh.position.y = 4.7 + Math.sin(elapsedTime * 1.5) * 0.15;
  }

  // 6. Owl 3D Mascot Model Mixer & Floating
  if (owlMixer) {
    owlMixer.update(deltaTime);
  }
  if (owlModelMesh) {
    owlModelMesh.position.y = 0.2 + Math.sin(elapsedTime * 2.2) * 0.14;
    owlModelMesh.rotation.y = Math.sin(elapsedTime * 0.8) * 0.25;
  }

  // 7. Portfolio Website Preview Panel Floating
  if (webPanelMesh) {
    webPanelMesh.position.y = 0.2 + Math.cos(elapsedTime * 1.8) * 0.12;
    webPanelMesh.rotation.y = Math.sin(elapsedTime * 0.6) * 0.1;
  }

  // 8. Social Buttons Wave Floating & Smooth Hover Scaling
  for (let i = 0; i < socialBtnMeshes.length; i++) {
    const btn = socialBtnMeshes[i];
    const data = btn.userData;
    if (data) {
      // Wave floating phase offset per button
      btn.position.y = data.baseY + Math.sin(elapsedTime * 2.5 + data.index * 0.6) * 0.08;
      // Smooth scale interpolation towards hover target
      const curS = btn.scale.x;
      const targetS = data.targetScale || 1.0;
      const nextS = curS + (targetS - curS) * Math.min(1.0, deltaTime * 12.0);
      btn.scale.set(nextS, nextS, nextS);
    }
  }

  // 9. Neon Pillars Light Intensity Pulse
  for (let i = 0; i < neonLights.length; i++) {
    const light = neonLights[i];
    const offset = light.userData ? light.userData.phaseOffset : 0;
    light.intensity = 1.0 + Math.sin(elapsedTime * 2.0 + offset) * 0.4;
  }
}
