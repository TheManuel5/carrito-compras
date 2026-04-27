import prisma from '../config/prisma';
import { AppError } from '../middlewares/errorHandler';
import { config } from '../config';

/**
 * Obtener o crear carrito para usuario autenticado o sesión
 */
export const obtenerCarrito = async (usuarioId?: number, sessionId?: string) => {
  const where = usuarioId ? { usuario_id: usuarioId, estado: 'activo' } : { session_id: sessionId, estado: 'activo' };
  let carrito = await prisma.ord_carritos.findFirst({
    where,
    include: {
      items: {
        include: {
          producto: {
            include: {
              imagenes: { where: { es_principal: true }, take: 1 },
              stock: true,
            },
          },
        },
      },
    },
  });

  if (!carrito) {
    carrito = await prisma.ord_carritos.create({
      data: usuarioId ? { usuario_id: usuarioId } : { session_id: sessionId },
      include: {
        items: {
          include: {
            producto: {
              include: {
                imagenes: { where: { es_principal: true }, take: 1 },
                stock: true,
              },
            },
          },
        },
      },
    });
  }

  return carrito;
};

/**
 * Agregar item al carrito
 */
export const agregarItem = async (carritoId: number, productoId: number, cantidad: number) => {
  const producto = await prisma.cat_productos.findUnique({
    where: { id: productoId, activo: true, estado: 'activo' },
    include: { stock: true },
  });

  if (!producto) throw new AppError('Producto no disponible', 404);

  const stockDisponible = (producto.stock?.cantidad || 0) - (producto.stock?.cantidad_reservada || 0);
  if (stockDisponible < cantidad) {
    throw new AppError(`Stock insuficiente. Disponible: ${stockDisponible}`, 409);
  }

  const itemExistente = await prisma.ord_items_carrito.findUnique({
    where: { carrito_id_producto_id: { carrito_id: carritoId, producto_id: productoId } },
  });

  if (itemExistente) {
    const nuevaCantidad = itemExistente.cantidad + cantidad;
    if (stockDisponible < nuevaCantidad) {
      throw new AppError(`Stock insuficiente. Disponible: ${stockDisponible}`, 409);
    }
    return prisma.ord_items_carrito.update({
      where: { id: itemExistente.id },
      data: { cantidad: nuevaCantidad },
    });
  }

  return prisma.ord_items_carrito.create({
    data: {
      carrito_id: carritoId,
      producto_id: productoId,
      cantidad,
      precio: producto.precio_oferta || producto.precio_venta,
    },
  });
};

/**
 * Actualizar cantidad de un item
 */
export const actualizarItem = async (carritoId: number, itemId: number, cantidad: number) => {
  const item = await prisma.ord_items_carrito.findFirst({
    where: { id: itemId, carrito_id: carritoId },
    include: { producto: { include: { stock: true } } },
  });

  if (!item) throw new AppError('Item no encontrado en el carrito', 404);

  const stockDisponible = (item.producto.stock?.cantidad || 0) - (item.producto.stock?.cantidad_reservada || 0);
  if (stockDisponible < cantidad) {
    throw new AppError(`Stock insuficiente. Disponible: ${stockDisponible}`, 409);
  }

  return prisma.ord_items_carrito.update({
    where: { id: itemId },
    data: { cantidad },
  });
};

/**
 * Eliminar item del carrito
 */
export const eliminarItem = async (carritoId: number, itemId: number) => {
  const item = await prisma.ord_items_carrito.findFirst({
    where: { id: itemId, carrito_id: carritoId },
  });

  if (!item) throw new AppError('Item no encontrado', 404);
  return prisma.ord_items_carrito.delete({ where: { id: itemId } });
};

/**
 * Vaciar carrito
 */
export const vaciarCarrito = async (carritoId: number) => {
  return prisma.ord_items_carrito.deleteMany({ where: { carrito_id: carritoId } });
};

/**
 * Merge carrito de sesión con carrito de usuario al hacer login
 */
export const mergearCarritos = async (usuarioId: number, sessionId: string) => {
  const carritoSesion = await prisma.ord_carritos.findFirst({
    where: { session_id: sessionId, estado: 'activo' },
    include: { items: true },
  });

  if (!carritoSesion || carritoSesion.items.length === 0) return;

  const carritoUsuario = await obtenerCarrito(usuarioId);

  for (const item of carritoSesion.items) {
    try {
      await agregarItem(carritoUsuario.id, item.producto_id, item.cantidad);
    } catch {
      // Si no hay stock suficiente, omitir ese item en el merge
    }
  }

  // Eliminar carrito de sesión
  await prisma.ord_carritos.update({
    where: { id: carritoSesion.id },
    data: { estado: 'mergeado' },
  });
};

/**
 * Calcular totales del carrito
 */
export const calcularTotales = (items: any[]) => {
  const subtotal = items.reduce((acc, item) => acc + Number(item.precio) * item.cantidad, 0);
  const igv = subtotal * config.igvPorcentaje;
  const total = subtotal + igv;
  return {
    subtotal: Math.round(subtotal * 100) / 100,
    igv: Math.round(igv * 100) / 100,
    total: Math.round(total * 100) / 100,
    cantidad_items: items.reduce((acc, item) => acc + item.cantidad, 0),
  };
};
