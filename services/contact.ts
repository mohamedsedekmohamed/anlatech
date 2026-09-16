import api from './api';
import { AxiosResponse } from 'axios';

export const contactAdmin = {
    getContact: (): Promise<AxiosResponse> => api.get('/admin/contact'),
    gethistory: (): Promise<AxiosResponse> => api.get('/admin/contact/history'),
    getread: (id: string|number): Promise<AxiosResponse> => api.get(`/admin/contact/read/${id}`),

};
