import prisma from '../config/prisma';
import { AppError } from '../middlewares/errorHandler';
import { CrearOrdenInput, FiltroOrden } from '../schemas/orden.schema';
import { config } from '../config';

const generarNumeroOrden = (): string => {
  const fecha = new Date();
  const año = fecha.getFullYear().toString().slice(-2);
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const dia = String(fecha.getDate()).padStart(2, '0');
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `ORD-${año}${mes}${dia}-${random}`;
};
/**
 * Crear orden - acepta items directos o carrito_id
 */
export const crearOrden = async (usuarioId: number, data: CrearOrdenInput) => {
  let itemsParaOrden: Array<{
    producto_id: number;
    nombre: string;
    sku: string;
    cantidad: number;
    precio: number;
  }> = [];

  let carritoId: number | undefined;

  if (data.carrito_id) {
    const carrito = await prisma.ord_carritos.findFirst({
      where: { id: data.carrito_id, usuario_id: usuarioId, estado: 'activo' },
      include: { items: { include: { producto: { include: { stock: true } } } } },
    });
    if (!carrito || carrito.items.length === 0) throw new AppError('Carrito no encontrado o vacío', 404);
    carritoId = carrito.id;
    itemsParaOrden = carrito.items.map((i) => ({
      producto_id: i.producto_id,
      nombre: i.producto.nombre,
      sku: i.producto.sku,
      cantidad: i.cantidad,
      precio: Number(i.precio),
    }));
  } else if (data.items && data.items.length > 0) {
    const productosIds = data.items.map((i) => i.producto_id);
    const productos = await prisma.cat_productos.findMany({
      where: { id: { in: productosIds } },
      include: { stock: true },
    });
    for (const item of data.items) {
      const producto = productos.find((p) => p.id === item.producto_id);
      if (!producto) throw new AppError(`Producto ${item.producto_id} no encontrado`, 404);
      itemsParaOrden.push({
        producto_id: item.producto_id,
        nombre: producto.nombre,
        sku: producto.sku,
        cantidad: item.cantidad,
        precio: item.precio_unitario,
      });
    }
  } else {
    throw new AppError('Debe proporcionar items o carrito_id', 400);
  }

  const metodoEnvio = await prisma.ord_metodos_envio.findUnique({ where: { id: data.metodo_envio_id } });
  if (!metodoEnvio) throw new AppError('Método de envío no disponible', 404);

  const orden = await prisma.$transaction(async (tx) => {
    // Verificar y reservar stock
    for (const item of itemsParaOrden) {
      const stock = await tx.inv_stock_producto.findUnique({ where: { producto_id: item.producto_id } });
      const disponible = (stock?.cantidad || 0) - (stock?.cantidad_reservada || 0);
      if (disponible < item.cantidad) throw new AppError(`Stock insuficiente para: ${item.nombre}`, 409);
      await tx.inv_stock_producto.update({
        where: { producto_id: item.producto_id },
        data: { cantidad_reservada: { increment: item.cantidad } },
      });
    }

    // Calcular totales
    const subtotal = data.subtotal ?? itemsParaOrden.reduce((acc, i) => acc + i.precio * i.cantidad, 0);
    const igv = data.igv ?? subtotal * 0.18;
    const costo_envio = data.costo_envio ?? Number(metodoEnvio.precio);
    const total = data.total ?? subtotal + igv + costo_envio;

    // Guardar dirección inline si viene
    let direccionEnvioId = data.direccion_envio_id;
    if (!direccionEnvioId && data.direccion_envio) {
      const cliente = await tx.cli_clientes.findUnique({ where: { usuario_id: usuarioId } });
      if (cliente) {
        const dir = await tx.cli_direcciones.create({
          data: {
            cliente_id: cliente.id,
            nombre: data.direccion_envio.nombre,
            apellido: data.direccion_envio.apellido,
            direccion: data.direccion_envio.direccion,
            ciudad: data.direccion_envio.ciudad,
            departamento: data.direccion_envio.departamento,
            telefono: data.direccion_envio.telefono,
            codigo_postal: data.direccion_envio.codigo_postal,
          },
        });
        direccionEnvioId = dir.id;
      }
    }

    // Crear orden
    const nuevaOrden = await tx.ord_ordenes.create({
      data: {
        numero_orden: generarNumeroOrden(),
        usuario_id: usuarioId,
        direccion_envio_id: direccionEnvioId,
        metodo_envio_id: data.metodo_envio_id,
        estado: data.metodo_pago === 'contra_entrega' ? 'en_proceso' : 'pendiente_pago',
        subtotal,
        igv,
        costo_envio,
        total,
        codigo_cupon: data.codigo_cupon,
        notas: data.notas,
        items: {
          create: itemsParaOrden.map((item) => ({
            producto_id: item.producto_id,
            nombre_producto: item.nombre,
            sku: item.sku,
            cantidad: item.cantidad,
            precio_unitario: item.precio,
            subtotal: item.precio * item.cantidad,
          })),
        },
      },
    });

    await tx.ord_pagos.create({ data: { orden_id: nuevaOrden.id, metodo: data.metodo_pago, estado: 'pendiente', monto: total } });
    await tx.ord_historial_estados.create({ data: { orden_id: nuevaOrden.id, estado: nuevaOrden.estado, comentario: 'Orden creada', usuario_id: usuarioId } });

    if (carritoId) await tx.ord_carritos.update({ where: { id: carritoId }, data: { estado: 'completado' } });

    await tx.cli_clientes.updateMany({
      where: { usuario_id: usuarioId },
      data: { total_compras: { increment: total }, num_ordenes: { increment: 1 }, ultima_compra: new Date() },
    });

    return nuevaOrden;
  });

  return orden;
};
/**
 * Listar órdenes con filtros
 */
export const listarOrdenes = async (filtros: FiltroOrden, usuarioId?: number) => {
  const { page, limit, estado, fecha_inicio, fecha_fin, monto_min, monto_max, search } = filtros;
  const skip = (page - 1) * limit;

  const where: any = {};
  if (usuarioId) where.usuario_id = usuarioId;
  if (filtros.usuario_id) where.usuario_id = filtros.usuario_id;
  if (estado) where.estado = estado;
  if (fecha_inicio || fecha_fin) {
    where.created_at = {};
    if (fecha_inicio) where.created_at.gte = new Date(fecha_inicio);
    if (fecha_fin) where.created_at.lte = new Date(fecha_fin);
  }
  if (monto_min !== undefined) where.total = { ...where.total, gte: monto_min };
  if (monto_max !== undefined) where.total = { ...where.total, lte: monto_max };
  if (search) where.numero_orden = { contains: search, mode: 'insensitive' };

  const [total, ordenes] = await Promise.all([
    prisma.ord_ordenes.count({ where }),
    prisma.ord_ordenes.findMany({
      where,
      skip,
      take: limit,
      orderBy: { created_at: 'desc' },
      include: {
        items: true,
        pagos: { select: { metodo: true, estado: true } },
        usuario: { select: { nombre: true, apellido: true, email: true } },
      },
    }),
  ]);

  return { data: ordenes, total, page, limit, totalPages: Math.ceil(total / limit) };
};

/**
 * Obtener orden por ID
 */
export const obtenerOrden = async (id: number, usuarioId?: number) => {
  const where: any = { id };
  if (usuarioId) where.usuario_id = usuarioId;

  const orden = await prisma.ord_ordenes.findFirst({
    where,
    include: {
      items: { include: { producto: { include: { imagenes: { where: { es_principal: true }, take: 1 } } } } },
      pagos: true,
      direccion_envio: true,
      metodo_envio: true,
      historial_estados: { orderBy: { created_at: 'desc' } },
      usuario: { select: { nombre: true, apellido: true, email: true } },
    },
  });

  if (!orden) throw new AppError('Orden no encontrada', 404);
  return orden;
};

/**
 * Cambiar estado de orden (admin)
 */
export const cambiarEstadoOrden = async (
  id: number,
  estado: string,
  comentario?: string,
  tracking?: string,
  usuarioId?: number
) => {
  const orden = await prisma.ord_ordenes.findUnique({ where: { id } });
  if (!orden) throw new AppError('Orden no encontrada', 404);

  const ordenActualizada = await prisma.$transaction(async (tx) => {
    const updated = await tx.ord_ordenes.update({
      where: { id },
      data: {
        estado,
        ...(tracking && { numero_tracking: tracking }),
      },
    });

    await tx.ord_historial_estados.create({
      data: {
        orden_id: id,
        estado,
        comentario,
        usuario_id: usuarioId,
      },
    });

    // Si se entrega, descontar stock reservado y reducir stock real
    if (estado === 'entregada') {
      const items = await tx.ord_items_orden.findMany({ where: { orden_id: id } });
      for (const item of items) {
        if (item.producto_id) {
          await tx.inv_stock_producto.updateMany({
            where: { producto_id: item.producto_id },
            data: {
              cantidad: { decrement: item.cantidad },
              cantidad_reservada: { decrement: item.cantidad },
            },
          });
          // Registrar movimiento
          const stockActual = await tx.inv_stock_producto.findUnique({ where: { producto_id: item.producto_id } });
          if (stockActual) {
            await tx.inv_movimientos_inventario.create({
              data: {
                stock_id: stockActual.id,
                tipo: 'salida',
                cantidad: item.cantidad,
                cantidad_antes: stockActual.cantidad + item.cantidad,
                cantidad_despues: stockActual.cantidad,
                motivo: `Venta - Orden ${orden.numero_orden}`,
                referencia_id: id,
                referencia_tipo: 'orden',
                usuario_id: usuarioId,
              },
            });
          }
        }
      }
    }

    // Si se cancela, liberar stock reservado
    if (estado === 'cancelada') {
      const items = await tx.ord_items_orden.findMany({ where: { orden_id: id } });
      for (const item of items) {
        if (item.producto_id) {
          await tx.inv_stock_producto.updateMany({
            where: { producto_id: item.producto_id },
            data: { cantidad_reservada: { decrement: item.cantidad } },
          });
        }
      }
    }

    return updated;
  });

  return ordenActualizada;
};
