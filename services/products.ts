import api from './api';
import { AxiosResponse } from 'axios';

export const productsAdmin = {
  getProducts: (
    locale: string,
    params?: { page?: number; search?: string; status?: number }
  ): Promise<AxiosResponse> =>
    api.get('/admin/products', {
      params: { ...params, local: locale },
    }),

  getProduct: (id: string | number, locale: string): Promise<AxiosResponse> =>
    api.get(`/admin/products/${id}`, {
      params: { local: locale },
    }),

  addProduct: (data: FormData): Promise<AxiosResponse> =>
    api.post('/admin/products', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  updateProduct: (id: string | number, data: FormData): Promise<AxiosResponse> =>
    api.post(`/admin/products/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  addGallery: (id: string | number, data: FormData): Promise<AxiosResponse> =>
    api.post(`/admin/products/${id}/gallery`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  deleteGalleryImage: (id: string | number): Promise<AxiosResponse> =>
    api.delete(`/admin/products/gallery/${id}`),

  addVariation: (productId: string | number, data: any): Promise<AxiosResponse> =>
    api.post(`/admin/products/${productId}/variations`, data),

  deleteVariation: (id: string | number): Promise<AxiosResponse> =>
    api.delete(`/admin/products/variations/${id}`),

  addOption: (variationId: string | number, data: any): Promise<AxiosResponse> =>
    api.post(`/admin/products/variations/${variationId}/options`, data),

  deleteOption: (id: string | number): Promise<AxiosResponse> =>
    api.delete(`/admin/products/options/${id}`),

  changeProductStatus: (id: string | number, status: boolean): Promise<AxiosResponse> =>
    api.post(`/admin/products/${id}/change-status`, { status: status ? '1' : '0' }),

  deleteProduct: (id: string | number): Promise<AxiosResponse> =>
    api.delete(`/admin/products/${id}`),
};

export const productsUser = {
  getProducts: (locale: string, category_id: number, page: number = 1 ,parent:boolean): Promise<AxiosResponse> =>
    api.get('/user/home/products', {
      params: { local: locale, category_id, page, parent: parent ? 1 : 0 },
    }),
  getProductDetails: (id: string, locale: string): Promise<AxiosResponse> =>
    api.get(`/user/home/product/${id}`, {
      params: { local: locale },
    }),
};
