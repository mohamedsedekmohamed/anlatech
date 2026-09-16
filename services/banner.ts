//https://anlatech.mazoom.online/api/admin/banners
import { updateMotionValuesFromProps } from 'framer-motion';
import api from './api';
import { AxiosResponse } from 'axios';

export const bannersAdmin = {
  getBanners: (
    locale: string,
    params?: { page?: number; search?: string; active?: boolean }
  ): Promise<AxiosResponse> => api.get('/admin/banners', {
    headers: {
      "Accept-Language": locale,
    },
    params,
  }),

  getBanner: (id: string | number, locale: string): Promise<AxiosResponse> => api.get(`/admin/banners/${id}`, {
    headers: {
      "Accept-Language": locale,
    },
  }),
  //https://anlatech.mazoom.online/api/admin/banners/{id}/change-status
  updatestatus: (id: string | number, active: boolean): Promise<AxiosResponse> => api.post(`/admin/banners/${id}/change-status`, { active }),
  addBanner: (data: any): Promise<AxiosResponse> => api.post('/admin/banners', data),
  updateBanner: (id: string | number, data: any): Promise<AxiosResponse> => api.post(`/admin/banners/${id}`, data),
  deleteBanner: (id: string | number): Promise<AxiosResponse> => api.delete(`/admin/banners/${id}`),
};
