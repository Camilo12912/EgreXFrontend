import api from '../../../services/api';
import AlumniRepository from '../../domain/alumni/AlumniRepository';

/**
 * Implementation of AlumniRepository using the axios API client.
 * Infrastructure Layer.
 */
export default class AlumniApiRepository extends AlumniRepository {
    async getAlumniList(filters = {}) {
        const response = await api.get('/admin/users', { params: filters });
        return response.data;
    }

    async getVerifiedAlumni() {
        const response = await api.getVerifiedUsers();
        return response.data;
    }

    async getRecentAlumni() {
        const response = await api.getRecentUsers();
        return response.data;
    }

    async createAlumni(alumniData) {
        const response = await api.post('/admin/users', alumniData);
        return response.data;
    }

    async getDashboardMetrics() {
        const response = await api.get('/admin/metrics');
        return response.data;
    }

    async uploadExcel(formData) {
        const response = await api.post('/admin/upload-excel', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    }

    async deleteAlumni(userId) {
        const response = await api.delete(`/admin/users/${userId}`);
        return response.data;
    }

    async bulkDeleteAlumni(userIds) {
        const response = await api.post('/admin/users/bulk-delete', { userIds });
        return response.data;
    }
}
