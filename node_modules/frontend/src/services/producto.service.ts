import api from './api';

export const productoService = {
  async listar(params?: Record<string, any>) {
    const res = await api.get('/productos', { params });
    return res.data;
  },

  async obtener(id: number) {
    const res = await api.get(`/productos/${id}`);
    return res.data.data;
  },

  async destacados() {
    const res = await api.get('/productos/destacados');
    return res.data.data;
  },

  crear: async (data: any) => {
    const res = await api.post('/productos', data);
    return res.data;
  },

  actualizar: async (id: number, data: any) => {
    const res = await api.put(`/productos/${id}`, data);
    return res.data;
  },

  async eliminar(id: number) {
    const res = await api.delete(`/productos/${id}`);
    return res.data;
  },
  

  async categorias() {
    const res = await api.get('/categorias');
    return res.data.data;
  },

  async marcas() {
    const res = await api.get('/marcas');
    return res.data.data;
  },
};
