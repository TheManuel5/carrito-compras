"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filtroProductoSchema = exports.productoSchema = void 0;
const zod_1 = require("zod");
exports.productoSchema = zod_1.z.object({
    sku: zod_1.z.string().min(1).max(50),
    nombre: zod_1.z.string().min(2).max(255),
    descripcion_corta: zod_1.z.string().max(500).optional(),
    descripcion_larga: zod_1.z.string().optional(),
    categoria_id: zod_1.z.number().int().positive(),
    subcategoria_id: zod_1.z.number().int().positive().optional().nullable(),
    marca_id: zod_1.z.number().int().positive().optional().nullable(),
    unidad_medida_id: zod_1.z.number().int().positive().optional().nullable(),
    precio_costo: zod_1.z.number().nonnegative(),
    precio_venta: zod_1.z.number().positive(),
    precio_oferta: zod_1.z.number().nonnegative().optional().nullable(),
    fecha_inicio_oferta: zod_1.z.string().datetime().optional().nullable(),
    fecha_fin_oferta: zod_1.z.string().datetime().optional().nullable(),
    peso: zod_1.z.number().nonnegative().optional().nullable(),
    alto: zod_1.z.number().nonnegative().optional().nullable(),
    ancho: zod_1.z.number().nonnegative().optional().nullable(),
    largo: zod_1.z.number().nonnegative().optional().nullable(),
    estado: zod_1.z.enum(['activo', 'inactivo', 'borrador']).default('activo'),
    destacado: zod_1.z.boolean().default(false),
    nuevo: zod_1.z.boolean().default(false),
    stock_inicial: zod_1.z.number().int().nonnegative().optional(),
    stock_minimo: zod_1.z.number().int().nonnegative().optional(),
    imagenes: zod_1.z.array(zod_1.z.object({
        url: zod_1.z.string().url(),
        es_principal: zod_1.z.boolean().optional(),
        orden: zod_1.z.number().int().optional(),
    })).optional(),
});
exports.filtroProductoSchema = zod_1.z.object({
    page: zod_1.z.coerce.number().int().positive().default(1),
    limit: zod_1.z.coerce.number().int().positive().max(48).default(12),
    search: zod_1.z.string().optional(),
    categoria_id: zod_1.z.coerce.number().int().positive().optional(),
    subcategoria_id: zod_1.z.coerce.number().int().positive().optional(),
    marca_id: zod_1.z.coerce.number().int().positive().optional(),
    precio_min: zod_1.z.coerce.number().nonnegative().optional(),
    precio_max: zod_1.z.coerce.number().nonnegative().optional(),
    estado: zod_1.z.enum(['activo', 'inactivo', 'borrador', 'todos']).default('activo'),
    destacado: zod_1.z.coerce.boolean().optional(),
    nuevo: zod_1.z.coerce.boolean().optional(),
    orderBy: zod_1.z.enum(['nombre', 'precio_venta', 'created_at', 'popularidad']).default('created_at'),
    order: zod_1.z.enum(['asc', 'desc']).default('desc'),
});
//# sourceMappingURL=producto.schema.js.map