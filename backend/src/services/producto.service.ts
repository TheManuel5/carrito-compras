import prisma from '../config/prisma';
import { AppError } from '../middlewares/errorHandler';
import { ProductoInput, FiltroProducto } from '../schemas/producto.schema';

/**
 * Obtener listado de productos con filtros y paginación
 */
export const listarProductos = async (filtros: FiltroProducto) => {
  const { page, limit, search, categoria_id, subcategoria_id, marca_id, precio_min, precio_max,
    estado, destacado, nuevo, orderBy, order } = filtros;

  const skip = (page - 1) * limit;

  const where: any = {};
  if (estado !== 'todos') where.estado = estado;
  if (search) where.OR = [
    { nombre: { contains: search, mode: 'insensitive' } },
    { descripcion_corta: { contains: search, mode: 'insensitive' } },
    { sku: { contains: search, mode: 'insensitive' } },
  ];
  if (categoria_id) where.categoria_id = categoria_id;
  if (subcategoria_id) where.subcategoria_id = subcategoria_id;
  if (marca_id) where.marca_id = marca_id;
  if (precio_min !== undefined || precio_max !== undefined) {
    where.precio_venta = {};
    if (precio_min !== undefined) where.precio_venta.gte = precio_min;
    if (precio_max !== undefined) where.precio_venta.lte = precio_max;
  }
  if (destacado !== undefined) where.destacado = destacado;
  if (nuevo !== undefined) where.nuevo = nuevo;

  const orderByField: any = {};
  if (orderBy === 'popularidad') {
    orderByField.items_orden = { _count: order };
  } else {
    orderByField[orderBy] = order;
  }

  const [total, productos] = await Promise.all([
    prisma.cat_productos.count({ where }),
    prisma.cat_productos.findMany({
      where,
      skip,
      take: limit,
      orderBy: orderByField,
      include: {
        imagenes: { where: { es_principal: true }, take: 1 },
        categoria: { select: { id: true, nombre: true } },
        marca: { select: { id: true, nombre: true } },
        stock: { select: { cantidad: true, cantidad_min: true, cantidad_reservada: true } },
      },
    }),
  ]);

  return {
    data: productos,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

/**
 * Obtener producto por ID con todos los detalles
 */
export const obtenerProducto = async (id: number) => {
  const producto = await prisma.cat_productos.findUnique({
    where: { id },
    include: {
      imagenes: { orderBy: { orden: 'asc' } },
      categoria: true,
      subcategoria: true,
      marca: true,
      unidad_medida: true,
      atributos: { include: { valor_atributo: { include: { atributo: true } } } },
      etiquetas: { include: { etiqueta: true } },
      stock: true,
      resenas: {
        where: { aprobada: true },
        include: {
          cliente: { include: { usuario: { select: { nombre: true, apellido: true } } } },
        },
        orderBy: { created_at: 'desc' },
        take: 10,
      },
    },
  });

  if (!producto) throw new AppError('Producto no encontrado', 404);
  return producto;
};

/**
 * Crear nuevo producto
 */
export const crearProducto = async (data: ProductoInput, usuarioId: number) => {
  const skuExiste = await prisma.cat_productos.findUnique({ where: { sku: data.sku } });
  if (skuExiste) throw new AppError(`SKU '${data.sku}' ya está en uso`, 409);
console.log("DATA:", data);
const { stock_inicial, stock_minimo, imagenes, ...productoData } = data as any;
console.log("IMAGENES:", imagenes);
  const producto = await prisma.$transaction(async (tx) => {
    const nuevo = await tx.cat_productos.create({
      data: {
        ...productoData,
        precio_costo: productoData.precio_costo,
        precio_venta: productoData.precio_venta,
        created_by: usuarioId,
        updated_by: usuarioId,
      },
    });
// ✅ CREAR IMÁGENES
if (imagenes && imagenes.length > 0) {
  await tx.cat_imagenes_producto.createMany({
    data: imagenes.map((img: any) => ({
      producto_id: nuevo.id,
      url: img.url,
      es_principal: img.es_principal ?? true,
      orden: img.orden ?? 1,
    })),
  });
}
    // Crear stock inicial
    await tx.inv_stock_producto.create({
      data: {
        producto_id: nuevo.id,
        cantidad: stock_inicial || 0,
        cantidad_min: stock_minimo || 5,
      },
    });

    return nuevo;
  });

  return producto;
};

/**
 * Actualizar producto existente
 */
export const actualizarProducto = async (id: number, data: any, usuarioId: number) => {
  await obtenerProducto(id);

  if (data.sku) {
    const skuExiste = await prisma.cat_productos.findFirst({
      where: { sku: data.sku, NOT: { id } },
    });
    if (skuExiste) throw new AppError(`SKU '${data.sku}' ya está en uso`, 409);
  }

  const { imagenes, stock_minimo, ...updateData } = data;

  return await prisma.$transaction(async (tx) => {

    // ✅ actualizar producto
    const producto = await tx.cat_productos.update({
      where: { id },
      data: {
        ...updateData,
        updated_by: usuarioId,
      },
    });

    // ✅ manejar imágenes
    if (imagenes) {
      // borrar anteriores
      await tx.cat_imagenes_producto.deleteMany({
        where: { producto_id: id },
      });

      // crear nuevas
      await tx.cat_imagenes_producto.createMany({
        data: imagenes.map((img: any) => ({
          producto_id: id,
          url: img.url,
          es_principal: img.es_principal ?? true,
          orden: img.orden ?? 1,
        })),
      });
    }

    return producto;
  });
};

/**
 * Eliminar producto (baja lógica)
 */
export const eliminarProducto = async (id: number) => {
  await obtenerProducto(id);
  return prisma.cat_productos.update({
    where: { id },
    data: { activo: false, estado: 'inactivo' },
  });
};

/**
 * Productos destacados y nuevos para la home
 */
export const productosDestacados = async () => {
  const [destacados, nuevos, ofertas] = await Promise.all([
    prisma.cat_productos.findMany({
      where: { destacado: true, activo: true, estado: 'activo' },
      take: 8,
      include: {
        imagenes: { where: { es_principal: true }, take: 1 },
        categoria: { select: { nombre: true } },
        stock: { select: { cantidad: true } },
      },
    }),
    prisma.cat_productos.findMany({
      where: { nuevo: true, activo: true, estado: 'activo' },
      take: 8,
      orderBy: { created_at: 'desc' },
      include: {
        imagenes: { where: { es_principal: true }, take: 1 },
        categoria: { select: { nombre: true } },
        stock: { select: { cantidad: true } },
      },
    }),
    prisma.cat_productos.findMany({
      where: { precio_oferta: { not: null }, activo: true, estado: 'activo' },
      take: 8,
      include: {
        imagenes: { where: { es_principal: true }, take: 1 },
        categoria: { select: { nombre: true } },
        stock: { select: { cantidad: true } },
      },
    }),
  ]);

  return { destacados, nuevos, ofertas };
};
