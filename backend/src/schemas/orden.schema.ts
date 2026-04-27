import { z } from 'zod';

export const crearOrdenSchema = z.object({
  carrito_id: z.number().int().positive().optional(),
  items: z.array(z.object({
    producto_id: z.number().int().positive(),
    cantidad: z.number().int().positive(),
    precio_unitario: z.number().positive(),
  })).optional(),
  direccion_envio_id: z.number().int().positive().optional(),
  direccion_envio: z.object({
    nombre: z.string(),
    apellido: z.string(),
    direccion: z.string(),
    ciudad: z.string(),
    departamento: z.string(),
    telefono: z.string(),
    codigo_postal: z.string().optional(),
  }).optional(),
  metodo_envio_id: z.number().int().positive(),
  metodo_pago: z.enum(['stripe', 'transferencia', 'contra_entrega']),
  codigo_cupon: z.string().optional(),
  notas: z.string().max(500).optional(),
  subtotal: z.number().optional(),
  igv: z.number().optional(),
  costo_envio: z.number().optional(),
  total: z.number().optional(),
});

export const filtroOrdenSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  estado: z.string().optional(),
  fecha_inicio: z.string().datetime().optional(),
  fecha_fin: z.string().datetime().optional(),
  usuario_id: z.coerce.number().int().positive().optional(),
  monto_min: z.coerce.number().nonnegative().optional(),
  monto_max: z.coerce.number().nonnegative().optional(),
  search: z.string().optional(),
});

export const cambiarEstadoOrdenSchema = z.object({
  estado: z.enum(['pendiente_pago', 'pagada', 'en_proceso', 'enviada', 'entregada', 'cancelada', 'devuelta']),
  comentario: z.string().optional(),
  numero_tracking: z.string().optional(),
});

export type CrearOrdenInput = z.infer<typeof crearOrdenSchema>;
export type FiltroOrden = z.infer<typeof filtroOrdenSchema>;