import api from './api';
import { AxiosResponse } from 'axios';

export const subCategoriesAdmin = {
    getSubCategoriesList: ():
     Promise<AxiosResponse> => api.get('/admin/sub-categories/list'),
    getSubCategories: ( locale: string,
    params?: { page?: number; search?: string; active?: boolean }): 
    Promise<AxiosResponse> => api.get('/admin/sub-categories', {
      headers: {
        "Accept-Language": locale,
      },
      params,
    }),
    getSubCategory: (id: string | number):
     Promise<AxiosResponse> => api.get(`/admin/sub-categories/${id}`),
    addSubCategory: (data: FormData):
     Promise<AxiosResponse> => api.post('/admin/sub-categories', data),
    changeSubCategoryStatus: (id: string | number, active: boolean):
     Promise<AxiosResponse> => api.post(`/admin/sub-categories/${id}/change-status`, { active }),
    updateSubCategory: (id: string | number, data: FormData):
     Promise<AxiosResponse> => api.post(`/admin/sub-categories/${id}`, data),
    deleteSubCategory: (id: string | number):
     Promise<AxiosResponse> => api.delete(`/admin/sub-categories/${id}`),
}
