import api from './api';
import { AxiosResponse } from 'axios';

export const adminsAdmin = {
  getAdmins: (
    locale: string,
    params?: { page?: number; search?: string; active?: boolean }
  ): Promise<AxiosResponse> =>
    api.get('/admin/admins', {
      headers: {
        "Accept-Language": locale,
      },
      params,
    }),

  getAdmin: (
    id: string | number,
    locale: string
  ): Promise<AxiosResponse> =>
    api.get(`/admin/admins/${id}`, {
      headers: {
        "Accept-Language": locale,
      },
    }),

  addAdmin: (data: any): Promise<AxiosResponse> =>
    api.post('/admin/admins', data),

  updateAdmin: (id: string | number, data: any): Promise<AxiosResponse> =>
    api.post(`/admin/admins/${id}`, data),

  deleteAdmin: (id: string | number): Promise<AxiosResponse> =>
    api.delete(`/admin/admins/${id}`),

  changeAdminStatus: (id: string | number, active: boolean): Promise<AxiosResponse> =>
    api.post(`/admin/admins/${id}/change-status`, { active }),
};
