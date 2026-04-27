import api from './api';
import { useAuthStore } from '../stores/authStore';

export interface LoginData { email: string; password: string; }
export interface RegistroData { email: string; nombre: string; apellido: string; password: string; confirmar_password: string; telefono?: string; }

export const authService = {
  async login(data: LoginData) {
    const res = await api.post('/auth/login', data);
    const { usuario, accessToken, refreshToken } = res.data.data;
    useAuthStore.getState().setAuth(usuario, accessToken, refreshToken);
    return res.data;
  },

  async registro(data: RegistroData) {
    const res = await api.post('/auth/registro', data);
    const { usuario, accessToken, refreshToken } = res.data.data;
    useAuthStore.getState().setAuth(usuario, accessToken, refreshToken);
    return res.data;
  },

  async logout() {
    try { await api.post('/auth/logout'); } catch {}
    useAuthStore.getState().logout();
  },

  async perfil() {
    const res = await api.get('/auth/perfil');
    return res.data.data;
  },
};
