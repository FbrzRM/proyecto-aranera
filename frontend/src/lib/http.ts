import axios from "axios";
import { useSession } from "../features/auth/session";

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3000/v1"
});

http.interceptors.request.use((config) => {
  const token = useSession.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useSession.getState().cerrarSesion();
    }
    return Promise.reject(error);
  }
);
