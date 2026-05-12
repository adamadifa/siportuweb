import BaseRepository from './BaseRepository';
import api from '../config/api';

class StudentRepository extends BaseRepository {
    constructor() {
        super('/siswa');
    }

    async getSiswaAnak() {
        const response = await api.get('/siswa-anak');
        return response.data;
    }

    async getSiswaByNoPendaftaran(no_pendaftaran) {
        const response = await api.get('/siswa-by-idsiswa', {
            params: { no_pendaftaran }
        });
        return response.data;
    }

    async getSiswaById(id_siswa) {
        const response = await api.get('/siswa-by-idsiswa', {
            params: { id_siswa }
        });
        return response.data;
    }

    async getUnitsBySiswa(id_siswa) {
        const response = await api.get('/unit-by-siswa', {
            params: { id_siswa }
        });
        return response.data;
    }

    async getBiayaSiswaByNoPendaftaran(no_pendaftaran) {
        const response = await api.get('/getbiayasiswa-by-nopendaftaran', {
            params: { no_pendaftaran }
        });
        return response.data;
    }

    async getRencanaSppByKodeBiaya(kode_biaya, no_pendaftaran) {
        const response = await api.get('/getrencanaspp-by-kodebiaya', {
            params: { kode_biaya, no_pendaftaran }
        });
        return response.data;
    }

    async getHistoriBayarByIdSiswa(id_siswa) {
        const response = await api.get('/gethistoribayar-by-idsiswa', {
            params: { id_siswa }
        });
        return response.data;
    }

    async getDetailHistoriBayar(no_bukti) {
        const response = await api.get('/getdetailhistoribayar', {
            params: { no_bukti }
        });
        return response.data;
    }

    async getTabunganSantri(id_siswa) {
        const response = await api.get(`/tabungan-santri/${id_siswa}`);
        return response.data;
    }

    async getDetailTabunganSantri(id_siswa, no_rekening) {
        const response = await api.get(`/tabungan-santri/${id_siswa}/rekening/${no_rekening}`);
        return response.data;
    }

    async getPengumumanTerbaru() {
        const response = await api.get('/pengumuman/terbaru');
        return response.data;
    }

    async getDetailPengumuman(id) {
        const response = await api.get(`/pengumuman/${id}`);
        return response.data;
    }

    async getPosts() {
        const response = await api.get('/public/posts/getposthomepage');
        return response.data;
    }

    async getPostBySlug(slug) {
        const response = await api.get(`/public/posts/${slug}`);
        return response.data;
    }

    async getPrestasiSiswa(params = {}) {
        const response = await api.get('/public/prestasi-siswa', { params });
        return response.data;
    }

    async getPresensiHarian(no_pendaftaran, bulan = null, tahun = null) {
        const response = await api.get('/presensi/harian', {
            params: { no_pendaftaran, bulan, tahun }
        });
        return response.data;
    }

    async getPresensiMapel(id_siswa) {
        const response = await api.get('/presensi/mapel', {
            params: { id_siswa }
        });
        return response.data;
    }
}

export default new StudentRepository();
