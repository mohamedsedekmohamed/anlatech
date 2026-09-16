import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import Cookies from "js-cookie";
import { MdAcUnit } from 'react-icons/md';
const BASE_URL: string = 'https://anlatech.mazoom.online/api/';
// ─── Axios Instance ──────────────────────────────────────────────────────────
const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
});

// Inject token automatically
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {

    if (typeof window !== "undefined") {
      const isAdminRoute = config.url?.startsWith('/admin');
      const isUserRoute = config.url?.startsWith('/user');

      let token = null;
      if (isAdminRoute) {
        token = Cookies.get("admin_token");
      } else if (isUserRoute) {
        token = Cookies.get("user_token");
      } else {
        token = Cookies.get("admin_token") || Cookies.get("user_token");
      }

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  }
);

// Handle 401 responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        Cookies.remove("admin_token");
        Cookies.remove("user_token");
        // Do not redirect if already on the login page to avoid reload loop and losing error messages
        if (!window.location.pathname.includes('/login')) {
          const locale = window.location.pathname.split('/')[1] || 'en';
          window.location.href = `/${locale}/auth/login`;
        }
      }
    }
    return Promise.reject(error);
  }
);

// ─── Common Types ────────────────────────────────────────────────────────────
export interface PaginationParams {
  pageNumber?: number;
  pageSize?: number;
}

export interface DateRangeParams {
  startDate: string;
  endDate: string;
}
export default api;
