import api from './api';
import { AxiosResponse } from 'axios';

export const userHome = {
  getFooter: (locale: string): Promise<AxiosResponse> =>
    api.get('/user/footer', {
      params: { local: locale },
    }),
  allProducts: (locale: string, page: number = 1): Promise<AxiosResponse> =>
    api.get('/user/home/all_products', {
      params: { local: locale, page },
    }),
  //https://anlatech.mazoom.online/api/user/home/banners

  getBanners: (locale: string): Promise<AxiosResponse> =>
    api.get('/user/home/banners', {
      params: { local: locale },
    }),

  getPartners: (locale: string): Promise<AxiosResponse> =>
    api.get('/user/home/partners', {
      params: { local: locale },
    }),
};
