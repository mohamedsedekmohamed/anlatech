//https://anlatech.mazoom.online/api/admin/partners

import api from './api';
import { AxiosResponse } from 'axios';

export const partnersAdmin = {
  getPartners: (
    locale: string,
    params?: { page?: number; search?: string; active?: boolean }
  ): Promise<AxiosResponse> => api.get('/admin/partners', {
    headers: {
      "Accept-Language": locale,
    },
    params,
  }),

  getonePartners: (id: string | number, locale: string): Promise<AxiosResponse> => api.get(`/admin/partners/${id}`, {
    headers: {
      "Accept-Language": locale,
    },
  }),

  addPartners: (data: FormData): Promise<AxiosResponse> => api.post('/admin/partners', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),

  updatePartners: (id: string | number, data: FormData): Promise<AxiosResponse> => api.post(`/admin/partners/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  statusPartners: (id: string | number, active: boolean):
    Promise<AxiosResponse> => api.post(`/admin/partners/${id}/change-status`, { active }),

  deletePartners: (id: string | number): Promise<AxiosResponse> => api.delete(`/admin/partners/${id}`),
};