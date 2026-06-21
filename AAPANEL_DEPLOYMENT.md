# Panduan Instalasi & Deploy `siportuweb` di aaPanel

Dokumen ini menjelaskan langkah-langkah untuk melakukan instalasi dan deployment aplikasi React + Vite (`siportuweb`) di **aaPanel**. 

Karena proyek ini menggunakan **Vite & React (Single Page Application / SPA)**, ada dua metode utama yang bisa digunakan:
1. **Metode A (Rekomendasi Utama): Build Static & Deploy via Nginx** (Sangat direkomendasikan karena performa tinggi, efisiensi RAM, dan kecocokan alami dengan SPA).
2. **Metode B: Node.js Project Manager** (Berjalan sebagai service Node.js menggunakan perintah `npm run preview` atau `vite`).

---

## 📋 Persyaratan Awal (Prerequisites)
Sebelum memulai, pastikan service berikut telah terpasang di aaPanel Anda:
1. **Nginx** (Versi 1.20 ke atas).
2. **Node.js Version Manager (NVM)** atau **Node.js** dari App Store aaPanel.
   - Pastikan telah menginstal versi Node.js yang sesuai (direkomendasikan **Node.js v18 atau v20**).

---

## ⚡ Metode A: Build Static & Deploy via Nginx (Sangat Direkomendasikan)
Metode ini adalah *best practice* untuk aplikasi Vite/React. Proyek akan di-build menjadi file HTML, CSS, dan JS statis, lalu disajikan langsung oleh Nginx tanpa memakan resource RAM untuk proses Node.js yang terus berjalan.

### Langkah 1: Persiapan & Build Project
Anda dapat melakukan build secara lokal lalu mengunggahnya, atau melakukan build langsung di server aaPanel:

**Pilihan: Build langsung di server aaPanel**
1. Unggah source code proyek Anda ke direktori server (misal: `/www/wwwroot/siportuweb`), kecualikan folder `node_modules` dan `dist`.
2. Buka terminal aaPanel atau SSH ke server Anda.
3. Masuk ke direktori proyek:
   ```bash
   cd /www/wwwroot/siportuweb
   ```
4. Install dependensi dan jalankan build:
   ```bash
   npm install
   # Jika menggunakan pnpm/yarn, sesuaikan perintahnya
   npm run build
   ```
5. Perintah ini akan menghasilkan folder bernama `/www/wwwroot/siportuweb/dist`.

---

### Langkah 2: Membuat Website di aaPanel
1. Masuk ke dashboard aaPanel -> **Website** -> **HTML/Static** (atau **PHP Project**, lalu atur versi PHP ke *Static*).
2. Klik **Add site**.
3. Isi informasi berikut:
   - **Domain**: Masukkan domain Anda (contoh: `siportu.domainanda.com`).
   - **Document Root**: Arahkan ke folder `dist` hasil build Anda (contoh: `/www/wwwroot/siportuweb/dist`).
4. Klik **Submit**.

---

### Langkah 3: Konfigurasi Nginx untuk React Router (Penting! ⚠️)
Karena aplikasi ini menggunakan `react-router-dom` untuk navigasi, Anda wajib mengonfigurasi Nginx agar tidak memunculkan error *404 Not Found* saat halaman di-refresh.

1. Pada daftar website di aaPanel, klik nama website/domain Anda untuk membuka pengaturan.
2. Pilih menu **URL Rewrite** di panel sebelah kiri.
3. Masukkan kode konfigurasi berikut:
   ```nginx
   location / {
       try_files $uri $uri/ /index.html;
   }
   ```
4. Klik **Save**.

---

## 🟢 Metode B: Menggunakan aaPanel Node Project Manager
Jika Anda tetap ingin menjalankan aplikasi ini sebagai aplikasi Node.js aktif di latar belakang (misal menggunakan perintah `npm run preview`), ikuti langkah-langkah berikut:

### Langkah 1: Unggah Source Code & Install Dependensi
1. Unggah source code Anda ke direktori server (contoh: `/www/wwwroot/siportuweb`).
2. Masuk ke menu **Files** di aaPanel, cari direktori proyek Anda.
3. Buka **Terminal** di aaPanel pada folder tersebut, lalu jalankan:
   ```bash
   npm install
   ```

---

### Langkah 2: Konfigurasi Port & Build
Sebelum menjalankan sebagai Node project, buat file build terlebih dahulu agar perintah `preview` siap digunakan:
```bash
npm run build
```

Secara default, Vite Preview berjalan pada port `4173` atau port custom yang tertera pada konfigurasi Anda. Pastikan port tersebut tidak terpakai oleh aplikasi lain.

---

### Langkah 3: Daftarkan Proyek di Node Project Manager
1. Masuk ke menu **Website** -> tab **Node project**.
2. Klik **Add Node Project**.
3. Isi form dengan detail berikut:
   - **Path**: Pilih folder proyek Anda (`/www/wwwroot/siportuweb`).
   - **Node Version**: Pilih versi Node.js (misal: v20.x.x).
   - **Run command**: Pilih `Custom` atau `npm` lalu masukkan:
     ```bash
     run preview -- --port 4173 --host 0.0.0.0
     ```
     *(Atau jika Anda menggunakan server custom, arahkan ke file script entrypoint-nya)*.
   - **Port**: Isi dengan `4173` (atau port yang Anda tentukan).
   - **Name**: Beri nama bebas (misal: `siportuweb-node`).
4. Klik **Submit**.

---

### Langkah 4: Hubungkan ke Domain (Mapping/Reverse Proxy)
1. Setelah status project Node menyala (**Running**), klik tombol **Web service / Map** di kolom sebelah kanan project Anda.
2. Masukkan nama domain Anda (misal: `siportu.domainanda.com`).
3. aaPanel akan otomatis membuatkan konfigurasi Reverse Proxy dari Nginx ke port Node.js Anda (`http://127.0.0.1:4173`).

---

## ⚙️ Konfigurasi Environment Variables (`.env`)
Pastikan file `.env` di direktori utama proyek sudah disesuaikan dengan environment server produksi Anda.
1. Buat atau edit file `.env` di root direktori proyek.
2. Tambahkan variabel yang dibutuhkan, misalnya:
   ```env
   VITE_API_URL=https://api.sipren.domainanda.com
   ```
3. Jika Anda melakukan perubahan pada file `.env` setelah dideploy:
   - **Untuk Metode A**: Anda harus menjalankan kembali `npm run build` agar perubahan `.env` masuk ke file static hasil build.
   - **Untuk Metode B**: Anda perlu melakukan restart pada Node Project di dashboard aaPanel.

---

## 🚀 Otomatisasi Update Menggunakan Git (Sangat Mudah!)
Untuk Metode A (Web Statis), Anda bisa menggabungkan kekuatan **Git** dan **Simple Bash Script** agar proses update website di server menjadi sangat cepat dan otomatis hanya dengan satu perintah.

### Langkah 1: Hubungkan Folder Server ke Git Repository
1. SSH ke server Anda atau gunakan terminal aaPanel.
2. Masuk ke folder proyek:
   ```bash
   cd /www/wwwroot/siportuweb
   ```
3. Jika belum di-clone menggunakan Git, inisialisasi Git dan hubungkan ke repository GitHub Anda:
   ```bash
   git init
   git remote add origin https://github.com/adamadifa/siportuweb.git
   git fetch
   git checkout -f main
   ```

### Langkah 2: Buat Script Auto-Deploy (`deploy.sh`)
Buat sebuah file script shell di server agar proses pull, install, dan build berjalan dalam satu kali klik/perintah:

1. Di dalam folder `/www/wwwroot/siportuweb`, buat file baru bernama `deploy.sh`.
2. Masukkan script berikut ke dalam `deploy.sh`:
   ```bash
   #!/bin/bash

   echo "============= MEMULAI DEPLOYMENT ============="
   
   # 1. Tarik kode terbaru dari GitHub
   echo "-> Menarik kode terbaru dari Git..."
   git pull origin main

   # 2. Install dependensi baru jika ada perubahan package.json
   echo "-> Memasang/memperbarui dependensi Node.js..."
   npm install

   # 3. Jalankan build produksi
   echo "-> Melakukan build aplikasi..."
   npm run build

   echo "============= DEPLOYMENT SELESAI ============="
   echo "Website Anda telah diperbarui dan langsung live!"
   ```
3. Berikan izin eksekusi pada script tersebut melalui terminal:
   ```bash
   chmod +x deploy.sh
   ```

### Langkah 3: Cara Melakukan Update di Masa Mendatang
Setiap kali Anda selesai melakukan coding di lokal, Anda cukup melakukan:
1. Push kode terbaru Anda ke GitHub seperti biasa:
   ```bash
   git add .
   git commit -m "update: perbaikan fitur X"
   git push origin main
   ```
2. Buka terminal server aaPanel Anda (bisa lewat Web Terminal aaPanel tanpa perlu SSH pihak ketiga), masuk ke folder proyek, dan jalankan script:
   ```bash
   ./deploy.sh
   ```
3. Selesai! Nginx akan langsung menyajikan hasil build terbaru dari folder `dist` secara otomatis tanpa ada *downtime*.

