# Syzlab

## Gambaran Umum
Syzlab adalah **pameran 3D berbasis WebGL** yang dibangun dengan **Three.js**. Lingkungan ini menawarkan interaksi FPS‑style dengan tiga stan pameran berbeda:

- **Stan AR Card** – menampilkan kartu nama 3D yang dapat dipindai via WebAR.
- **Stan Observatorium Ruang** – menampilkan tata surya mini dengan matahari, planet, ISS, roket, meteoroid, dan lainnya.
- **Stan Cyberpunk** – menampilkan kota futuristik dengan model GLTF high‑poly, layar video, dan portal teleportasi.

Semua aset, shader, audio, dan komponen UI dikelola sebagai ES module di dalam `js/modules/`. Aplikasi ini berjalan murni di browser – tidak memerlukan kode sisi server.

## Struktur Folder
```
syzlab/
├─ css/                     # Styling (glassmorphism UI, HUD, crosshair)
├─ js/
│   ├─ app.js               # Titik masuk, inisialisasi & loop render
│   ├─ components.js        # Komponen A‑Frame khusus (dipakai di scene2.html)
│   ├─ modules/             # Kode modular ES
│   │   ├─ state.js          # Manajemen state global
│   │   ├─ physics.js        # Fisika pemain, kolisi & bola lempar
│   │   ├─ interactivity.js  # Ray‑caster dan penanganan klik
│   │   ├─ ui.js             # Binding UI, modal, HUD
│   │   ├─ media.js          # Setup audio & video
│   │   ├─ gallery.js        # Arsitektur dunia (dinding, lantai, lengkungan)
│   │   ├─ booth1_ar.js      # Implementasi stan AR Card
│   │   ├─ booth2_space.js   # Implementasi stan Observatorium Ruang
│   │   ├─ booth3_cyber.js   # Implementasi stan Cyberpunk
│   │   ├─ collectibles.js   # Sistem koleksi kristal & poin
│   │   ├─ parkour.js        # Mekanik parkour (pad lompat)
│   │   └─ panorama.js       # Halaman panorama 360° terpisah
│   └─ jsm/                 # Modul Three.js (GLTFLoader, Octree, …)
├─ assets/                  # Model 3D, tekstur, audio, video
├─ index.html               # Halaman utama, memuat app.js via ES modules
├─ scene2.html              # Halaman A‑Frame 360° panorama
├─ ar-live.html             # Halaman WebAR sederhana (AR.js + A‑Frame)
└─ README.md                # Dokumentasi proyek (bahasa Indonesia)
```

## Prasyarat
- **Node.js** (untuk menjalankan server statis, contoh: `npx serve`).
- Browser modern dengan dukungan WebGL 2.

## Kontrol
| Aksi                     | Tombol / Mouse                        |
|--------------------------|---------------------------------------|
| Gerak maju/mundur        | `W` / `S`                             |
| Gerak menyamping         | `A` / `D`                             |
| Lompat                   | `Space`                               |
| Lempar bola              | Klik kiri (bukan pada hotspot)        |
| Interaksi / Buka modal   | Arahkan ke objek interaktif lalu klik kiri |
| Kunci pointer            | Klik pada kanvas (klik pertama)      |
| Lepas kunci pointer      | `Esc` (atau klik di luar kanvas)      |

## Kustomisasi
- Tambahkan atau ubah modul stan (`booth1_ar.js`, `booth2_space.js`, `booth3_cyber.js`) untuk menambah geometri, animasi, atau interaksi baru.
- Sesuaikan UI di `js/modules/ui.js` untuk mengubah elemen HUD atau menambah menu.
- Letakkan tekstur atau model tambahan di `assets/` dan referensikan pada modul yang relevan.

Selamat menjelajahi Syzlab!
