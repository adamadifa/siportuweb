#!/bin/bash

# Pastikan script berhenti jika terjadi error
set -e

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
