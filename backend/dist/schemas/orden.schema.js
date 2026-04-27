"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cambiarEstadoOrdenSchema = exports.filtroOrdenSchema = exports.crearOrdenSchema = void 0;
const zod_1 = require("zod");
exports.crearOrdenSchema = zod_1.z.object({
    carrito_id: zod_1.z.number().int().positive().optional(),
    items: zod_1.z.array(zod_1.z.object({
        producto_id: zod_1.z.number().int().positive(),
        cantidad: zod_1.z.number().int().positive(),
        precio_unitario: zod_1.z.number().positive(),
    })).optional(),
    direccion_envio_id: zod_1.z.number().int().positive().optional(),
    direccion_envio: zod_1.z.object({
        nombre: zod_1.z.string(),
        apellido: zod_1.z.string(),
        direccion: zod_1.z.string(),
        ciudad: zod_1.z.string(),
        departamento: zod_1.z.string(),
        telefono: zod_1.z.string(),
        codigo_postal: zod_1.z.string().optional(),
    }).optional(),
    metodo_envio_id: zod_1.z.number().int().positive(),
    metodo_pago: zod_1.z.enum(['stripe', 'transferencia', 'contra_entrega']),
    codigo_cupon: zod_1.z.string().optional(),
    notas: zod_1.z.string().max(500).optional(),
    subtotal: zod_1.z.number().optional(),
    igv: zod_1.z.number().optional(),
    costo_envio: zod_1.z.number().optional(),
    total: zod_1.z.number().optional(),
});
exports.filtroOrdenSchema = zod_1.z.object({
    page: zod_1.z.coerce.number().int().positive().default(1),
    limit: zod_1.z.coerce.number().int().positive().max(100).default(20),
    estado: zod_1.z.string().optional(),
    fecha_inicio: zod_1.z.string().datetime().optional(),
    fecha_fin: zod_1.z.string().datetime().optional(),
    usuario_id: zod_1.z.coerce.number().int().positive().optional(),
    monto_min: zod_1.z.coerce.number().nonnegative().optional(),
    monto_max: zod_1.z.coerce.number().nonnegative().optional(),
    search: zod_1.z.string().optional(),
});
exports.cambiarEstadoOrdenSchema = zod_1.z.object({
    estado: zod_1.z.enum(['pendiente_pago', 'pagada', 'en_proceso', 'enviada', 'entregada', 'cancelada', 'devuelta']),
    comentario: zod_1.z.string().optional(),
    numero_tracking: zod_1.z.string().optional(),
});
//# sourceMappingURL=orden.schema.js.map