import { Request, Response, NextFunction } from 'express';
import * as productoService from '../services/producto.service';
import { productoSchema, filtroProductoSchema } from '../schemas/producto.schema';
import { AuthenticatedRequest } from '../types';

export const listar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const filtros = filtroProductoSchema.parse(req.query);
    const resultado = await productoService.listarProductos(filtros);
    res.json({ success: true, ...resultado });
  } catch (error) {
    next(error);
  }
};

export const obtener = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const producto = await productoService.obtenerProducto(parseInt(req.params.id));
    res.json({ success: true, data: producto });
  } catch (error) {
    next(error);
  }
};

export const crear = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = productoSchema.parse(req.body);
    const producto = await productoService.crearProducto(data, req.user!.userId);
    res.status(201).json({ success: true, data: producto, message: 'Producto creado exitosamente' });
  } catch (error) {
    next(error);
  }
};

export const actualizar = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = productoSchema.partial().parse(req.body);
    const producto = await productoService.actualizarProducto(parseInt(req.params.id), data, req.user!.userId);
    res.json({ success: true, data: producto, message: 'Producto actualizado' });
  } catch (error) {
    next(error);
  }
};

export const eliminar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await productoService.eliminarProducto(parseInt(req.params.id));
    res.json({ success: true, message: 'Producto eliminado' });
  } catch (error) {
    next(error);
  }
};

export const destacados = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await productoService.productosDestacados();
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};
