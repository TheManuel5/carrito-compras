import { Response, NextFunction } from 'express';
import * as ordenService from '../services/orden.service';
import { crearOrdenSchema, filtroOrdenSchema, cambiarEstadoOrdenSchema } from '../schemas/orden.schema';
import * as pdfGenerator from '../utils/pdfGenerator';
import { AuthenticatedRequest } from '../types';

export const ordenController = {
  async listar(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const filtros = filtroOrdenSchema.parse(req.query);
      const esCliente = req.user?.roles.includes('cliente') && !req.user?.roles.includes('administrador');
      const resultado = await ordenService.listarOrdenes(filtros, esCliente ? req.user?.userId : undefined);
      res.json({ success: true, ...resultado });
    } catch (error) { next(error); }
  },

  async obtener(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const esCliente = req.user?.roles.includes('cliente') && !req.user?.roles.includes('administrador');
      const orden = await ordenService.obtenerOrden(parseInt(req.params.id), esCliente ? req.user?.userId : undefined);
      res.json({ success: true, data: orden });
    } catch (error) { next(error); }
  },

  async crear(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const data = crearOrdenSchema.parse(req.body);
      const orden = await ordenService.crearOrden(req.user!.userId, data);
      res.status(201).json({ success: true, data: orden, message: 'Orden creada exitosamente' });
    } catch (error) { next(error); }
  },

  async cambiarEstado(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { estado, comentario, numero_tracking } = cambiarEstadoOrdenSchema.parse(req.body);
      const orden = await ordenService.cambiarEstadoOrden(
        parseInt(req.params.id), estado, comentario, numero_tracking, req.user?.userId
      );
      res.json({ success: true, data: orden, message: `Estado actualizado a: ${estado}` });
    } catch (error) { next(error); }
  },

  async descargarFactura(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const esCliente = req.user?.roles.includes('cliente') && !req.user?.roles.includes('administrador');
      const orden = await ordenService.obtenerOrden(parseInt(req.params.id), esCliente ? req.user?.userId : undefined);
      await pdfGenerator.generarFactura(orden, res);
    } catch (error) { next(error); }
  },
};
