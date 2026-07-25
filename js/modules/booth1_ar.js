import * as THREE from 'three';
import { GLTFLoader } from '../jsm/loaders/GLTFLoader.js';
import {
  scene, interactiveObjects, arElementsGroup, setArElementsGroup,
  arScanTimer, setArScanTimer, isARScanned, setIsARScanned
} from './state.js';
import { showHUDCard } from './interactivity.js';

export function createNeonPillar(group, x, y, z, colorHex) {
  const pillarGeo = new THREE.CylinderGeometry(0.18, 0.22, 8, 16);
  const pillarMat = new THREE.MeshBasicMaterial({ color: colorHex });
  const pillar = new THREE.Mesh(pillarGeo, pillarMat);
  pillar.position.set(x, 4, z);
  group.add(pillar);
  const pillarLight = new THREE.PointLight(colorHex, 1.0, 12);
  pillarLight.position.set(x, 8.2, z);
  group.add(pillarLight);
}

export function triggerARCardScan(isFound) {
  if (!arElementsGroup) return;
  clearTimeout(arScanTimer);

  if (isFound) {
    if (isARScanned) return;
    setIsARScanned(true);
    arElementsGroup.visible = true;
    showHUDCard("AR CARD - MARKER FOUND", "🟢 MARKER TERDETEKSI!", "Tampilan AR 3D Syafrizal Amri Fajar berhasil dipindai dan dimunculkan melayang di atas kartu nama.");

    let startTime = performance.now();
    function animateReveal() {
      let elapsed = performance.now() - startTime;
      let progress = Math.min(1, elapsed / 800);
      let easeProgress = 1 - Math.pow(1 - progress, 3);
      arElementsGroup.scale.set(easeProgress, easeProgress, easeProgress);

      if (progress < 1) {
        requestAnimationFrame(animateReveal);
      }
    }
    animateReveal();
  } else {
    setIsARScanned(false);
    showHUDCard("AR CARD - MARKER LOST", "🔴 MENCARI MARKER...", "Kursor dijauhkan dari kartu nama. Elemen AR 3D tersembunyi kembali.");

    let startTime = performance.now();
    function animateHide() {
      let elapsed = performance.now() - startTime;
      let progress = Math.min(1, elapsed / 400);
      let scaleVal = 1 - progress;
      arElementsGroup.scale.set(scaleVal, scaleVal, scaleVal);

      if (progress < 1) {
        requestAnimationFrame(animateHide);
      } else {
        arElementsGroup.visible = false;
      }
    }
    animateHide();
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

  createNeonPillar(boothGroup, -8.5, 0, -8.5, 0xC41E1E);
  createNeonPillar(boothGroup, 8.5, 0, -8.5, 0xC8A97A);
  createNeonPillar(boothGroup, -8.5, 0, 8.5, 0xC8A97A);
  createNeonPillar(boothGroup, 8.5, 0, 8.5, 0xC41E1E);

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
  columnLight.userData.animate = (time) => {
    columnLight.intensity = 2.5 + Math.sin(time * 1.5) * 0.6;
  };

  textureLoader.load('./assets/ar-card/kartu.png', (texture) => {
    const cardMat = new THREE.MeshStandardMaterial({ color: 0xfafafa, roughness: 0.15 });
    const cardFaceMat = new THREE.MeshBasicMaterial({ map: texture });
    const physicalCard = new THREE.Mesh(
      new THREE.BoxGeometry(3.4, 2.0, 0.06),
      [cardMat, cardMat, cardMat, cardMat, cardFaceMat, cardMat]
    );
    physicalCard.position.set(0, 2.8, 0);
    physicalCard.castShadow = true;

    physicalCard.userData.animate = (time) => {
      physicalCard.position.y = 2.8 + Math.sin(time * 1.1) * 0.18;
    };

    const scanLineMat = new THREE.MeshBasicMaterial({ color: 0x00FF88, transparent: true, opacity: 0.9 });
    const scanLine = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 0.06), scanLineMat);
    scanLine.position.set(0, 0, 0.04);
    physicalCard.add(scanLine);
    scanLine.userData.animate = (time) => {
      scanLine.position.y = Math.sin(time * 3.8) * 0.88;
    };

    physicalCard.userData = {
      isInteractive: true,
      tag: "AR CARD — MARKER TARGET (kartu.png)",
      title: "Kartu Nama AR — Syafrizal Amri Fajar",
      desc: "Arahkan kursor ke kartu ini untuk memindai Marker AR. Elemen profil 3D akan bermunculan melayang!",
      onHover: () => triggerARCardScan(true),
      onUnhover: () => scheduleARCardHide(),
      onClick: () => triggerARCardScan(true)
    };
    interactiveObjects.push(physicalCard);

    const spot = new THREE.SpotLight(0xFFFFCC, 5, 18, Math.PI / 7, 0.4);
    spot.position.set(0, 6, 6);
    spot.target = physicalCard;
    boothGroup.add(spot);
    boothGroup.add(spot.target);
  });

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
  const bannerMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(4.5, 0.65),
    new THREE.MeshBasicMaterial({ map: bannerTex, transparent: true, side: THREE.DoubleSide })
  );
  bannerMesh.position.set(0, 4.7, 0);
  boothGroup.add(bannerMesh);
  bannerMesh.userData.animate = (time) => {
    bannerMesh.position.y = 4.7 + Math.sin(time * 1.1) * 0.18;
  };

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

  const arGroup = new THREE.Group();
  arGroup.position.set(0, 2.8, 0);
  arGroup.scale.set(0, 0, 0);
  arGroup.visible = false;
  setArElementsGroup(arGroup);
  boothGroup.add(arGroup);

  let owlMixer = null;
  const gltfLoader = new GLTFLoader();
  gltfLoader.load('./assets/ar-card/owl.glb', (gltf) => {
    const owlModel = gltf.scene;
    owlModel.position.set(-3.8, 0.2, 0);
    owlModel.scale.set(0.7, 0.7, 0.7);
    owlModel.rotation.y = 0;
    owlModel.traverse((c) => { if (c.isMesh) c.castShadow = true; });

    if (gltf.animations && gltf.animations.length > 0) {
      owlMixer = new THREE.AnimationMixer(owlModel);
      gltf.animations.forEach((clip) => {
        owlMixer.clipAction(clip).play();
      });
    }

    owlModel.userData = {
      isInteractive: true,
      tag: "AR CARD — MASKOT OWL 3D",
      title: "Owl 3D Mascot",
      desc: "Maskot Burung Hantu 3D beranimasi yang menyambut setiap pengunjung Bilik AR Card."
    };
    arGroup.add(owlModel);
    interactiveObjects.push(owlModel);
    owlModel.userData.animate = (time) => {
      owlModel.position.y = 0.2 + Math.sin(time * 2.2) * 0.15;
      owlModel.rotation.y = Math.sin(time * 0.8) * 0.2;
      if (owlMixer) owlMixer.update(0.016);
    };
  });

  textureLoader.load('./assets/ar-card/website.png', (texture) => {
    const webPanel = new THREE.Mesh(
      new THREE.PlaneGeometry(3.0, 1.8),
      new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide })
    );
    webPanel.position.set(3.8, 0.2, 0);
    webPanel.userData = {
      isInteractive: true,
      tag: "AR CARD — PORTFOLIO WEBSITE",
      title: "syzaf.dev — Portfolio",
      desc: "Pratinjau situs portofolio Syafrizal Amri Fajar. Klik untuk membuka syzaf.dev!",
      onClick: () => window.open('https://syzaf.dev', '_blank')
    };
    arGroup.add(webPanel);
    interactiveObjects.push(webPanel);
    webPanel.userData.animate = (time) => {
      webPanel.position.y = 0.2 + Math.cos(time * 1.8) * 0.12;
    };
  });

  const socialButtons = [
    { name: "Website",   color: 0xdddddd, x: -2.5, url: "https://syzaf.dev",                                       tag: "syzaf.dev",              icon: null },
    { name: "Instagram", color: 0xE1306C, x: -1.5, url: "https://instagram.com/syzaf.id",                           tag: "@syzaf.id",               icon: null },
    { name: "WhatsApp",  color: 0x25D366, x: -0.5, url: "https://wa.me/6285767973635",                              tag: "+62 857-6797-3635",       icon: "./assets/ar-card/whatsapp.png" },
    { name: "LinkedIn",  color: 0x0077B5, x:  0.5, url: "https://linkedin.com/in/syafrizal-amri-fajar-a839b127a/", tag: "Syafrizal Amri Fajar",    icon: "./assets/ar-card/linkedin.png" },
    { name: "GitHub",    color: 0xffffff, x:  1.5, url: "https://github.com/syzafid",                               tag: "@syzafid",                icon: "./assets/ar-card/github.png" },
    { name: "Email",     color: 0xEA4335, x:  2.5, url: "mailto:syafrizalaf93@gmail.com",                           tag: "syafrizalaf93@gmail.com", icon: "./assets/ar-card/email.png" },
  ];

  socialButtons.forEach((btn) => {
    const btnMat = new THREE.MeshStandardMaterial({ color: btn.color, roughness: 0.12, metalness: 0.75 });
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
      tag: `AR CARD — ${btn.name.toUpperCase()}`,
      title: btn.name,
      desc: `${btn.name} Syafrizal Amri Fajar (${btn.tag}). Klik untuk membuka!`,
      onHover: () => btnMesh.scale.set(1.25, 1.25, 1.25),
      onUnhover: () => btnMesh.scale.set(1, 1, 1),
      onClick: () => {
        if (btn.url.startsWith('mailto:')) window.location.href = btn.url;
        else window.open(btn.url, '_blank');
      }
    };

    arGroup.add(btnMesh);
    interactiveObjects.push(btnMesh);
  });

  scene.add(boothGroup);
}
