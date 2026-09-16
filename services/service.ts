import api from './api';
import { AxiosResponse } from 'axios';

export const servicesAdmin = {
    getServices: (): Promise<AxiosResponse> => api.get('/admin/services'),
    getService: (id: string | number): Promise<AxiosResponse> => api.get(`/admin/services/${id}`),
    addService: (data: any): Promise<AxiosResponse> => api.post('/admin/services', data),
    updateService: (id: string | number, data: any): Promise<AxiosResponse> => api.post(`/admin/services/${id}`, data),
    deleteService: (id: string | number): Promise<AxiosResponse> => api.delete(`/admin/services/${id}`),
};
