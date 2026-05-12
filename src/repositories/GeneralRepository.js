import BaseRepository from './BaseRepository';
import api from '../config/api';

class GeneralRepository extends BaseRepository {
    constructor() {
        super('/public/pengaturan-umum');
    }

    async getSettings() {
        try {
            const response = await api.get(this.endpoint);
            return response.data;
        } catch (error) {
            console.error('Error fetching settings:', error);
            return { status: 'error', data: null };
        }
    }
}

export default new GeneralRepository();
