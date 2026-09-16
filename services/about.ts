import api from './api';
import { AxiosResponse } from 'axios';
 
export const aboutAdmin = {

    getAbout: (): Promise<AxiosResponse> => api.get('/admin/about'),

      updateOAbout: (data: FormData): Promise<AxiosResponse> =>
    api.post('/admin/about', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
}
