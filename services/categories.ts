import api from './api';
import { AxiosResponse } from 'axios';

export const categoriesAdmin = {
  getCategories: (
    locale: string,
    params?: { page?: number; search?: string; status?: number }
  ): Promise<AxiosResponse> =>
    api.get('/admin/categories', {
      headers: { 'Accept-Language': locale },
      params,
    }),

  getCategoriesList: (locale: string): Promise<AxiosResponse> =>
    api.get('/admin/categories/list', {
      headers: { 'Accept-Language': locale },
    }),

  //
  getSubCategoriesList: (locale: string): Promise<AxiosResponse> =>
    api.get('/admin/sub-categories/sub_list', {
      headers: { 'Accept-Language': locale },
    }),
  getSubCategories: (locale: string): Promise<AxiosResponse> =>
    api.get('admin/sub-categories/list', {
      headers: { 'Accept-Language': locale },
    }),
  //


  getCategory: (id: string | number, locale: string): Promise<AxiosResponse> =>
    api.get(`/admin/categories/${id}`, {
      headers: { 'Accept-Language': locale },
    }),

  // data must be FormData with name[en], name[ar], description[en], description[ar]
  addCategory: (data: FormData): Promise<AxiosResponse> =>
    api.post('/admin/categories', data),

  updateCategory: (id: string | number, data: FormData): Promise<AxiosResponse> =>
    api.post(`/admin/categories/${id}`, data),

  changeCategoryStatus: (id: string | number, status: boolean): Promise<AxiosResponse> =>
    api.post(`/admin/categories/${id}/change-status`, { status: status ? '1' : '0' }),

  deleteCategory: (id: string | number): Promise<AxiosResponse> =>
    api.delete(`/admin/categories/${id}`),
};

export const categoriesUser = {
  getParentCategories: (locale: string, page: number = 1): Promise<AxiosResponse> =>
    api.get('/user/home/parent-categories', {
      params: { local: locale, page },
    }),
  getSubCategories: (locale: string, category_id: number, page: number = 1): Promise<AxiosResponse> =>
    api.get('/user/home/sub-categories', {
      params: { local: locale, category_id, page },
    }),
};
