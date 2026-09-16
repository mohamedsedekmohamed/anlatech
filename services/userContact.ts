import api from './api';
import { AxiosResponse } from 'axios';

export const contactuser = {
    postcontact: (data: any): Promise<AxiosResponse> => api.post('/user/contact', data),


};
