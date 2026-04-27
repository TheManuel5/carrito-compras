// ============ CARRITO CONTROLLER ============
import { Response, NextFunction } from 'express';
import * as carritoService from '../services/carrito.service';
import { AuthenticatedRequest } from '../types';

export const carritoController = {
  async obtener(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const sessionId = req.headers['x-session-id'] as string;
      const carrito = await carritoService.obtenerCarrito(req.user?.userId, sessionId);
      const totales = carritoService.calcularTotales(carrito.items);
      res.json({ success: true, data: { ...carrito, ...totales } });
    } catch (error) { next(error); }
  },

  async agregarItem(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const sessionId = req.headers['x-session-id'] as string;
      const carrito = await carritoService.obtenerCarrito(req.user?.userId, sessionId);
      const { producto_id, cantidad } = req.body;
      const item = await carritoService.agregarItem(carrito.id, parseInt(producto_id), parseInt(cantidad) || 1);
      res.status(201).json({ success: true, data: item, message: 'Producto agregado al carrito' });
    } catch (error) { next(error); }
  },

  async actualizarItem(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const sessionId = req.headers['x-session-id'] as string;
      const carrito = await carritoService.obtenerCarrito(req.user?.userId, sessionId);
      const item = await carritoService.actualizarItem(carrito.id, parseInt(req.params.itemId), parseInt(req.body.cantidad));
      res.json({ success: true, data: item, message: 'Cantidad actualizada' });
    } catch (error) { next(error); }
  },

  async eliminarItem(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const sessionId = req.headers['x-session-id'] as string;
      const carrito = await carritoService.obtenerCarrito(req.user?.userId, sessionId);
      await carritoService.eliminarItem(carrito.id, parseInt(req.params.itemId));
      res.json({ success: true, message: 'Item eliminado del carrito' });
    } catch (error) { next(error); }
  },

  async vaciar(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const sessionId = req.headers['x-session-id'] as string;
      const carrito = await carritoService.obtenerCarrito(req.user?.userId, sessionId);
      await carritoService.vaciarCarrito(carrito.id);
      res.json({ success: true, message: 'Carrito vaciado' });
    } catch (error) { next(error); }
  },
};
