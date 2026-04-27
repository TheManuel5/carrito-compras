export interface Producto {
  id: number;
  sku: string;
  nombre: string;
  descripcion_corta?: string;
  descripcion_larga?: string;
  precio_costo: number;
  precio_venta: number;
  precio_oferta?: number | null;
  fecha_inicio_oferta?: string | null;
  fecha_fin_oferta?: string | null;
  estado: 'activo' | 'inactivo' | 'borrador';
  destacado: boolean;
  nuevo: boolean;
  activo: boolean;
  created_at: string;
  categoria?: { id: number; nombre: string };
  subcategoria?: { id: number; nombre: string };
  marca?: { id: number; nombre: string };
  imagenes?: ImagenProducto[];
  stock?: StockProducto;
}

export interface ImagenProducto {
  id: number;
  url: string;
  alt?: string;
  es_principal: boolean;
  orden: number;
}

export interface StockProducto {
  cantidad: number;
  cantidad_min: number;
  cantidad_reservada: number;
}

export interface Categoria {
  id: number;
  nombre: string;
  descripcion?: string;
  imagen_url?: string;
  subcategorias?: Subcategoria[];
}

export interface Subcategoria {
  id: number;
  categoria_id: number;
  nombre: string;
}

export interface Marca {
  id: number;
  nombre: string;
  logo_url?: string;
}

export interface OrdenItem {
  id: number;
  nombre_producto: string;
  sku: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
  producto?: Producto;
}

export interface Orden {
  id: number;
  numero_orden: string;
  estado: EstadoOrden;
  subtotal: number;
  igv: number;
  costo_envio: number;
  descuento: number;
  total: number;
  codigo_cupon?: string;
  notas?: string;
  numero_tracking?: string;
  created_at: string;
  updated_at: string;
  items?: OrdenItem[];
  pagos?: Pago[];
  usuario?: { nombre: string; apellido: string; email: string };
  direccion_envio?: DireccionEnvio;
  metodo_envio?: MetodoEnvio;
  historial_estados?: HistorialEstado[];
}

export type EstadoOrden =
  | 'pendiente_pago'
  | 'pagada'
  | 'en_proceso'
  | 'enviada'
  | 'entregada'
  | 'cancelada'
  | 'devuelta';

export interface Pago {
  id: number;
  metodo: string;
  estado: string;
  monto: number;
  moneda: string;
}

export interface DireccionEnvio {
  id: number;
  nombre: string;
  apellido: string;
  direccion: string;
  ciudad: string;
  departamento: string;
  codigo_postal?: string;
  telefono: string;
}

export interface MetodoEnvio {
  id: number;
  nombre: string;
  descripcion?: string;
  precio: number;
  dias_estimados: number;
}

export interface HistorialEstado {
  id: number;
  estado: string;
  comentario?: string;
  created_at: string;
}

export interface KpisDashboard {
  ventas_totales: number;
  cantidad_ordenes: number;
  ticket_promedio: number;
  tasa_conversion: number;
  tasa_abandono_carrito: number;
  productos_agotados: number;
  productos_stock_bajo: number;
  clientes_nuevos: number;
  ordenes_pendientes: number;
  distribucion_estados: Array<{ estado: string; _count: { id: number } }>;
  ingresos_por_categoria: Array<{ categoria: string; total_ingresos: number }>;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
