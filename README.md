# SyzLab — Metaverse Gallery 3D

## Gambaran Umum
**SyzLab** adalah galeri metaverse 3D interaktif berbasis WebGL dan Three.js yang menyajikan pameran multimedia berarsitektur modular. Aplikasi ini menggabungkan navigasi *First-Person Shooter* (FPS), simulasi fisika, animasi 3D, integrasi WebAR, dan audio interaktif dalam satu lingkungan metaverse yang terintegrasi.

---

## Fitur Utama & Ruangan Eksibisi

### 🏛️ Lobby Utama
- **Sistem Navigasi FPS**: Kontrol pergerakan `WASD`, melompat `Spasi`, serta orientasi pandangan kursor (*Pointer Lock*).
- **Audio Interstellar & BoomBox**: Musik latar *Interstellar* yang dapat diatur volumenya (0% – 100%) dengan berinteraksi langsung pada model 3D BoomBox.
- **Arena Parkour Sci-Fi**: Pijakan melayang interaktif yang diposisikan secara terukur di sepanjang dinding galeri.
- **Simulasi Fisika & Poin**: Fitur pelemparan bola fisika dan pengumpulan kristal poin cyan (+10) dan kristal emas langka (+50).

### 🃏 Bilik 1: AR Card
- **Kartu Nama AR Interaktif**: Memindai kartu nama 3D Syafrizal Amri Fajar dengan kursor untuk menampilkan elemen profil melayang (*smooth spring reveal*).
- **Maskot Owl 3D (Spirit Animal)**: Burung hantu 3D beranimasi yang merupakan *spirit animal* Syafrizal Amri Fajar, simbol kebijaksanaan, fokus, dan ketekunan di dunia teknologi.
- **Panel Portofolio & Tombol Sosmed Wave**: Pratinjau situs `syzaf.dev` serta 6 tombol hologram media sosial dengan animasi gelombang 3D dan pendaran neon.
- **Integrasi WebAR Live**: Akses langsung ke kamera WebAR interaktif berbasis AR.js (`ar-live.html`).

### 🪐 Bilik 2: Space Observatory
- **Megastruktur Astronomi**: Ruangan kubah 60m × 60m × 24m dengan tata surya 3D interaktif.
- **Objek Luar Angkasa**: Matahari Raksasa (radius 6m) dengan korona plasma, Planet Miller, Stasiun ISS, Roket Multi-Stage, Komet, 25 Sabuk Asteroid berputar, dan Ring Nebula.
- **Anjungan Pandang**: Tangga dan platform observasi lantai atas untuk mengamati seluruh tata surya dari ketinggian.

### 🤖 Bilik 3: Cyberpunk VR Hub
- **Hub Portal Black Hole**: Pusat portal futuristik dengan 3 portal teleportasi simetris:
  - **Portal 1 (Bilik 3A)**: Arena eksperimen geometri 3D primitif (Kubus, Bola, Silinder Terbang, dan Kerucut Rotasi).
  - **Portal 2 (Scene 2)**: Integrasi panorama 360° VR standalone (`scene2.html`).
  - **Portal 3 (Bilik 3C)**: Showroom model GLTF Sci-Fi (Cyber Samurai, Mobil Terbang, Buster Drone, dan Menara Sci-Fi).
- **Sistem Teleportasi Presisi**: Saat pemain berpindah melalui portal, posisi spawn dan orientasi kamera otomatis menghadap ke dalam ruangan dengan portal di belakang pemain (*portal exit orientation*).

---

## Struktur Proyek

```text
SyzLab/
├─ css/                     # Styling Glassmorphism UI, Crosshair, HUD, Toast Notification
├─ js/
│   ├─ app.js               # Titik masuk utama, init scene, & render loop
│   ├─ components.js        # Komponen A-Frame khusus untuk scene2.html
│   ├─ modules/             # Modul ES (ES Modules)
│   │   ├─ state.js          # Manajemen state global (Scene, Camera, Score, Objects)
│   │   ├─ physics.js        # Fisika pemain, Octree collision, & player teleportation
│   │   ├─ interactivity.js  # Raycaster interaktif & HUD Card notification
│   │   ├─ ui.js             # Binding tombol navigasi, modal AR, & kontrol UI
│   │   ├─ media.js          # Positional audio & BoomBox volume controller
│   │   ├─ gallery.js        # Arsitektur galeri, dinding, lantai, & dekorasi
│   │   ├─ booth1_ar.js      # Eksibisi Bilik 1 AR Card & Maskot Owl Spirit Animal
│   │   ├─ booth2_space.js   # Eksibisi Bilik 2 Space Observatory Megastructure
│   │   ├─ booth3_cyber.js   # Eksibisi Bilik 3 Cyberpunk Hub & Black Hole Portals (3A, 3C)
│   │   ├─ collectibles.js   # Sistem kristal poin kolektibel & Web Audio SFX
│   │   ├─ parkour.js        # Arena pijakan melayang parkour Sci-Fi
│   │   └─ panorama.js       # Integrasi navigasi halaman panorama 360°
│   └─ jsm/                 # Modul Three.js (GLTFLoader, Octree, Capsule)
├─ assets/                  # Model 3D GLTF, tekstur, audio Interstellar, video
├─ index.html               # Halaman utama Metaverse Gallery
├─ scene2.html              # Halaman A-Frame 360° Panorama
├─ ar-live.html             # Halaman WebAR Live Camera (AR.js + A-Frame)
└─ README.md                # Dokumentasi proyek SyzLab
```

---

## Optimasi Performa

- **Distance-Based Booth Throttling**: Kalkulasi matematika & animasi pada stan yang berada jauh dari posisi pemain secara otomatis ditunda untuk menghemat beban CPU.
- **Raycaster 50% CPU Savings**: Pemindaian kursor interaktif dieksekusi secara efisien pada interval 2 frame sekali.
- **Zero-GC Vector Allocation**: Vektor fisika & transformasi menggunakan objek statis pra-alokasi untuk mencegah *garbage collection lag*.
- **CanvasTexture Memory Optimization**: Pembuatan mipmap GPU dinonaktifkan pada papan teks 2D untuk menghemat konsumsi VRAM.

---

## Kontrol Navigasi

| Aksi | Tombol / Mouse |
| :--- | :--- |
| **Maju / Mundur** | `W` / `S` |
| **Kiri / Kanan** | `A` / `D` |
| **Lompat** | `Spasi` |
| **Kunci Kursor FPS** | Klik Kiri di Layar |
| **Lepas Kursor** | `Esc` |
| **Lempar Bola Fisika** | Klik Kiri pada area kosong |
| **Interaksi / Klik Objek** | Sorot kursor ke objek interaktif lalu Klik Kiri |
| **Gaze Auto-Click** | Tatap objek interaktif selama 5 detik |
