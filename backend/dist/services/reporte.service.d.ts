/**
 * Estadísticas para el Dashboard
 */
export declare const obtenerKpis: (fechaInicio?: Date, fechaFin?: Date) => Promise<{
    ventas_totales: number;
    cantidad_ordenes: number;
    ticket_promedio: number;
    tasa_conversion: number;
    tasa_abandono_carrito: number;
    productos_agotados: number;
    productos_stock_bajo: number;
    clientes_nuevos: number;
    ordenes_pendientes: number;
    distribucion_estados: (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.Ord_ordenesGroupByOutputType, "estado"[]> & {
        _count: {
            id: number;
        };
    })[];
    ingresos_por_categoria: unknown;
}>;
/**
 * Datos para gráficos del dashboard
 */
export declare const obtenerDatosGraficos: (periodo?: "dia" | "semana" | "mes") => Promise<{
    ventasPorFecha: unknown;
    topProductos: unknown;
    ventasPorCategoria: unknown;
}>;
/**
 * Análisis ABC de productos
 */
export declare const analisisABC: () => Promise<any[]>;
/**
 * Análisis RFM de clientes
 */
export declare const analisisRFM: () => Promise<any[]>;
//# sourceMappingURL=reporte.service.d.ts.map