import { z } from 'zod';
export declare const crearOrdenSchema: z.ZodObject<{
    carrito_id: z.ZodOptional<z.ZodNumber>;
    items: z.ZodOptional<z.ZodArray<z.ZodObject<{
        producto_id: z.ZodNumber;
        cantidad: z.ZodNumber;
        precio_unitario: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        producto_id: number;
        cantidad: number;
        precio_unitario: number;
    }, {
        producto_id: number;
        cantidad: number;
        precio_unitario: number;
    }>, "many">>;
    direccion_envio_id: z.ZodOptional<z.ZodNumber>;
    direccion_envio: z.ZodOptional<z.ZodObject<{
        nombre: z.ZodString;
        apellido: z.ZodString;
        direccion: z.ZodString;
        ciudad: z.ZodString;
        departamento: z.ZodString;
        telefono: z.ZodString;
        codigo_postal: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        nombre: string;
        apellido: string;
        telefono: string;
        direccion: string;
        ciudad: string;
        departamento: string;
        codigo_postal?: string | undefined;
    }, {
        nombre: string;
        apellido: string;
        telefono: string;
        direccion: string;
        ciudad: string;
        departamento: string;
        codigo_postal?: string | undefined;
    }>>;
    metodo_envio_id: z.ZodNumber;
    metodo_pago: z.ZodEnum<["stripe", "transferencia", "contra_entrega"]>;
    codigo_cupon: z.ZodOptional<z.ZodString>;
    notas: z.ZodOptional<z.ZodString>;
    subtotal: z.ZodOptional<z.ZodNumber>;
    igv: z.ZodOptional<z.ZodNumber>;
    costo_envio: z.ZodOptional<z.ZodNumber>;
    total: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    metodo_envio_id: number;
    metodo_pago: "stripe" | "transferencia" | "contra_entrega";
    total?: number | undefined;
    items?: {
        producto_id: number;
        cantidad: number;
        precio_unitario: number;
    }[] | undefined;
    carrito_id?: number | undefined;
    direccion_envio_id?: number | undefined;
    direccion_envio?: {
        nombre: string;
        apellido: string;
        telefono: string;
        direccion: string;
        ciudad: string;
        departamento: string;
        codigo_postal?: string | undefined;
    } | undefined;
    codigo_cupon?: string | undefined;
    notas?: string | undefined;
    subtotal?: number | undefined;
    igv?: number | undefined;
    costo_envio?: number | undefined;
}, {
    metodo_envio_id: number;
    metodo_pago: "stripe" | "transferencia" | "contra_entrega";
    total?: number | undefined;
    items?: {
        producto_id: number;
        cantidad: number;
        precio_unitario: number;
    }[] | undefined;
    carrito_id?: number | undefined;
    direccion_envio_id?: number | undefined;
    direccion_envio?: {
        nombre: string;
        apellido: string;
        telefono: string;
        direccion: string;
        ciudad: string;
        departamento: string;
        codigo_postal?: string | undefined;
    } | undefined;
    codigo_cupon?: string | undefined;
    notas?: string | undefined;
    subtotal?: number | undefined;
    igv?: number | undefined;
    costo_envio?: number | undefined;
}>;
export declare const filtroOrdenSchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
    estado: z.ZodOptional<z.ZodString>;
    fecha_inicio: z.ZodOptional<z.ZodString>;
    fecha_fin: z.ZodOptional<z.ZodString>;
    usuario_id: z.ZodOptional<z.ZodNumber>;
    monto_min: z.ZodOptional<z.ZodNumber>;
    monto_max: z.ZodOptional<z.ZodNumber>;
    search: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    page: number;
    limit: number;
    search?: string | undefined;
    usuario_id?: number | undefined;
    estado?: string | undefined;
    fecha_inicio?: string | undefined;
    fecha_fin?: string | undefined;
    monto_min?: number | undefined;
    monto_max?: number | undefined;
}, {
    search?: string | undefined;
    usuario_id?: number | undefined;
    estado?: string | undefined;
    page?: number | undefined;
    limit?: number | undefined;
    fecha_inicio?: string | undefined;
    fecha_fin?: string | undefined;
    monto_min?: number | undefined;
    monto_max?: number | undefined;
}>;
export declare const cambiarEstadoOrdenSchema: z.ZodObject<{
    estado: z.ZodEnum<["pendiente_pago", "pagada", "en_proceso", "enviada", "entregada", "cancelada", "devuelta"]>;
    comentario: z.ZodOptional<z.ZodString>;
    numero_tracking: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    estado: "pendiente_pago" | "pagada" | "en_proceso" | "enviada" | "entregada" | "cancelada" | "devuelta";
    comentario?: string | undefined;
    numero_tracking?: string | undefined;
}, {
    estado: "pendiente_pago" | "pagada" | "en_proceso" | "enviada" | "entregada" | "cancelada" | "devuelta";
    comentario?: string | undefined;
    numero_tracking?: string | undefined;
}>;
export type CrearOrdenInput = z.infer<typeof crearOrdenSchema>;
export type FiltroOrden = z.infer<typeof filtroOrdenSchema>;
//# sourceMappingURL=orden.schema.d.ts.map