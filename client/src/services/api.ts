import axios from 'axios';
import { authStorage } from '../auth/storage';

export const api = axios.create({
  baseURL: 'http://localhost:3000',
  // headers: {
  //   'Content-Type': 'application/json',
  // },
});

api.interceptors.request.use(
  (config) => {
    const token = authStorage.getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url;

    if (
      status === 401 &&
      url !== "/login"
    ) {
      authStorage.clear();

      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);