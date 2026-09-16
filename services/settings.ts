import api from './api';
import { AxiosResponse } from 'axios';

export const settingsAdmin = {
    getSettings: (locale: string): Promise<AxiosResponse> =>
        api.get('/admin/settings', {
            headers: {
                "Accept-Language": locale,
            },
        }),
    updateSettings: (locale: string, data: any | FormData): Promise<AxiosResponse> =>
        api.post('/admin/settings', data, {
            headers: {
                "Accept-Language": locale,
                ...(data instanceof FormData ? { "Content-Type": "multipart/form-data" } : {})
            },
        }),
}
