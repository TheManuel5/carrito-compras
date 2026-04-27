import { z } from 'zod';

export const productoSchema = z.object({
  sku: z.string().min(1).max(50),
  nombre: z.string().min(2).max(255),
  descripcion_corta: z.string().max(500).optional(),
  descripcion_larga: z.string().optional(),
  categoria_id: z.number().int().positive(),
  subcategoria_id: z.number().int().positive().optional().nullable(),
  marca_id: z.number().int().positive().optional().nullable(),
  unidad_medida_id: z.number().int().positive().optional().nullable(),
  precio_costo: z.number().nonnegative(),
  precio_venta: z.number().positive(),
  precio_oferta: z.number().nonnegative().optional().nullable(),
  fecha_inicio_oferta: z.string().datetime().optional().nullable(),
  fecha_fin_oferta: z.string().datetime().optional().nullable(),
  peso: z.number().nonnegative().optional().nullable(),
  alto: z.number().nonnegative().optional().nullable(),
  ancho: z.number().nonnegative().optional().nullable(),
  largo: z.number().nonnegative().optional().nullable(),
  estado: z.enum(['activo', 'inactivo', 'borrador']).default('activo'),
  destacado: z.boolean().default(false),
  nuevo: z.boolean().default(false),
  stock_inicial: z.number().int().nonnegative().optional(),
  stock_minimo: z.number().int().nonnegative().optional(),
  imagenes: z.array(
  z.object({
    url: z.string().url(),
    es_principal: z.boolean().optional(),
    orden: z.number().int().optional(),
  })
).optional(),
});

export const filtroProductoSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(48).default(12),
  search: z.string().optional(),
  categoria_id: z.coerce.number().int().positive().optional(),
  subcategoria_id: z.coerce.number().int().positive().optional(),
  marca_id: z.coerce.number().int().positive().optional(),
  precio_min: z.coerce.number().nonnegative().optional(),
  precio_max: z.coerce.number().nonnegative().optional(),
  estado: z.enum(['activo', 'inactivo', 'borrador', 'todos']).default('activo'),
  destacado: z.coerce.boolean().optional(),
  nuevo: z.coerce.boolean().optional(),
  orderBy: z.enum(['nombre', 'precio_venta', 'created_at', 'popularidad']).default('created_at'),
  order: z.enum(['asc', 'desc']).default('desc'),
});

export type ProductoInput = z.infer<typeof productoSchema>;
export type FiltroProducto = z.infer<typeof filtroProductoSchema>;
