import api from './api';
import { AxiosResponse } from 'axios';

export const aboutUser = {
    getAbout: (locale: string): Promise<AxiosResponse> => api.get('/user/about', {
      params: { local: locale },
    }),
    getServices: (locale: string): Promise<AxiosResponse> => api.get('/user/services', {
      params: { local: locale },
    }),

};
