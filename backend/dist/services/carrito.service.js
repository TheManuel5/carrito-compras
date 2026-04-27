"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.calcularTotales = exports.mergearCarritos = exports.vaciarCarrito = exports.eliminarItem = exports.actualizarItem = exports.agregarItem = exports.obtenerCarrito = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const errorHandler_1 = require("../middlewares/errorHandler");
const config_1 = require("../config");
/**
 * Obtener o crear carrito para usuario autenticado o sesión
 */
const obtenerCarrito = async (usuarioId, sessionId) => {
    const where = usuarioId ? { usuario_id: usuarioId, estado: 'activo' } : { session_id: sessionId, estado: 'activo' };
    let carrito = await prisma_1.default.ord_carritos.findFirst({
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
        carrito = await prisma_1.default.ord_carritos.create({
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
exports.obtenerCarrito = obtenerCarrito;
/**
 * Agregar item al carrito
 */
const agregarItem = async (carritoId, productoId, cantidad) => {
    const producto = await prisma_1.default.cat_productos.findUnique({
        where: { id: productoId, activo: true, estado: 'activo' },
        include: { stock: true },
    });
    if (!producto)
        throw new errorHandler_1.AppError('Producto no disponible', 404);
    const stockDisponible = (producto.stock?.cantidad || 0) - (producto.stock?.cantidad_reservada || 0);
    if (stockDisponible < cantidad) {
        throw new errorHandler_1.AppError(`Stock insuficiente. Disponible: ${stockDisponible}`, 409);
    }
    const itemExistente = await prisma_1.default.ord_items_carrito.findUnique({
        where: { carrito_id_producto_id: { carrito_id: carritoId, producto_id: productoId } },
    });
    if (itemExistente) {
        const nuevaCantidad = itemExistente.cantidad + cantidad;
        if (stockDisponible < nuevaCantidad) {
            throw new errorHandler_1.AppError(`Stock insuficiente. Disponible: ${stockDisponible}`, 409);
        }
        return prisma_1.default.ord_items_carrito.update({
            where: { id: itemExistente.id },
            data: { cantidad: nuevaCantidad },
        });
    }
    return prisma_1.default.ord_items_carrito.create({
        data: {
            carrito_id: carritoId,
            producto_id: productoId,
            cantidad,
            precio: producto.precio_oferta || producto.precio_venta,
        },
    });
};
exports.agregarItem = agregarItem;
/**
 * Actualizar cantidad de un item
 */
const actualizarItem = async (carritoId, itemId, cantidad) => {
    const item = await prisma_1.default.ord_items_carrito.findFirst({
        where: { id: itemId, carrito_id: carritoId },
        include: { producto: { include: { stock: true } } },
    });
    if (!item)
        throw new errorHandler_1.AppError('Item no encontrado en el carrito', 404);
    const stockDisponible = (item.producto.stock?.cantidad || 0) - (item.producto.stock?.cantidad_reservada || 0);
    if (stockDisponible < cantidad) {
        throw new errorHandler_1.AppError(`Stock insuficiente. Disponible: ${stockDisponible}`, 409);
    }
    return prisma_1.default.ord_items_carrito.update({
        where: { id: itemId },
        data: { cantidad },
    });
};
exports.actualizarItem = actualizarItem;
/**
 * Eliminar item del carrito
 */
const eliminarItem = async (carritoId, itemId) => {
    const item = await prisma_1.default.ord_items_carrito.findFirst({
        where: { id: itemId, carrito_id: carritoId },
    });
    if (!item)
        throw new errorHandler_1.AppError('Item no encontrado', 404);
    return prisma_1.default.ord_items_carrito.delete({ where: { id: itemId } });
};
exports.eliminarItem = eliminarItem;
/**
 * Vaciar carrito
 */
const vaciarCarrito = async (carritoId) => {
    return prisma_1.default.ord_items_carrito.deleteMany({ where: { carrito_id: carritoId } });
};
exports.vaciarCarrito = vaciarCarrito;
/**
 * Merge carrito de sesión con carrito de usuario al hacer login
 */
const mergearCarritos = async (usuarioId, sessionId) => {
    const carritoSesion = await prisma_1.default.ord_carritos.findFirst({
        where: { session_id: sessionId, estado: 'activo' },
        include: { items: true },
    });
    if (!carritoSesion || carritoSesion.items.length === 0)
        return;
    const carritoUsuario = await (0, exports.obtenerCarrito)(usuarioId);
    for (const item of carritoSesion.items) {
        try {
            await (0, exports.agregarItem)(carritoUsuario.id, item.producto_id, item.cantidad);
        }
        catch {
            // Si no hay stock suficiente, omitir ese item en el merge
        }
    }
    // Eliminar carrito de sesión
    await prisma_1.default.ord_carritos.update({
        where: { id: carritoSesion.id },
        data: { estado: 'mergeado' },
    });
};
exports.mergearCarritos = mergearCarritos;
/**
 * Calcular totales del carrito
 */
const calcularTotales = (items) => {
    const subtotal = items.reduce((acc, item) => acc + Number(item.precio) * item.cantidad, 0);
    const igv = subtotal * config_1.config.igvPorcentaje;
    const total = subtotal + igv;
    return {
        subtotal: Math.round(subtotal * 100) / 100,
        igv: Math.round(igv * 100) / 100,
        total: Math.round(total * 100) / 100,
        cantidad_items: items.reduce((acc, item) => acc + item.cantidad, 0),
    };
};
exports.calcularTotales = calcularTotales;
//# sourceMappingURL=carrito.service.js.map