import * as THREE from 'three';
import { createCollectible } from './collectibles.js';

export function buildParkourPlatforms(galleryGroup, collisionGroup) {
  const padMat = new THREE.MeshStandardMaterial({
    color: 0x161b2e,
    roughness: 0.3,
    metalness: 0.8
  });

  const rimCyan = new THREE.MeshBasicMaterial({ color: 0x00CED1 });
  const rimGold = new THREE.MeshBasicMaterial({ color: 0xFFD700 });
  const rimPurple = new THREE.MeshBasicMaterial({ color: 0x9370DB });

  // Reusable Shared Pad Geometry (1.8m x 0.3m x 1.8m)
  const padGeo = new THREE.BoxGeometry(1.8, 0.3, 1.8);
  const trimGeo = new THREE.BoxGeometry(1.88, 0.04, 1.88);

  function addPad(x, y, z, rimMat = rimCyan) {
    const pad = new THREE.Mesh(padGeo, padMat);
    pad.position.set(x, y, z);
    pad.castShadow = true;
    pad.receiveShadow = true;
    galleryGroup.add(pad);

    const padCol = new THREE.Mesh(padGeo, padMat);
    padCol.position.set(x, y, z);
    collisionGroup.add(padCol);

    const trim = new THREE.Mesh(trimGeo, rimMat);
    trim.position.set(x, y + 0.17, z);
    galleryGroup.add(trim);

    return pad;
  }

  // ── 1. LOBBY PARKOUR ASCENT (Sisi Koridor Barat x = -13.2, 0% CLIPPING DENGAN DINDING) ──
  addPad(-13.2, 1.0, 10.0, rimGold);
  createCollectible(-13.2, 1.9, 10.0, false, "Lobby Step 1");

  addPad(-13.2, 2.1, 7.6, rimGold);
  createCollectible(-13.2, 3.0, 7.6, false, "Lobby Step 2");

  addPad(-13.2, 3.2, 5.2, rimGold);
  createCollectible(-13.2, 4.1, 5.2, false, "Lobby Step 3");

  addPad(-13.2, 4.3, 2.8, rimGold);
  createCollectible(-13.2, 5.2, 2.8, false, "Lobby Step 4");

  addPad(-13.2, 5.4, 0.4, rimGold);
  createCollectible(-13.2, 6.3, 0.4, false, "Lobby Step 5");

  addPad(-8.0, 6.5, 0.0, rimGold);
  createCollectible(-8.0, 7.6, 0.0, true, "⭐ RARE: Lobby Beam West Crystal (+50 Poin)");

  addPad(0.0, 6.5, 0.0, rimGold);
  createCollectible(0.0, 7.6, 0.0, true, "⭐ RARE: Lobby Center Crown Crystal (+50 Poin)");

  // ── 2. BILIK 1 (AR CARD BOOTH) SIDE PARKOUR (z = -7.8, 0% CLIPPING) ────────
  addPad(-19.0, 1.0, -7.8, rimGold);
  createCollectible(-19.0, 1.9, -7.8, false, "AR Side Step 1");

  addPad(-22.5, 2.1, -7.8, rimGold);
  createCollectible(-22.5, 3.0, -7.8, false, "AR Side Step 2");

  addPad(-26.0, 3.2, -7.8, rimGold);
  createCollectible(-26.0, 4.1, -7.8, false, "AR Side Step 3");

  addPad(-29.5, 4.3, -7.8, rimGold);
  createCollectible(-29.5, 5.4, -7.8, true, "⭐ RARE: AR Vantage High Crystal (+50 Poin)");

  // ── 3. BILIK 2 (SPACE OBSERVATORY MEGASTRUCTURE) SIDE PARKOUR (x = 27.2, 0% CLIPPING)
  addPad(27.2, 1.0, -28.0, rimCyan);
  createCollectible(27.2, 1.9, -28.0, false, "Space Side Step 1");

  addPad(27.2, 2.1, -34.0, rimCyan);
  createCollectible(27.2, 3.0, -34.0, false, "Space Side Step 2");

  addPad(27.2, 3.2, -40.0, rimCyan);
  createCollectible(27.2, 4.1, -40.0, false, "Space Side Step 3");

  addPad(27.2, 4.3, -46.0, rimCyan);
  createCollectible(27.2, 5.2, -46.0, false, "Space Side Step 4");

  addPad(27.2, 5.5, -52.0, rimCyan);
  createCollectible(27.2, 6.6, -52.0, true, "⭐ RARE: Space Observatory East Balcony (+50 Poin)");

  addPad(27.2, 6.7, -58.0, rimCyan);
  createCollectible(27.2, 7.8, -58.0, false, "Space High Step 6");

  addPad(27.2, 7.9, -64.0, rimCyan);
  createCollectible(27.2, 9.0, -64.0, true, "⭐ RARE: Space High Crown Crystal (+50 Poin)");

  // ── 4. BILIK 3 (CYBERPUNK SHOWROOM) BACKWALL PARKOUR (z = -7.8, 0% CLIPPING) ─
  addPad(18.0, 1.0, -7.8, rimPurple);
  createCollectible(18.0, 1.9, -7.8, false, "Cyber Back Step 1");

  addPad(21.5, 2.1, -7.8, rimPurple);
  createCollectible(21.5, 3.0, -7.8, false, "Cyber Back Step 2");

  addPad(25.0, 3.2, -7.8, rimPurple);
  createCollectible(25.0, 4.1, -7.8, false, "Cyber Back Step 3");

  addPad(28.5, 4.3, -7.8, rimPurple);
  createCollectible(28.5, 5.4, -7.8, true, "⭐ RARE: Cyber Vault High Crystal (+50 Poin)");

  // ── 5. BILIK KHUSUS 3A (PRIMITIF VR ARENA) SIDE HOP (x = 15.0, 0% CLIPPING) ─
  addPad(15.0, 1.0, 54.0, rimPurple);
  createCollectible(15.0, 1.9, 54.0, false, "Primitif Side Step 1");

  addPad(15.0, 2.1, 60.0, rimPurple);
  createCollectible(15.0, 3.0, 60.0, false, "Primitif Side Step 2");

  addPad(15.0, 3.2, 66.0, rimPurple);
  createCollectible(15.0, 4.3, 66.0, true, "⭐ RARE: Primitif High Crown (+50 Poin)");

  // ── 6. BILIK KHUSUS 3C (GLTF SHOWROOM) SIDE CLAMBER (z = -10.0, 0% CLIPPING) ─
  addPad(56.0, 1.0, -10.0, rimPurple);
  createCollectible(56.0, 1.9, -10.0, false, "Showroom Side Step 1");

  addPad(62.0, 2.1, -10.0, rimPurple);
  createCollectible(62.0, 3.0, -10.0, false, "Showroom Side Step 2");

  addPad(68.0, 3.2, -10.0, rimPurple);
  createCollectible(68.0, 4.3, -10.0, true, "⭐ RARE: GLTF Showroom Crown (+50 Poin)");

  // ── 7. MAIN FLOOR GROUND CRYSTALS (Quick Collectibles) ────────────────────
  createCollectible(0, 0.8, 8.0, false, "Lobby South Crystal");
  createCollectible(-10, 0.8, 0.0, false, "West Corridor Crystal");
  createCollectible(10, 0.8, 0.0, false, "East Corridor Crystal");
  createCollectible(0, 0.8, -10.0, false, "North Corridor Crystal");
  createCollectible(-25, 0.8, -4.0, false, "Bilik 1 Ground Crystal");
  createCollectible(25, 0.8, 4.0, false, "Bilik 3 Hub Ground Crystal");
  createCollectible(25, 0.8, 54.0, false, "Sub-Room 3A Ground Crystal");
  createCollectible(65, 0.8, -4.0, false, "Sub-Room 3C Ground Crystal");
}
