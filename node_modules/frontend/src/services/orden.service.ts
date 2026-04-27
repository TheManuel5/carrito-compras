import api from './api';

export const ordenService = {
  async listar(params?: Record<string, any>) {
    const res = await api.get('/ordenes', { params });
    return res.data;
  },

  async obtener(id: number) {
    const res = await api.get(`/ordenes/${id}`);
    return res.data.data;
  },

  async crear(data: any) {
    const res = await api.post('/ordenes', data);
    return res.data.data;
  },

  async cambiarEstado(id: number, estado: string, comentario?: string, tracking?: string) {
    const res = await api.patch(`/ordenes/${id}/estado`, { estado, comentario, numero_tracking: tracking });
    return res.data.data;
  },

  facturaUrl: (id: number) => `/api/v1/ordenes/${id}/factura`,
};

export const carritoService = {
  async obtener() {
    const res = await api.get('/carrito');
    return res.data.data;
  },
  async agregarItem(producto_id: number, cantidad: number = 1) {
    const res = await api.post('/carrito/items', { producto_id, cantidad });
    return res.data.data;
  },
  async actualizarItem(itemId: number, cantidad: number) {
    const res = await api.put(`/carrito/items/${itemId}`, { cantidad });
    return res.data.data;
  },
  async eliminarItem(itemId: number) {
    const res = await api.delete(`/carrito/items/${itemId}`);
    return res.data;
  },
  async vaciar() {
    const res = await api.delete('/carrito');
    return res.data;
  },
};

export const reporteService = {
  async kpis(params?: Record<string, any>) {
    const res = await api.get('/reportes/kpis', { params });
    return res.data.data;
  },
  async graficos(periodo?: string) {
    const res = await api.get('/reportes/graficos', { params: { periodo } });
    return res.data.data;
  },
  async analisisABC() {
    const res = await api.get('/reportes/abc');
    return res.data.data;
  },
  async analisisRFM() {
    const res = await api.get('/reportes/rfm');
    return res.data.data;
  },
  pdfOrdenesUrl: () => '/api/v1/reportes/pdf/ordenes',
  pdfInventarioUrl: () => '/api/v1/reportes/pdf/inventario',
};
