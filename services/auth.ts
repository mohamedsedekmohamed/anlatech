import api from './api';
import { AxiosResponse } from 'axios';
import Cookies from 'js-cookie';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  image: string | null;
  role: string;
  phone: string;
  order_count: number;
  order_sum: number;
  created_at: string | null;
  updated_at: string | null;
  image_url: string | null;
}

export interface LoginResponse {
  user: AuthUser | null;
  token: string;
}

export const authService = {
  login: (data: LoginPayload): Promise<AxiosResponse<LoginResponse>> =>
    api.post('/login', data),

  logout: (): Promise<AxiosResponse> =>
    api.post('/logout'),

  saveSession: (token: string, role: string) => {
    const cookieKey = role === 'admin' ? 'admin_token' : 'user_token';
    // For development, don't require secure flag
    const isProduction = process.env.NODE_ENV === 'production';
    Cookies.set(cookieKey, token, { 
      expires: 7, 
      secure: isProduction, 
      sameSite: 'Strict',
      path: '/'
    });
  },

  clearSession: () => {
    Cookies.remove('admin_token');
    Cookies.remove('user_token');
  },

  getToken: (): string | undefined =>
    Cookies.get('admin_token') || Cookies.get('user_token'),
};
