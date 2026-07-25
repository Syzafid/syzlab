import * as THREE from 'three';
import { scene, worldOctree, animatedObjects, registerAnimation } from './state.js';
import { buildParkourPlatforms } from './parkour.js';

export function createSubWorldHeader(parent, titleText, accentHex, px, py, pz) {
  const canvas = document.createElement('canvas');
  canvas.width = 1024; canvas.height = 128;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = 'rgba(10, 15, 30, 0.9)';
  ctx.fillRect(0, 0, 1024, 128);
  ctx.lineWidth = 6;
  ctx.strokeStyle = `#${accentHex.toString(16)}`;
  ctx.strokeRect(6, 6, 1012, 116);
  ctx.fillStyle = `#${accentHex.toString(16)}`;
  ctx.font = 'bold 36px Outfit, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(titleText, 512, 64);

  const signTex = new THREE.CanvasTexture(canvas);
  const signMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(8.0, 1.0),
    new THREE.MeshBasicMaterial({ map: signTex, transparent: true, side: THREE.DoubleSide })
  );
  signMesh.position.set(px, py, pz);
  parent.add(signMesh);
}

export function buildGalleryWorld() {
  const galleryGroup = new THREE.Group();
  const collisionGroup = new THREE.Group();

  const floorMat = new THREE.MeshStandardMaterial({
    color: 0x0a0e1a,
    roughness: 0.25,
    metalness: 0.6
  });

  const wallMat = new THREE.MeshStandardMaterial({
    color: 0x121626,
    roughness: 0.65,
    metalness: 0.35
  });

  const partitionMat = new THREE.MeshStandardMaterial({
    color: 0x161b2e,
    roughness: 0.5,
    metalness: 0.4
  });

  const pillarMat = new THREE.MeshStandardMaterial({
    color: 0x1d2238,
    roughness: 0.3,
    metalness: 0.8
  });

  const neonMatGold = new THREE.MeshBasicMaterial({ color: 0xC8A97A });
  const neonMatCyan = new THREE.MeshBasicMaterial({ color: 0x00CED1 });
  const neonMatPurple = new THREE.MeshBasicMaterial({ color: 0x9370DB });

  // ── FLOORS ─────────────────────────────────────────────────────────────────
  // Main Lobby Floor (40x40): x = -20 to 20, z = -20 to 20
  const mainFloor = new THREE.Mesh(new THREE.BoxGeometry(40, 0.4, 40), floorMat);
  mainFloor.position.set(0, -0.2, 0);
  mainFloor.receiveShadow = true;
  galleryGroup.add(mainFloor);
  collisionGroup.add(mainFloor.clone());

  // Bilik 1 Floor (AR Card): 20x20 at x=-25
  const room1Floor = new THREE.Mesh(new THREE.BoxGeometry(20, 0.4, 20), floorMat);
  room1Floor.position.set(-25, -0.2, 0);
  room1Floor.receiveShadow = true;
  galleryGroup.add(room1Floor);
  collisionGroup.add(room1Floor.clone());

  // Bilik 2 Floor (Space Observatory Megastructure 3X): 60x60 centered at z=-50 (x = -30 to 30, z = -80 to -20)
  const room2Floor = new THREE.Mesh(new THREE.BoxGeometry(60, 0.4, 60), floorMat);
  room2Floor.position.set(0, -0.2, -50);
  room2Floor.receiveShadow = true;
  galleryGroup.add(room2Floor);
  collisionGroup.add(room2Floor.clone());

  // Bilik 3 Floor (Cyberpunk VR): 20x20 at x=25
  const room3Floor = new THREE.Mesh(new THREE.BoxGeometry(20, 0.4, 20), floorMat);
  room3Floor.position.set(25, -0.2, 0);
  room3Floor.receiveShadow = true;
  galleryGroup.add(room3Floor);
  collisionGroup.add(room3Floor.clone());

  // Bilik Khusus 3A Floor (Scene 1: Primitif VR Arena): 25x25 at x=25, z=60
  const room3Sub1Floor = new THREE.Mesh(new THREE.BoxGeometry(25, 0.4, 25), floorMat);
  room3Sub1Floor.position.set(25, -0.2, 60);
  room3Sub1Floor.receiveShadow = true;
  galleryGroup.add(room3Sub1Floor);
  collisionGroup.add(room3Sub1Floor.clone());

  // Bilik Khusus 3C Floor (Scene 3: GLTF Showroom Hall): 25x25 at x=65, z=0 (Relokasi ke x=65 untuk ZERO OVERLAP)
  const room3Sub3Floor = new THREE.Mesh(new THREE.BoxGeometry(25, 0.4, 25), floorMat);
  room3Sub3Floor.position.set(65, -0.2, 0);
  room3Sub3Floor.receiveShadow = true;
  galleryGroup.add(room3Sub3Floor);
  collisionGroup.add(room3Sub3Floor.clone());

  function addWall(x, y, z, w, h, d, mat = wallMat) {
    const wall = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    wall.position.set(x, y, z);
    wall.castShadow = true;
    wall.receiveShadow = true;
    galleryGroup.add(wall);
    collisionGroup.add(wall.clone());
  }

  // ── DINDING OUTSIDE BOUNDARIES & PARTITIONS (100% GAPLESS & FLUSH) ─────────
  addWall(0, 4, 20, 40, 8, 0.4);    // South Main Wall Lobby
  addWall(-35, 4, 0, 0.4, 8, 20);  // West Far Wall (Room 1)
  addWall(35, 4, 0, 0.4, 8, 20);   // East Far Wall (Room 3)

  // Lobby South Corner Back Walls
  addWall(-20, 4, 15, 0.4, 8, 10);
  addWall(20, 4, 15, 0.4, 8, 10);

  // Sub-Booth 3A Boundary Walls (Scene 1 Arena: x=25, z=60)
  addWall(25, 4, 72.5, 25, 8, 0.4);   // South Wall
  addWall(25, 4, 47.5, 25, 8, 0.4);   // North Wall
  addWall(12.5, 4, 60, 0.4, 8, 25);   // West Wall
  addWall(37.5, 4, 60, 0.4, 8, 25);   // East Wall

  // Sub-Booth 3C Boundary Walls (Scene 3 Hall: x=65, z=0)
  addWall(65, 4, 12.5, 25, 8, 0.4);   // South Wall
  addWall(65, 4, -12.5, 25, 8, 0.4);  // North Wall
  addWall(52.5, 4, 0, 0.4, 8, 25);   // West Wall
  addWall(77.5, 4, 0, 0.4, 8, 25);   // East Wall

  // BILIK 1 Partitions (AR Card Booth)
  addWall(-25, 4, -10, 20, 8, 0.4, partitionMat);
  addWall(-25, 4, 10, 20, 8, 0.4, partitionMat);
  addWall(-15, 4, -7, 0.4, 8, 6, partitionMat);
  addWall(-15, 4, 7, 0.4, 8, 6, partitionMat);
  addWall(-15, 6.8, 0, 0.4, 2.4, 8.8, partitionMat);

  // BILIK 2 (Space Observatory Megastructure 3X: 60x60, height 24m at z=-50)
  addWall(0, 12, -80, 60, 24, 0.4);                  // North Far Wall Bilik 2
  addWall(-30, 12, -50, 0.4, 24, 60, partitionMat);  // West Wall Bilik 2
  addWall(30, 12, -50, 0.4, 24, 60, partitionMat);   // East Wall Bilik 2
  addWall(-19, 12, -20, 22, 24, 0.4, partitionMat);  // South West Partition
  addWall(19, 12, -20, 22, 24, 0.4, partitionMat);   // South East Partition
  addWall(0, 17, -20, 16, 14, 0.4, partitionMat);    // Grand Archway Header (Opening height 10m)

  // BILIK 3 Partitions (Cyberpunk Showroom)
  addWall(25, 4, -10, 20, 8, 0.4, partitionMat);
  addWall(25, 4, 10, 20, 8, 0.4, partitionMat);
  addWall(15, 4, -7, 0.4, 8, 6, partitionMat);
  addWall(15, 4, 7, 0.4, 8, 6, partitionMat);
  addWall(15, 6.8, 0, 0.4, 2.4, 8.8, partitionMat);

  // Corner Corridor Connection Walls (Perbaikan Dinding Sisi Koridor z=-20 s/d z=-10)
  addWall(-15, 4, -15, 0.4, 8, 10); // West Corridor Wall (Rapat Tertutup dari z=-20 ke z=-10)
  addWall(15, 4, -15, 0.4, 8, 10);  // East Corridor Wall (Rapat Tertutup dari z=-20 ke z=-10)
  addWall(-17.5, 4, -20, 5, 8, 0.4); // North-West Lobby Corner Wall
  addWall(17.5, 4, -20, 5, 8, 0.4);  // North-East Lobby Corner Wall

  // Column Trims
  const columnPositions = [
    { x: -15, z: -4, mat: neonMatGold }, { x: -15, z: 4, mat: neonMatGold },
    { x: -4, z: -15, mat: neonMatCyan }, { x: 4, z: -15, mat: neonMatCyan },
    { x: 15, z: -4, mat: neonMatPurple }, { x: 15, z: 4, mat: neonMatPurple },
    { x: -15, z: -10, mat: neonMatGold }, { x: -15, z: 10, mat: neonMatGold },
    { x: 15, z: -10, mat: neonMatPurple }, { x: 15, z: 10, mat: neonMatPurple },
    { x: -15, z: -20, mat: neonMatCyan }, { x: 15, z: -20, mat: neonMatCyan }
  ];

  columnPositions.forEach((col) => {
    const colMesh = new THREE.Mesh(new THREE.BoxGeometry(0.6, 8, 0.6), pillarMat);
    colMesh.position.set(col.x, 4, col.z);
    galleryGroup.add(colMesh);
    collisionGroup.add(colMesh.clone());

    const neonStrip = new THREE.Mesh(new THREE.BoxGeometry(0.12, 7.8, 0.12), col.mat);
    neonStrip.position.set(col.x, 4, col.z);
    galleryGroup.add(neonStrip);
  });

  // Light trails
  const path1 = new THREE.Mesh(new THREE.BoxGeometry(15, 0.04, 0.6), neonMatGold);
  path1.position.set(-7.5, 0.02, 0);
  galleryGroup.add(path1);

  const path2 = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.04, 25), neonMatCyan);
  path2.position.set(0, 0.02, -12.5);
  galleryGroup.add(path2);

  const path3 = new THREE.Mesh(new THREE.BoxGeometry(15, 0.04, 0.6), neonMatPurple);
  path3.position.set(7.5, 0.02, 0);
  galleryGroup.add(path3);

  registerAnimation(path1, (t) => {
    path1.scale.z = 1 + Math.sin(t * 2.5) * 0.15;
    path2.scale.x = 1 + Math.sin(t * 2.5 + 1) * 0.15;
    path3.scale.z = 1 + Math.sin(t * 2.5 + 2) * 0.15;
  });

  // Centerpiece Stage
  const centerRingOuter = new THREE.Mesh(new THREE.TorusGeometry(3.5, 0.06, 16, 64), neonMatCyan);
  centerRingOuter.rotation.x = Math.PI / 2;
  centerRingOuter.position.set(0, 0.03, 0);
  galleryGroup.add(centerRingOuter);

  const centerRingInner = new THREE.Mesh(new THREE.TorusGeometry(2.0, 0.04, 16, 64), neonMatGold);
  centerRingInner.rotation.x = Math.PI / 2;
  centerRingInner.position.set(0, 0.03, 0);
  galleryGroup.add(centerRingInner);

  registerAnimation(centerRingOuter, (t) => {
    centerRingOuter.rotation.z = t * 0.3;
    centerRingInner.rotation.z = -t * 0.4;
  });

  // Girders
  const girderMat = new THREE.MeshStandardMaterial({ color: 0x1d2238, roughness: 0.3, metalness: 0.8 });
  const beamX = new THREE.Mesh(new THREE.BoxGeometry(32, 0.3, 0.5), girderMat);
  beamX.position.set(0, 7.8, 0);
  galleryGroup.add(beamX);

  const beamZ = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.3, 32), girderMat);
  beamZ.position.set(0, 7.8, -7.5);
  galleryGroup.add(beamZ);

  const beamLightX = new THREE.Mesh(new THREE.BoxGeometry(30, 0.08, 0.12), neonMatCyan);
  beamLightX.position.set(0, 7.62, 0);
  galleryGroup.add(beamLightX);

  // Safety mega floor
  const megaFloorMat = new THREE.MeshStandardMaterial({ color: 0x050810, roughness: 0.9, metalness: 0.1 });
  const megaFloor = new THREE.Mesh(new THREE.BoxGeometry(160, 0.2, 160), megaFloorMat);
  megaFloor.position.set(0, -0.5, -10);
  megaFloor.receiveShadow = true;
  galleryGroup.add(megaFloor);
  collisionGroup.add(megaFloor.clone());

  // Ceiling panels
  const ceilingMat = new THREE.MeshStandardMaterial({
    color: 0x0d1120,
    roughness: 0.85,
    metalness: 0.25,
    side: THREE.DoubleSide
  });

  const lobbyCeiling = new THREE.Mesh(new THREE.BoxGeometry(40, 0.3, 40), ceilingMat);
  lobbyCeiling.position.set(0, 8.15, 0);
  galleryGroup.add(lobbyCeiling);

  const room1Ceil = new THREE.Mesh(new THREE.BoxGeometry(20, 0.3, 20), ceilingMat);
  room1Ceil.position.set(-25, 8.15, 0);
  galleryGroup.add(room1Ceil);

  // Room 2 Ceiling (Space Observatory Megastructure 3X: 60x60 at y=24.15, z=-50)
  const room2Ceil = new THREE.Mesh(new THREE.BoxGeometry(60, 0.3, 60), ceilingMat);
  room2Ceil.position.set(0, 24.15, -50);
  galleryGroup.add(room2Ceil);

  const room3Ceil = new THREE.Mesh(new THREE.BoxGeometry(20, 0.3, 20), ceilingMat);
  room3Ceil.position.set(25, 8.15, 0);
  galleryGroup.add(room3Ceil);

  // Chandeliers
  function buildChandelier(cx, cz, neonMat, colorHex) {
    const chandelierGroup = new THREE.Group();
    chandelierGroup.position.set(cx, 6.5, cz);

    const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.6, 8), girderMat);
    rod.position.set(0, 0.8, 0);
    chandelierGroup.add(rod);

    const hub = new THREE.Mesh(new THREE.TorusGeometry(0.8, 0.05, 8, 24), neonMat);
    hub.rotation.x = Math.PI / 2;
    chandelierGroup.add(hub);

    for (let i = 0; i < 4; i++) {
      const angle = (Math.PI / 2) * i;
      const ax = Math.cos(angle) * 1.2;
      const az = Math.sin(angle) * 1.2;

      const arm = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, 1.4), girderMat);
      arm.position.set(ax * 0.5, 0, az * 0.5);
      arm.lookAt(new THREE.Vector3(ax, 0, az));
      chandelierGroup.add(arm);

      const lampMat = new THREE.MeshBasicMaterial({ color: colorHex });
      const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), lampMat);
      lamp.position.set(ax, -0.1, az);
      chandelierGroup.add(lamp);
    }

    const chandelierLight = new THREE.PointLight(colorHex, 1.5, 15);
    chandelierLight.position.set(0, -0.3, 0);
    chandelierGroup.add(chandelierLight);

    galleryGroup.add(chandelierGroup);

    registerAnimation(chandelierGroup, (t) => {
      chandelierGroup.rotation.y = t * 0.25;
    });
  }

  buildChandelier(-8, 0, neonMatGold, 0xC8A97A);
  buildChandelier(0, -8, neonMatCyan, 0x00CED1);
  buildChandelier(8, 0, neonMatPurple, 0x9370DB);
  buildChandelier(0, 5, neonMatGold, 0xFFE8C8);

  // Sconces
  const sconceGeo = new THREE.BoxGeometry(0.4, 0.4, 0.15);
  const bulbGeo = new THREE.SphereGeometry(0.1, 6, 6);
  const sconcePositions = [
    { x: -10, z: 10, c: 0xC8A97A },
    { x: -10, z: -10, c: 0xC8A97A },
    { x: 10, z: 10, c: 0x9370DB },
    { x: 10, z: -10, c: 0x9370DB },
    { x: 0, z: -10, c: 0x00CED1 },
    { x: -10, z: 0, c: 0xC8A97A },
    { x: 10, z: 0, c: 0x9370DB },
  ];

  sconcePositions.forEach((s) => {
    const bracket = new THREE.Mesh(sconceGeo, girderMat);
    bracket.position.set(s.x, 5.5, s.z);
    galleryGroup.add(bracket);

    const bulb = new THREE.Mesh(bulbGeo, new THREE.MeshBasicMaterial({ color: s.c }));
    bulb.position.set(s.x, 5.3, s.z);
    galleryGroup.add(bulb);
  });

  const corridorLightW = new THREE.PointLight(0xC8A97A, 1.2, 22);
  corridorLightW.position.set(-10, 5, 0);
  scene.add(corridorLightW);

  const corridorLightN = new THREE.PointLight(0x00CED1, 1.2, 22);
  corridorLightN.position.set(0, 5, -10);
  scene.add(corridorLightN);

  const corridorLightE = new THREE.PointLight(0x9370DB, 1.2, 22);
  corridorLightE.position.set(10, 5, 0);
  scene.add(corridorLightE);

  // Doorway Accents
  const doorwayAccents = [
    { x: -15, z: 0, w: 0.4, d: 8, mat: neonMatGold },
    { x: 0, z: -20, w: 16, d: 0.4, mat: neonMatCyan },
    { x: 15, z: 0, w: 0.4, d: 8, mat: neonMatPurple },
  ];

  doorwayAccents.forEach((da) => {
    const accent = new THREE.Mesh(new THREE.BoxGeometry(da.w, 0.04, da.d), da.mat);
    accent.position.set(da.x, 0.03, da.z);
    galleryGroup.add(accent);
  });

  // Holo Geometry
  const holoGeo = new THREE.OctahedronGeometry(0.2, 0);
  const holoPositions = [
    { x: -5, z: 3, mat: neonMatGold },
    { x: -5, z: -3, mat: neonMatGold },
    { x: 5, z: 3, mat: neonMatPurple },
    { x: 5, z: -3, mat: neonMatPurple },
    { x: 3, z: -5, mat: neonMatCyan },
    { x: -3, z: -5, mat: neonMatCyan },
    { x: 0, z: 3, mat: neonMatCyan },
    { x: -12, z: 0, mat: neonMatGold },
    { x: 12, z: 0, mat: neonMatPurple },
  ];

  holoPositions.forEach((h, i) => {
    const holo = new THREE.Mesh(holoGeo, h.mat);
    holo.position.set(h.x, 4.5, h.z);
    galleryGroup.add(holo);
    registerAnimation(holo, (t) => {
      holo.position.y = 4.5 + Math.sin(t * 1.5 + i) * 0.4;
      holo.rotation.x = t * 1.2 + i;
      holo.rotation.z = t * 0.8 + i;
    });
  });

  // Info panels
  function createInfoPanel(text, colorHex, px, pz, rotY) {
    const canvas = document.createElement('canvas');
    canvas.width = 256; canvas.height = 128;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#080c18';
    ctx.fillRect(0, 0, 256, 128);
    ctx.strokeStyle = `#${colorHex.toString(16)}`;
    ctx.lineWidth = 3;
    ctx.strokeRect(4, 4, 248, 120);
    ctx.fillStyle = `#${colorHex.toString(16)}`;
    ctx.font = 'bold 18px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 128, 50);
    ctx.font = '13px Outfit, sans-serif';
    ctx.globalAlpha = 0.6;
    ctx.fillText('◆ METAVERSE GALLERY ◆', 128, 90);

    const tex = new THREE.CanvasTexture(canvas);
    const panelMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(2.5, 1.25),
      new THREE.MeshBasicMaterial({ map: tex, transparent: true })
    );
    panelMesh.position.set(px, 4, pz);
    panelMesh.rotation.y = rotY;
    galleryGroup.add(panelMesh);
  }

  createInfoPanel('◁ AR CARD BOOTH', 0xC8A97A, -12, 6, 0);
  createInfoPanel('◁ AR CARD BOOTH', 0xC8A97A, -12, -6, 0);
  createInfoPanel('SPACE OBSERVATORY ▽', 0x00CED1, -6, -12, Math.PI / 2);
  createInfoPanel('SPACE OBSERVATORY ▽', 0x00CED1, 6, -12, Math.PI / 2);
  createInfoPanel('CYBERPUNK VR ▷', 0x9370DB, 12, 6, Math.PI);
  createInfoPanel('CYBERPUNK VR ▷', 0x9370DB, 12, -6, Math.PI);

  // Benches
  const benchGeo = new THREE.BoxGeometry(3, 0.3, 0.8);
  const benchLegGeo = new THREE.BoxGeometry(0.15, 0.5, 0.6);
  const benchMat = new THREE.MeshStandardMaterial({ color: 0x1a1f35, roughness: 0.4, metalness: 0.7 });

  function createBench(bx, bz, rotY) {
    const benchGroup = new THREE.Group();
    const seat = new THREE.Mesh(benchGeo, benchMat);
    seat.position.set(0, 0.55, 0);
    benchGroup.add(seat);

    const leg1 = new THREE.Mesh(benchLegGeo, girderMat);
    leg1.position.set(-1.2, 0.25, 0);
    benchGroup.add(leg1);

    const leg2 = new THREE.Mesh(benchLegGeo, girderMat);
    leg2.position.set(1.2, 0.25, 0);
    benchGroup.add(leg2);

    const accentStrip = new THREE.Mesh(
      new THREE.BoxGeometry(2.6, 0.04, 0.1),
      neonMatCyan
    );
    accentStrip.position.set(0, 0.38, 0.35);
    benchGroup.add(accentStrip);

    benchGroup.position.set(bx, 0, bz);
    benchGroup.rotation.y = rotY;
    galleryGroup.add(benchGroup);
  }

  createBench(-8, 8, 0);
  createBench(8, 8, 0);
  createBench(-8, -12, 0);
  createBench(8, -12, 0);

  // Grid
  const gridMat = new THREE.MeshBasicMaterial({ color: 0x151a2e, transparent: true, opacity: 0.4 });
  for (let gx = -18; gx <= 18; gx += 6) {
    const lineZ = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.02, 36), gridMat);
    lineZ.position.set(gx, 0.01, -2);
    galleryGroup.add(lineZ);
  }
  for (let gz = -18; gz <= 18; gz += 6) {
    const lineX = new THREE.Mesh(new THREE.BoxGeometry(36, 0.02, 0.04), gridMat);
    lineX.position.set(0, 0.01, gz);
    galleryGroup.add(lineX);
  }

  // Archways
  createArchway(galleryGroup, -15, 0, "BILIK 1: AR CARD", 0xC8A97A, neonMatGold);
  createArchway(galleryGroup, 0, -20, "BILIK 2: SPACE OBSERVATORY", 0x00CED1, neonMatCyan, true);
  createArchway(galleryGroup, 15, 0, "BILIK 3: CYBERPUNK VR", 0x9370DB, neonMatPurple);

  const light1 = new THREE.PointLight(0xC8A97A, 2, 20);
  light1.position.set(-25, 6, 0);
  scene.add(light1);

  const light2 = new THREE.PointLight(0x00CED1, 3.5, 45);
  light2.position.set(0, 12, -45);
  scene.add(light2);

  const light3 = new THREE.PointLight(0x9370DB, 2, 20);
  light3.position.set(25, 6, 0);
  scene.add(light3);

  // ── LOBBY & CORRIDOR INTERIOR THEME DECOR (SUPER OPTIMIZED MATRIX FREEZE) ──
  const decorMatGold = new THREE.MeshBasicMaterial({ color: 0xC8A97A });
  const decorMatCyan = new THREE.MeshBasicMaterial({ color: 0x00CED1 });
  const decorMatPurple = new THREE.MeshBasicMaterial({ color: 0x9370DB });

  // 1. Upper Wall Neon Ribbon Strips
  const ribbonWest = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.12, 38), decorMatGold);
  ribbonWest.position.set(-19.8, 6.2, 0);
  galleryGroup.add(ribbonWest);

  const ribbonEast = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.12, 38), decorMatPurple);
  ribbonEast.position.set(19.8, 6.2, 0);
  galleryGroup.add(ribbonEast);

  // 2. Corner Hologram Projector Pedestals
  function createHoloPedestal(px, pz, colorMat) {
    const pBase = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.45, 0.6, 16), pillarMat);
    pBase.position.set(px, 0.3, pz);
    galleryGroup.add(pBase);

    const pRing = new THREE.Mesh(new THREE.TorusGeometry(0.36, 0.02, 8, 16), colorMat);
    pRing.rotation.x = Math.PI / 2;
    pRing.position.set(px, 0.61, pz);
    galleryGroup.add(pRing);
  }

  createHoloPedestal(-18, 18, decorMatGold);
  createHoloPedestal(18, 18, decorMatPurple);
  createHoloPedestal(-14, -18, decorMatGold);
  createHoloPedestal(14, -18, decorMatPurple);

  // ── BUILD PARKOUR PLATFORMS & COLLECTIBLES ─────────────────────────────────
  buildParkourPlatforms(galleryGroup, collisionGroup);

  scene.add(galleryGroup);

  collisionGroup.updateMatrixWorld(true);
  worldOctree.fromGraphNode(collisionGroup);
}

function createWall(group, mat, x, y, z, w, h, d) {
  const wall = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  wall.position.set(x, y, z);
  wall.castShadow = true;
  wall.receiveShadow = true;
  group.add(wall);
}

function createArchway(group, x, z, textTitle, colorHex, neonMat, isNorth = false) {
  const pillarMat = new THREE.MeshStandardMaterial({ color: 0x1a1d2e, roughness: 0.3 });

  let p1, p2, beam;
  if (!isNorth) {
    p1 = new THREE.Mesh(new THREE.BoxGeometry(0.8, 6, 0.8), pillarMat);
    p1.position.set(x, 3, z - 4);
    p2 = new THREE.Mesh(new THREE.BoxGeometry(0.8, 6, 0.8), pillarMat);
    p2.position.set(x, 3, z + 4);
    beam = new THREE.Mesh(new THREE.BoxGeometry(1, 0.8, 8.8), neonMat);
    beam.position.set(x, 6, z);
  } else {
    p1 = new THREE.Mesh(new THREE.BoxGeometry(1.2, 10, 1.2), pillarMat);
    p1.position.set(x - 8, 5, z);
    p2 = new THREE.Mesh(new THREE.BoxGeometry(1.2, 10, 1.2), pillarMat);
    p2.position.set(x + 8, 5, z);
    beam = new THREE.Mesh(new THREE.BoxGeometry(16.8, 1.2, 1.2), neonMat);
    beam.position.set(x, 10, z);
  }

  group.add(p1);
  group.add(p2);
  group.add(beam);

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#0a0d18';
  ctx.fillRect(0, 0, 512, 128);
  ctx.lineWidth = 6;
  ctx.strokeStyle = `#${colorHex.toString(16)}`;
  ctx.strokeRect(6, 6, 500, 116);
  ctx.fillStyle = `#${colorHex.toString(16)}`;
  ctx.font = 'bold 28px Outfit, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(textTitle, 256, 64);

  const texture = new THREE.CanvasTexture(canvas);
  const signMat = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
  const signMesh = new THREE.Mesh(new THREE.PlaneGeometry(6, 1.5), signMat);
  signMesh.position.set(x, isNorth ? 11.5 : 7.2, z);
  if (!isNorth) {
    signMesh.rotation.y = x < 0 ? Math.PI / 2 : -Math.PI / 2;
  }
  group.add(signMesh);
}
