import { CrearOrdenInput, FiltroOrden } from '../schemas/orden.schema';
/**
 * Crear orden - acepta items directos o carrito_id
 */
export declare const crearOrden: (usuarioId: number, data: CrearOrdenInput) => Promise<{
    created_at: Date;
    updated_at: Date;
    id: number;
    usuario_id: number | null;
    estado: string;
    total: import("@prisma/client/runtime/library").Decimal;
    direccion_envio_id: number | null;
    metodo_envio_id: number | null;
    codigo_cupon: string | null;
    notas: string | null;
    subtotal: import("@prisma/client/runtime/library").Decimal;
    igv: import("@prisma/client/runtime/library").Decimal;
    costo_envio: import("@prisma/client/runtime/library").Decimal;
    numero_tracking: string | null;
    numero_orden: string;
    descuento: import("@prisma/client/runtime/library").Decimal;
}>;
/**
 * Listar órdenes con filtros
 */
export declare const listarOrdenes: (filtros: FiltroOrden, usuarioId?: number) => Promise<{
    data: ({
        usuario: {
            email: string;
            nombre: string;
            apellido: string;
        } | null;
        items: {
            id: number;
            sku: string;
            producto_id: number | null;
            cantidad: number;
            precio_unitario: import("@prisma/client/runtime/library").Decimal;
            subtotal: import("@prisma/client/runtime/library").Decimal;
            nombre_producto: string;
            orden_id: number;
        }[];
        pagos: {
            estado: string;
            metodo: string;
        }[];
    } & {
        created_at: Date;
        updated_at: Date;
        id: number;
        usuario_id: number | null;
        estado: string;
        total: import("@prisma/client/runtime/library").Decimal;
        direccion_envio_id: number | null;
        metodo_envio_id: number | null;
        codigo_cupon: string | null;
        notas: string | null;
        subtotal: import("@prisma/client/runtime/library").Decimal;
        igv: import("@prisma/client/runtime/library").Decimal;
        costo_envio: import("@prisma/client/runtime/library").Decimal;
        numero_tracking: string | null;
        numero_orden: string;
        descuento: import("@prisma/client/runtime/library").Decimal;
    })[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}>;
/**
 * Obtener orden por ID
 */
export declare const obtenerOrden: (id: number, usuarioId?: number) => Promise<{
    usuario: {
        email: string;
        nombre: string;
        apellido: string;
    } | null;
    items: ({
        producto: ({
            imagenes: {
                created_at: Date;
                id: number;
                url: string;
                es_principal: boolean;
                orden: number;
                producto_id: number;
                alt: string | null;
            }[];
        } & {
            nombre: string;
            activo: boolean;
            created_at: Date;
            updated_at: Date;
            id: number;
            sku: string;
            descripcion_corta: string | null;
            descripcion_larga: string | null;
            categoria_id: number;
            subcategoria_id: number | null;
            marca_id: number | null;
            unidad_medida_id: number | null;
            precio_costo: import("@prisma/client/runtime/library").Decimal;
            precio_venta: import("@prisma/client/runtime/library").Decimal;
            precio_oferta: import("@prisma/client/runtime/library").Decimal | null;
            fecha_inicio_oferta: Date | null;
            fecha_fin_oferta: Date | null;
            peso: import("@prisma/client/runtime/library").Decimal | null;
            alto: import("@prisma/client/runtime/library").Decimal | null;
            ancho: import("@prisma/client/runtime/library").Decimal | null;
            largo: import("@prisma/client/runtime/library").Decimal | null;
            estado: string;
            destacado: boolean;
            nuevo: boolean;
            created_by: number | null;
            updated_by: number | null;
        }) | null;
    } & {
        id: number;
        sku: string;
        producto_id: number | null;
        cantidad: number;
        precio_unitario: import("@prisma/client/runtime/library").Decimal;
        subtotal: import("@prisma/client/runtime/library").Decimal;
        nombre_producto: string;
        orden_id: number;
    })[];
    direccion_envio: {
        nombre: string;
        apellido: string;
        telefono: string;
        activo: boolean;
        created_at: Date;
        updated_at: Date;
        id: number;
        es_principal: boolean;
        direccion: string;
        ciudad: string;
        departamento: string;
        codigo_postal: string | null;
        cliente_id: number;
    } | null;
    metodo_envio: {
        nombre: string;
        activo: boolean;
        created_at: Date;
        id: number;
        descripcion: string | null;
        precio: import("@prisma/client/runtime/library").Decimal;
        dias_estimados: number;
    } | null;
    pagos: {
        created_at: Date;
        updated_at: Date;
        id: number;
        estado: string;
        orden_id: number;
        metodo: string;
        monto: import("@prisma/client/runtime/library").Decimal;
        moneda: string;
        referencia_ext: string | null;
    }[];
    historial_estados: {
        created_at: Date;
        id: number;
        usuario_id: number | null;
        estado: string;
        comentario: string | null;
        orden_id: number;
        estado_id: number | null;
    }[];
} & {
    created_at: Date;
    updated_at: Date;
    id: number;
    usuario_id: number | null;
    estado: string;
    total: import("@prisma/client/runtime/library").Decimal;
    direccion_envio_id: number | null;
    metodo_envio_id: number | null;
    codigo_cupon: string | null;
    notas: string | null;
    subtotal: import("@prisma/client/runtime/library").Decimal;
    igv: import("@prisma/client/runtime/library").Decimal;
    costo_envio: import("@prisma/client/runtime/library").Decimal;
    numero_tracking: string | null;
    numero_orden: string;
    descuento: import("@prisma/client/runtime/library").Decimal;
}>;
/**
 * Cambiar estado de orden (admin)
 */
export declare const cambiarEstadoOrden: (id: number, estado: string, comentario?: string, tracking?: string, usuarioId?: number) => Promise<{
    created_at: Date;
    updated_at: Date;
    id: number;
    usuario_id: number | null;
    estado: string;
    total: import("@prisma/client/runtime/library").Decimal;
    direccion_envio_id: number | null;
    metodo_envio_id: number | null;
    codigo_cupon: string | null;
    notas: string | null;
    subtotal: import("@prisma/client/runtime/library").Decimal;
    igv: import("@prisma/client/runtime/library").Decimal;
    costo_envio: import("@prisma/client/runtime/library").Decimal;
    numero_tracking: string | null;
    numero_orden: string;
    descuento: import("@prisma/client/runtime/library").Decimal;
}>;
//# sourceMappingURL=orden.service.d.ts.map