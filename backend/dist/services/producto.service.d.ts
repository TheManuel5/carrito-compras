import { ProductoInput, FiltroProducto } from '../schemas/producto.schema';
/**
 * Obtener listado de productos con filtros y paginación
 */
export declare const listarProductos: (filtros: FiltroProducto) => Promise<{
    data: ({
        imagenes: {
            created_at: Date;
            id: number;
            url: string;
            es_principal: boolean;
            orden: number;
            producto_id: number;
            alt: string | null;
        }[];
        categoria: {
            nombre: string;
            id: number;
        };
        marca: {
            nombre: string;
            id: number;
        } | null;
        stock: {
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
    })[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}>;
/**
 * Obtener producto por ID con todos los detalles
 */
export declare const obtenerProducto: (id: number) => Promise<{
    resenas: ({
        cliente: {
            usuario: {
                nombre: string;
                apellido: string;
            };
        } & {
            activo: boolean;
            created_at: Date;
            updated_at: Date;
            id: number;
            usuario_id: number;
            dni: string | null;
            fecha_nacimiento: Date | null;
            genero: string | null;
            total_compras: import("@prisma/client/runtime/library").Decimal;
            num_ordenes: number;
            ultima_compra: Date | null;
            segmento: string;
        };
    } & {
        created_at: Date;
        updated_at: Date;
        id: number;
        producto_id: number;
        aprobada: boolean;
        comentario: string | null;
        cliente_id: number;
        calificacion: number;
        titulo: string | null;
    })[];
    imagenes: {
        created_at: Date;
        id: number;
        url: string;
        es_principal: boolean;
        orden: number;
        producto_id: number;
        alt: string | null;
    }[];
    categoria: {
        nombre: string;
        activo: boolean;
        created_at: Date;
        updated_at: Date;
        id: number;
        descripcion: string | null;
        imagen_url: string | null;
    };
    subcategoria: {
        nombre: string;
        activo: boolean;
        created_at: Date;
        updated_at: Date;
        id: number;
        descripcion: string | null;
        categoria_id: number;
        imagen_url: string | null;
    } | null;
    marca: {
        nombre: string;
        activo: boolean;
        created_at: Date;
        updated_at: Date;
        id: number;
        descripcion: string | null;
        logo_url: string | null;
    } | null;
    unidad_medida: {
        nombre: string;
        created_at: Date;
        id: number;
        simbolo: string;
    } | null;
    atributos: ({
        valor_atributo: {
            atributo: {
                nombre: string;
                created_at: Date;
                id: number;
                tipo: string;
            };
        } & {
            created_at: Date;
            id: number;
            atributo_id: number;
            valor: string;
        };
    } & {
        created_at: Date;
        id: number;
        producto_id: number;
        valor_atributo_id: number;
    })[];
    etiquetas: ({
        etiqueta: {
            nombre: string;
            created_at: Date;
            id: number;
            color: string | null;
        };
    } & {
        created_at: Date;
        id: number;
        producto_id: number;
        etiqueta_id: number;
    })[];
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
}>;
/**
 * Crear nuevo producto
 */
export declare const crearProducto: (data: ProductoInput, usuarioId: number) => Promise<{
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
}>;
/**
 * Actualizar producto existente
 */
export declare const actualizarProducto: (id: number, data: any, usuarioId: number) => Promise<{
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
}>;
/**
 * Eliminar producto (baja lógica)
 */
export declare const eliminarProducto: (id: number) => Promise<{
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
}>;
/**
 * Productos destacados y nuevos para la home
 */
export declare const productosDestacados: () => Promise<{
    destacados: ({
        imagenes: {
            created_at: Date;
            id: number;
            url: string;
            es_principal: boolean;
            orden: number;
            producto_id: number;
            alt: string | null;
        }[];
        categoria: {
            nombre: string;
        };
        stock: {
            cantidad: number;
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
    })[];
    nuevos: ({
        imagenes: {
            created_at: Date;
            id: number;
            url: string;
            es_principal: boolean;
            orden: number;
            producto_id: number;
            alt: string | null;
        }[];
        categoria: {
            nombre: string;
        };
        stock: {
            cantidad: number;
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
    })[];
    ofertas: ({
        imagenes: {
            created_at: Date;
            id: number;
            url: string;
            es_principal: boolean;
            orden: number;
            producto_id: number;
            alt: string | null;
        }[];
        categoria: {
            nombre: string;
        };
        stock: {
            cantidad: number;
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
    })[];
}>;
//# sourceMappingURL=producto.service.d.ts.map