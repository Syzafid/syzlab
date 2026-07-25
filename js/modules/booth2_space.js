import * as THREE from 'three';
import {
  scene, interactiveObjects, spaceGroup, setSpaceGroup,
  matahari, setMatahari, planetMiller, setPlanetMiller,
  stasiunISS, setStasiunISS, ringNebula, setRingNebula,
  meteoroid, setMeteoroid, roketCone, setRoketCone
} from './state.js';

let sunCorona, sunFlareRing, rocketExhaustFlame, issSolarPanels = [], kometGroup, asteroidGroup = [];

export function buildSpaceBooth() {
  const group = new THREE.Group();
  // Centered at z=-45 in enlarged 60x60x24 Megastructure Observatory
  group.position.set(0, 0, -45);
  setSpaceGroup(group);

  const metalMat = new THREE.MeshStandardMaterial({ color: 0xe0e6ed, metalness: 0.9, roughness: 0.15 });
  const darkMetalMat = new THREE.MeshStandardMaterial({ color: 0x1f2430, metalness: 0.8, roughness: 0.3 });
  const goldFoilMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.95, roughness: 0.1 });
  const solarBlueMat = new THREE.MeshStandardMaterial({ color: 0x0033aa, emissive: 0x001155, metalness: 0.9, roughness: 0.1, side: THREE.DoubleSide });

  // ── 1. MATAHARI GIANT (Sun Corona & Solar Prominences) ────────────────────────
  const sunGeo = new THREE.SphereGeometry(6.0, 64, 64);
  const sunMat = new THREE.MeshStandardMaterial({
    color: 0xff3300,
    emissive: 0xff5500,
    emissiveIntensity: 2.0,
    roughness: 0.3
  });
  const sunMesh = new THREE.Mesh(sunGeo, sunMat);
  sunMesh.position.set(0, 12, 0); // Floating high up in the center of 24m high hall
  setMatahari(sunMesh);

  // Inner Corona Glow Shell
  const coronaGeo = new THREE.SphereGeometry(7.5, 32, 32);
  const coronaMat = new THREE.MeshBasicMaterial({ color: 0xffaa00, transparent: true, opacity: 0.45, side: THREE.BackSide });
  sunCorona = new THREE.Mesh(coronaGeo, coronaMat);
  sunMesh.add(sunCorona);

  // Outer Solar Flare Plasma Ring
  const flareGeo = new THREE.TorusGeometry(9.0, 0.35, 16, 64);
  const flareMat = new THREE.MeshBasicMaterial({ color: 0xff7700, transparent: true, opacity: 0.7 });
  sunFlareRing = new THREE.Mesh(flareGeo, flareMat);
  sunFlareRing.rotation.x = Math.PI / 3;
  sunMesh.add(sunFlareRing);

  sunMesh.userData = {
    isInteractive: true,
    tag: "SPACE OBSERVATORY — SOLAR SYSTEM",
    title: "Matahari (Sun Corona & Solar Prominences)",
    desc: "Bintang pusat bertemperatur 5.500°C di permukaan dengan korona plasma dan lidah api matahari (solar prominences) beradiasi tinggi."
  };
  group.add(sunMesh);
  interactiveObjects.push(sunMesh);

  // High Power Central Sun PointLight
  const sunLight = new THREE.PointLight(0xffaa00, 6, 75);
  sunLight.position.set(0, 12, 0);
  group.add(sunLight);

  // ── 2. PLANET MILLER REALISTIS (3X Larger Orbit Radius = 18m) ───────────────
  const orbitLineGeo = new THREE.TorusGeometry(18.0, 0.05, 8, 120);
  const orbitLineMat = new THREE.MeshBasicMaterial({ color: 0x00CED1, transparent: true, opacity: 0.4 });
  const orbitLine = new THREE.Mesh(orbitLineGeo, orbitLineMat);
  orbitLine.rotation.x = Math.PI / 2;
  orbitLine.position.set(0, 12, 0);
  group.add(orbitLine);

  const planetGeo = new THREE.SphereGeometry(2.5, 64, 64);
  const planetMat = new THREE.MeshStandardMaterial({ color: 0x0e4d92, roughness: 0.3, metalness: 0.4 });
  const pMiller = new THREE.Mesh(planetGeo, planetMat);
  pMiller.position.set(18.0, 12, 0);
  pMiller.castShadow = true;
  setPlanetMiller(pMiller);

  // Atmosphere Shell
  const atmoGeo = new THREE.SphereGeometry(2.8, 32, 32);
  const atmoMat = new THREE.MeshBasicMaterial({ color: 0x00e5ff, transparent: true, opacity: 0.35, side: THREE.BackSide });
  const atmoShell = new THREE.Mesh(atmoGeo, atmoMat);
  pMiller.add(atmoShell);

  // Planetary Dust Ring Disc
  const ringDiscGeo = new THREE.RingGeometry(3.2, 5.2, 64);
  const ringDiscMat = new THREE.MeshBasicMaterial({ color: 0x66aacc, side: THREE.DoubleSide, transparent: true, opacity: 0.65 });
  const ringDisc = new THREE.Mesh(ringDiscGeo, ringDiscMat);
  ringDisc.rotation.x = Math.PI / 2.3;
  pMiller.add(ringDisc);

  pMiller.userData = {
    isInteractive: true,
    tag: "SPACE OBSERVATORY — PLANET",
    title: "Planet Miller (Water World & Planetary Ring)",
    desc: "Planet Samudra raksasa bergelombang tinggi dengan efek dilatasi waktu gravitasi masif (1 jam di Miller = 7 tahun di Bumi)."
  };
  group.add(pMiller);
  interactiveObjects.push(pMiller);

  // ── 3. STASIUN ISS (3X Larger Orbit Radius = 25m) ───────────────────────────
  const issGroup = new THREE.Group();
  issGroup.position.set(-20, 15, 12);
  issGroup.scale.set(1.5, 1.5, 1.5);

  const mainMod = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 3.2, 16), metalMat);
  mainMod.rotation.z = Math.PI / 2;
  issGroup.add(mainMod);

  const crossMod = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 2.2, 16), goldFoilMat);
  crossMod.rotation.x = Math.PI / 2;
  issGroup.add(crossMod);

  const truss = new THREE.Mesh(new THREE.BoxGeometry(8.0, 0.14, 0.14), darkMetalMat);
  issGroup.add(truss);

  issSolarPanels = [];
  for (let i = -1; i <= 1; i += 2) {
    for (let j = -1; j <= 1; j += 2) {
      const solarPanel = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.05, 1.3), solarBlueMat);
      solarPanel.position.set(i * 3.0, j * 0.5, 0);
      issGroup.add(solarPanel);
      issSolarPanels.push(solarPanel);
    }
  }

  const dish = new THREE.Mesh(new THREE.SphereGeometry(0.4, 16, 8, 0, Math.PI * 2, 0, Math.PI / 3), metalMat);
  dish.position.set(0, 0.7, 0);
  dish.rotation.x = -Math.PI / 3;
  issGroup.add(dish);

  setStasiunISS(issGroup);
  issGroup.userData = {
    isInteractive: true,
    tag: "SPACE OBSERVATORY — ISS",
    title: "Stasiun Luar Angkasa ISS (International Space Station)",
    desc: "Stasiun riset mikrogravitasi internasional berbobot 420 ton yang mengorbit bumi pada kecepatan 27.600 km/jam."
  };
  group.add(issGroup);
  interactiveObjects.push(issGroup);

  // ── 4. ROKET MULTI-STAGE (Enlarged Scale) ───────────────────────────────────
  const roketGroup = new THREE.Group();
  roketGroup.position.set(0, 5.0, 20.0);
  roketGroup.scale.set(1.5, 1.5, 1.5);

  const fuselage = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.65, 3.8, 32), metalMat);
  fuselage.position.set(0, 2.0, 0);
  roketGroup.add(fuselage);

  const stripe = new THREE.Mesh(new THREE.CylinderGeometry(0.66, 0.66, 0.4, 32), darkMetalMat);
  stripe.position.set(0, 2.8, 0);
  roketGroup.add(stripe);

  const noseCone = new THREE.Mesh(new THREE.ConeGeometry(0.66, 1.8, 32), metalMat);
  noseCone.position.set(0, 4.8, 0);
  roketGroup.add(noseCone);

  for (let s = -1; s <= 1; s += 2) {
    const booster = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 2.8, 16), metalMat);
    booster.position.set(s * 0.95, 1.4, 0);
    roketGroup.add(booster);

    const boosterNose = new THREE.Mesh(new THREE.ConeGeometry(0.33, 0.8, 16), darkMetalMat);
    boosterNose.position.set(s * 0.95, 3.2, 0);
    roketGroup.add(boosterNose);
  }

  for (let n = 0; n < 4; n++) {
    const angle = (Math.PI / 2) * n;
    const nozzle = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.45, 16), darkMetalMat);
    nozzle.position.set(Math.cos(angle) * 0.35, -0.1, Math.sin(angle) * 0.35);
    nozzle.rotation.x = Math.PI;
    roketGroup.add(nozzle);
  }

  const flameMat = new THREE.MeshBasicMaterial({ color: 0xff3300 });
  rocketExhaustFlame = new THREE.Mesh(new THREE.ConeGeometry(0.6, 2.2, 16), flameMat);
  rocketExhaustFlame.position.set(0, -1.2, 0);
  rocketExhaustFlame.rotation.x = Math.PI;
  roketGroup.add(rocketExhaustFlame);

  const innerFlameMat = new THREE.MeshBasicMaterial({ color: 0xffff00 });
  const innerFlame = new THREE.Mesh(new THREE.ConeGeometry(0.3, 1.4, 16), innerFlameMat);
  innerFlame.position.set(0, -0.8, 0);
  innerFlame.rotation.x = Math.PI;
  roketGroup.add(innerFlame);

  setRoketCone(roketGroup);
  roketGroup.userData = {
    isInteractive: true,
    tag: "SPACE OBSERVATORY — ROCKET",
    title: "Roket Peluncur Antariksa Multi-Stage (Heavy Launch Vehicle)",
    desc: "Roket pendorong bertingkat ganda berdaya dorong jutaan Newton untuk mengangkut muatan satelit dan pesawat eksplorasi."
  };
  group.add(roketGroup);
  interactiveObjects.push(roketGroup);

  // ── 5. KOMET ES (Wide Orbit Radius = 26m) ────────────────────────────────────
  kometGroup = new THREE.Group();
  kometGroup.position.set(18, 16, -18);
  kometGroup.scale.set(1.4, 1.4, 1.4);

  const cometCore = new THREE.Mesh(
    new THREE.DodecahedronGeometry(1.0),
    new THREE.MeshStandardMaterial({ color: 0x99ddff, roughness: 0.3, metalness: 0.2 })
  );
  kometGroup.add(cometCore);

  const comaMesh = new THREE.Mesh(
    new THREE.SphereGeometry(1.8, 16, 16),
    new THREE.MeshBasicMaterial({ color: 0x00e5ff, transparent: true, opacity: 0.45 })
  );
  kometGroup.add(comaMesh);

  const tailMesh = new THREE.Mesh(
    new THREE.ConeGeometry(1.2, 7.0, 16),
    new THREE.MeshBasicMaterial({ color: 0x0088ff, transparent: true, opacity: 0.55 })
  );
  tailMesh.position.set(2.2, 2.2, -2.8);
  tailMesh.rotation.x = -Math.PI / 4;
  tailMesh.rotation.z = Math.PI / 4;
  kometGroup.add(tailMesh);

  kometGroup.userData = {
    isInteractive: true,
    tag: "SPACE OBSERVATORY — COMET",
    title: "Komet Es (Comet Nucleus & Ion Tail)",
    desc: "Benda langit es kosmik yang menguapkan gas dan debu saat mendekati radiasi matahari, membentuk ekor plasma ribuan kilometer."
  };
  group.add(kometGroup);
  interactiveObjects.push(kometGroup);

  // ── 6. RING NEBULA GANDA (Enlarged Scale) ────────────────────────────────────
  const nebulaOuter = new THREE.Mesh(
    new THREE.TorusGeometry(5.0, 0.8, 16, 64),
    new THREE.MeshStandardMaterial({ color: 0xaa00ff, emissive: 0x5500aa, emissiveIntensity: 0.9, roughness: 0.3 })
  );
  nebulaOuter.position.set(-20, 18, -18);

  const nebulaInner = new THREE.Mesh(
    new THREE.TorusGeometry(3.0, 0.4, 16, 64),
    new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.75 })
  );
  nebulaOuter.add(nebulaInner);

  setRingNebula(nebulaOuter);
  nebulaOuter.userData = {
    isInteractive: true,
    tag: "SPACE OBSERVATORY — NEBULA",
    title: "Ring Nebula (Awan Gas & Debu Kosmik Ganda)",
    desc: "Nebula planetaris raksasa bertemperatur tinggi yang memancarkan pendar gas terionisasi neon ungu-cyan."
  };
  group.add(nebulaOuter);
  interactiveObjects.push(nebulaOuter);

  // ── 7. SABUK METEOROID & ASTEROID (12 Tumbling Asteroids orbiting at 12m) ────
  const astMat = new THREE.MeshStandardMaterial({ color: 0x5c4d3c, roughness: 0.95, metalness: 0.1 });
  asteroidGroup = [];
  for (let a = 0; a < 12; a++) {
    const astGeo = new THREE.DodecahedronGeometry(0.6 + Math.random() * 0.6);
    const astMesh = new THREE.Mesh(astGeo, astMat);
    const angle = (Math.PI * 2 / 12) * a;
    const rad = 11.5 + (Math.random() - 0.5) * 2.0;
    astMesh.position.set(Math.cos(angle) * rad, 12 + (Math.random() - 0.5) * 3, Math.sin(angle) * rad);
    astMesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
    group.add(astMesh);
    asteroidGroup.push({ mesh: astMesh, angle, rad, speed: 0.2 + Math.random() * 0.15 });
  }

  // ── 8. TELEMETRY MONITOR PANELS & CEILING STARLIGHT HALOS (SUPER OPTIMIZED) ─
  const monitorGeo = new THREE.PlaneGeometry(4.0, 2.0);
  const monitorMat = new THREE.MeshBasicMaterial({ color: 0x081828, side: THREE.DoubleSide });
  const monitorBorderMat = new THREE.MeshBasicMaterial({ color: 0x00CED1 });

  function createTelemetryMonitor(px, py, pz, rotY = 0) {
    const mon = new THREE.Mesh(monitorGeo, monitorMat);
    mon.position.set(px, py, pz);
    mon.rotation.y = rotY;
    mon.matrixAutoUpdate = false; mon.updateMatrix();
    group.add(mon);

    const border = new THREE.Mesh(new THREE.RingGeometry(1.0, 1.05, 4), monitorBorderMat);
    border.position.set(px, py, pz + (rotY === 0 ? 0.02 : 0));
    border.rotation.y = rotY;
    border.matrixAutoUpdate = false; border.updateMatrix();
    group.add(border);
  }

  createTelemetryMonitor(-15, 12, -29.5);
  createTelemetryMonitor(15, 12, -29.5);

  const starHaloMat = new THREE.MeshBasicMaterial({ color: 0x00e5ff, transparent: true, opacity: 0.6 });
  const halo1 = new THREE.Mesh(new THREE.TorusGeometry(8.0, 0.05, 8, 32), starHaloMat);
  halo1.position.set(-18, 23.0, 0);
  halo1.rotation.x = Math.PI / 2;
  halo1.matrixAutoUpdate = false; halo1.updateMatrix();
  group.add(halo1);

  const halo2 = new THREE.Mesh(new THREE.TorusGeometry(8.0, 0.05, 8, 32), starHaloMat);
  halo2.position.set(18, 23.0, 0);
  halo2.rotation.x = Math.PI / 2;
  halo2.matrixAutoUpdate = false; halo2.updateMatrix();
  group.add(halo2);

  const metMesh = new THREE.Mesh(
    new THREE.DodecahedronGeometry(1.8),
    astMat
  );
  metMesh.position.set(15, 14, -8);
  metMesh.castShadow = true;
  setMeteoroid(metMesh);
  metMesh.userData = {
    isInteractive: true,
    tag: "SPACE OBSERVATORY — ASTEROID",
    title: "Meteoroid & Sabuk Asteroid Kosmik",
    desc: "Batuan kosmik purba dari fragmen pecahan komet dan asteroid di tata surya."
  };
  group.add(metMesh);
  interactiveObjects.push(metMesh);

  scene.add(group);
}

export function updateSpaceAnimations(t) {
  if (matahari) {
    matahari.rotation.y = t * 0.1;
    if (sunFlareRing) {
      sunFlareRing.rotation.z = t * 0.4;
      sunFlareRing.rotation.y = t * 0.2;
    }
  }

  if (planetMiller) {
    planetMiller.position.x = Math.cos(t * 0.3) * 18.0;
    planetMiller.position.z = Math.sin(t * 0.3) * 18.0;
    planetMiller.rotation.y = t * 0.8;
  }

  if (stasiunISS) {
    stasiunISS.position.x = Math.cos(-t * 0.25) * 25.0;
    stasiunISS.position.z = Math.sin(-t * 0.25) * 25.0;
    stasiunISS.rotation.y = t * 0.3;
    stasiunISS.rotation.x = Math.sin(t * 0.5) * 0.15;
  }

  if (roketCone) {
    roketCone.position.x = Math.sin(t * 0.35) * 22.0;
    roketCone.position.z = Math.cos(t * 0.35) * 22.0;
    roketCone.position.y = 12.0 + Math.sin(t * 1.5) * 2.5;
    roketCone.rotation.y = t * 0.35 + Math.PI / 2;
    if (rocketExhaustFlame) {
      rocketExhaustFlame.scale.y = 1 + Math.sin(t * 15) * 0.25;
    }
  }

  if (kometGroup) {
    kometGroup.position.x = Math.cos(t * 0.4) * 26.0;
    kometGroup.position.z = Math.sin(t * 0.4) * 26.0;
    kometGroup.position.y = 16.0 + Math.sin(t * 0.8) * 2.0;
    kometGroup.rotation.y = t * 0.5;
  }

  if (ringNebula) {
    ringNebula.rotation.x = t * 0.3;
    ringNebula.rotation.y = t * 0.2;
  }

  if (meteoroid) {
    meteoroid.rotation.x = t * 0.4;
    meteoroid.rotation.y = t * 0.5;
  }

  // Asteroid belt orbital motion
  for (let i = 0; i < asteroidGroup.length; i++) {
    const ast = asteroidGroup[i];
    ast.angle += 0.005 * ast.speed;
    ast.mesh.position.x = Math.cos(ast.angle) * ast.rad;
    ast.mesh.position.z = Math.sin(ast.angle) * ast.rad;
    ast.mesh.rotation.x += 0.01;
    ast.mesh.rotation.y += 0.015;
  }
}
