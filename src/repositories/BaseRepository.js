import api from '../config/api';

class BaseRepository {
    constructor(endpoint) {
        this.endpoint = endpoint;
    }

    async getAll(params = {}) {
        const response = await api.get(this.endpoint, { params });
        return response.data;
    }

    async getById(id) {
        const response = await api.get(`${this.endpoint}/${id}`);
        return response.data;
    }

    async create(data) {
        const response = await api.post(this.endpoint, data);
        return response.data;
    }

    async update(id, data) {
        const response = await api.put(`${this.endpoint}/${id}`, data);
        return response.data;
    }

    async delete(id) {
        const response = await api.delete(`${this.endpoint}/${id}`);
        return response.data;
    }
}

export default BaseRepository;
