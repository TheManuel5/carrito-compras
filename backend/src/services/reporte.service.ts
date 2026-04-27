import prisma from '../config/prisma';
import { AppError } from '../middlewares/errorHandler';

/**
 * Estadísticas para el Dashboard
 */
export const obtenerKpis = async (fechaInicio?: Date, fechaFin?: Date) => {
  const hoy = new Date();
  const inicio = fechaInicio || new Date(hoy.getFullYear(), hoy.getMonth(), 1);
  const fin = fechaFin || hoy;

  const [
    totalOrdenes,
    totalVentas,
    ordenesEstados,
    productosAgotados,
    productosStockBajo,
    clientesNuevos,
    ordenesPendientes,
    carritosTotales,
    ordenesCompletadas,
    ingresosPorCategoria,
  ] = await Promise.all([
    prisma.ord_ordenes.count({ where: { created_at: { gte: inicio, lte: fin } } }),
    prisma.ord_ordenes.aggregate({
      where: {
        created_at: { gte: inicio, lte: fin },
        estado: { in: ['pagada', 'en_proceso', 'enviada', 'entregada'] },
      },
      _sum: { total: true },
      _avg: { total: true },
    }),
    prisma.ord_ordenes.groupBy({
      by: ['estado'],
      _count: { id: true },
    }),
    prisma.inv_stock_producto.count({ where: { cantidad: 0 } }),
    prisma.inv_stock_producto.count({
      where: { cantidad: { gt: 0 }, AND: [{ cantidad: { lte: prisma.inv_stock_producto.fields.cantidad_min as any } }] },
    }),
    prisma.seg_usuarios.count({ where: { created_at: { gte: inicio, lte: fin } } }),
    prisma.ord_ordenes.count({ where: { estado: 'pendiente_pago' } }),
    prisma.ord_carritos.count({ where: { created_at: { gte: inicio, lte: fin } } }),
    prisma.ord_ordenes.count({
      where: { created_at: { gte: inicio, lte: fin }, estado: { in: ['pagada', 'en_proceso', 'enviada', 'entregada'] } },
    }),
    prisma.$queryRaw`
      SELECT c.nombre as categoria, SUM(io.subtotal) as total_ingresos
      FROM ord_items_orden io
      JOIN cat_productos p ON io.producto_id = p.id
      JOIN cat_categorias c ON p.categoria_id = c.id
      JOIN ord_ordenes o ON io.orden_id = o.id
      WHERE o.created_at BETWEEN ${inicio} AND ${fin}
        AND o.estado IN ('pagada', 'en_proceso', 'enviada', 'entregada')
      GROUP BY c.nombre
      ORDER BY total_ingresos DESC
      LIMIT 5
    `,
  ]);

  const tasaConversion = carritosTotales > 0 ? (ordenesCompletadas / carritosTotales) * 100 : 0;
  const tasaAbandono = carritosTotales > 0 ? ((carritosTotales - ordenesCompletadas) / carritosTotales) * 100 : 0;

  return {
    ventas_totales: Number(totalVentas._sum.total || 0),
    cantidad_ordenes: totalOrdenes,
    ticket_promedio: Number(totalVentas._avg.total || 0),
    tasa_conversion: Math.round(tasaConversion * 100) / 100,
    tasa_abandono_carrito: Math.round(tasaAbandono * 100) / 100,
    productos_agotados: productosAgotados,
    productos_stock_bajo: productosStockBajo,
    clientes_nuevos: clientesNuevos,
    ordenes_pendientes: ordenesPendientes,
    distribucion_estados: ordenesEstados,
    ingresos_por_categoria: ingresosPorCategoria,
  };
};

/**
 * Datos para gráficos del dashboard
 */
export const obtenerDatosGraficos = async (periodo: 'dia' | 'semana' | 'mes' = 'mes') => {
  const fechaLimite = new Date();
  if (periodo === 'dia') fechaLimite.setDate(fechaLimite.getDate() - 30);
  else if (periodo === 'semana') fechaLimite.setDate(fechaLimite.getDate() - 90);
  else fechaLimite.setFullYear(fechaLimite.getFullYear() - 1);

  const [ventasPorFecha, topProductos, ventasPorCategoria] = await Promise.all([
    prisma.$queryRaw`
      SELECT DATE_TRUNC(${periodo}, created_at) as fecha,
             COUNT(*) as cantidad_ordenes,
             SUM(total) as total_ventas
      FROM ord_ordenes
      WHERE created_at >= ${fechaLimite}
        AND estado IN ('pagada', 'en_proceso', 'enviada', 'entregada')
      GROUP BY DATE_TRUNC(${periodo}, created_at)
      ORDER BY fecha ASC
    `,
    prisma.$queryRaw`
      SELECT p.nombre, p.sku, SUM(io.cantidad) as unidades_vendidas, SUM(io.subtotal) as total_ventas
      FROM ord_items_orden io
      JOIN cat_productos p ON io.producto_id = p.id
      JOIN ord_ordenes o ON io.orden_id = o.id
      WHERE o.created_at >= ${fechaLimite}
        AND o.estado IN ('pagada', 'en_proceso', 'enviada', 'entregada')
      GROUP BY p.id, p.nombre, p.sku
      ORDER BY unidades_vendidas DESC
      LIMIT 10
    `,
    prisma.$queryRaw`
      SELECT c.nombre as categoria, SUM(io.subtotal) as total_ventas, COUNT(DISTINCT o.id) as ordenes
      FROM ord_items_orden io
      JOIN cat_productos p ON io.producto_id = p.id
      JOIN cat_categorias c ON p.categoria_id = c.id
      JOIN ord_ordenes o ON io.orden_id = o.id
      WHERE o.created_at >= ${fechaLimite}
        AND o.estado IN ('pagada', 'en_proceso', 'enviada', 'entregada')
      GROUP BY c.nombre
      ORDER BY total_ventas DESC
    `,
  ]);

  return { ventasPorFecha, topProductos, ventasPorCategoria };
};

/**
 * Análisis ABC de productos
 */
export const analisisABC = async () => {
  const productos = await prisma.$queryRaw<any[]>`
    SELECT p.id, p.nombre, p.sku,
           SUM(io.subtotal) as ingresos,
           SUM(io.cantidad) as unidades
    FROM ord_items_orden io
    JOIN cat_productos p ON io.producto_id = p.id
    JOIN ord_ordenes o ON io.orden_id = o.id
    WHERE o.estado IN ('pagada', 'en_proceso', 'enviada', 'entregada')
    GROUP BY p.id, p.nombre, p.sku
    ORDER BY ingresos DESC
  `;

  const totalIngresos = productos.reduce((acc: number, p: any) => acc + Number(p.ingresos), 0);
  let acumulado = 0;

  return productos.map((p: any) => {
    acumulado += Number(p.ingresos);
    const porcentaje = (acumulado / totalIngresos) * 100;
    const clasificacion = porcentaje <= 80 ? 'A' : porcentaje <= 95 ? 'B' : 'C';
    return { ...p, ingresos: Number(p.ingresos), porcentaje_acumulado: porcentaje, clasificacion };
  });
};

/**
 * Análisis RFM de clientes
 */
export const analisisRFM = async () => {
  const clientes = await prisma.$queryRaw<any[]>`
    SELECT
      c.id, u.nombre, u.apellido, u.email,
      MAX(o.created_at) as ultima_compra,
      COUNT(o.id) as frecuencia,
      SUM(o.total) as monetario
    FROM cli_clientes c
    JOIN seg_usuarios u ON c.usuario_id = u.id
    LEFT JOIN ord_ordenes o ON o.usuario_id = u.id
      AND o.estado IN ('pagada', 'en_proceso', 'enviada', 'entregada')
    GROUP BY c.id, u.nombre, u.apellido, u.email
    ORDER BY monetario DESC
  `;

  const hoy = new Date();
  return clientes.map((c: any) => {
    const diasDesdeUltimaCompra = c.ultima_compra
      ? Math.floor((hoy.getTime() - new Date(c.ultima_compra).getTime()) / (1000 * 60 * 60 * 24))
      : 9999;
    const segmento =
      diasDesdeUltimaCompra <= 30 && Number(c.frecuencia) >= 3 ? 'vip' :
      diasDesdeUltimaCompra <= 60 ? 'activo' :
      diasDesdeUltimaCompra <= 180 ? 'en_riesgo' : 'inactivo';

    return {
      ...c,
      dias_desde_ultima_compra: diasDesdeUltimaCompra,
      frecuencia: Number(c.frecuencia),
      monetario: Number(c.monetario),
      segmento,
    };
  });
};
