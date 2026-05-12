import BaseRepository from './BaseRepository';
import api from '../config/api';

class AuthRepository extends BaseRepository {
    constructor() {
        super('/auth');
    }

    async login(credentials) {
        const response = await api.post(`${this.endpoint}/login`, credentials);
        return response.data;
    }

    async register(data) {
        const response = await api.post(`${this.endpoint}/register`, data);
        return response.data;
    }

    async registerOrangtua(data) {
        const response = await api.post('/auth/register-orangtua', data);
        return response.data;
    }

    async logout() {
        const response = await api.post(`${this.endpoint}/logout`);
        return response.data;
    }

    async getProfile() {
        const response = await api.get(`${this.endpoint}/me`);
        return response.data;
    }

    async changePassword(data) {
        const response = await api.post(`${this.endpoint}/change-password`, data);
        return response.data;
    }
}

export default new AuthRepository();
