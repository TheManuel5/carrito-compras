/**
 * Obtener o crear carrito para usuario autenticado o sesión
 */
export declare const obtenerCarrito: (usuarioId?: number, sessionId?: string) => Promise<{
    items: ({
        producto: {
            imagenes: {
                created_at: Date;
                id: number;
                url: string;
                es_principal: boolean;
                orden: number;
                producto_id: number;
                alt: string | null;
            }[];
            stock: {
                updated_at: Date;
                id: number;
                producto_id: number;
                cantidad: number;
                cantidad_min: number;
                cantidad_reservada: number;
            } | null;
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
        };
    } & {
        created_at: Date;
        updated_at: Date;
        id: number;
        producto_id: number;
        cantidad: number;
        carrito_id: number;
        precio: import("@prisma/client/runtime/library").Decimal;
    })[];
} & {
    created_at: Date;
    updated_at: Date;
    id: number;
    usuario_id: number | null;
    estado: string;
    session_id: string | null;
    expires_at: Date | null;
}>;
/**
 * Agregar item al carrito
 */
export declare const agregarItem: (carritoId: number, productoId: number, cantidad: number) => Promise<{
    created_at: Date;
    updated_at: Date;
    id: number;
    producto_id: number;
    cantidad: number;
    carrito_id: number;
    precio: import("@prisma/client/runtime/library").Decimal;
}>;
/**
 * Actualizar cantidad de un item
 */
export declare const actualizarItem: (carritoId: number, itemId: number, cantidad: number) => Promise<{
    created_at: Date;
    updated_at: Date;
    id: number;
    producto_id: number;
    cantidad: number;
    carrito_id: number;
    precio: import("@prisma/client/runtime/library").Decimal;
}>;
/**
 * Eliminar item del carrito
 */
export declare const eliminarItem: (carritoId: number, itemId: number) => Promise<{
    created_at: Date;
    updated_at: Date;
    id: number;
    producto_id: number;
    cantidad: number;
    carrito_id: number;
    precio: import("@prisma/client/runtime/library").Decimal;
}>;
/**
 * Vaciar carrito
 */
export declare const vaciarCarrito: (carritoId: number) => Promise<import(".prisma/client").Prisma.BatchPayload>;
/**
 * Merge carrito de sesión con carrito de usuario al hacer login
 */
export declare const mergearCarritos: (usuarioId: number, sessionId: string) => Promise<void>;
/**
 * Calcular totales del carrito
 */
export declare const calcularTotales: (items: any[]) => {
    subtotal: number;
    igv: number;
    total: number;
    cantidad_items: any;
};
//# sourceMappingURL=carrito.service.d.ts.map