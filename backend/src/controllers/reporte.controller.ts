import { Request, Response, NextFunction } from 'express';
import * as reporteService from '../services/reporte.service';
import * as pdfGenerator from '../utils/pdfGenerator';
import prisma from '../config/prisma';

export const reporteController = {
  async kpis(req: Request, res: Response, next: NextFunction) {
    try {
      const { fecha_inicio, fecha_fin } = req.query;
      const kpis = await reporteService.obtenerKpis(
        fecha_inicio ? new Date(fecha_inicio as string) : undefined,
        fecha_fin ? new Date(fecha_fin as string) : undefined
      );
      res.json({ success: true, data: kpis });
    } catch (error) { next(error); }
  },

  async graficos(req: Request, res: Response, next: NextFunction) {
    try {
      const periodo = (req.query.periodo as 'dia' | 'semana' | 'mes') || 'mes';
      const datos = await reporteService.obtenerDatosGraficos(periodo);
      res.json({ success: true, data: datos });
    } catch (error) { next(error); }
  },

  async analisisABC(req: Request, res: Response, next: NextFunction) {
    try {
      const datos = await reporteService.analisisABC();
      res.json({ success: true, data: datos });
    } catch (error) { next(error); }
  },

  async analisisRFM(req: Request, res: Response, next: NextFunction) {
    try {
      const datos = await reporteService.analisisRFM();
      res.json({ success: true, data: datos });
    } catch (error) { next(error); }
  },

  async pdfOrdenes(req: Request, res: Response, next: NextFunction) {
    try {
      const { fecha_inicio, fecha_fin, estado } = req.query;
      const where: any = {};
      if (fecha_inicio) where.created_at = { ...where.created_at, gte: new Date(fecha_inicio as string) };
      if (fecha_fin) where.created_at = { ...where.created_at, lte: new Date(fecha_fin as string) };
      if (estado) where.estado = estado;

      const ordenes = await prisma.ord_ordenes.findMany({
        where,
        include: {
          items: true,
          usuario: { select: { nombre: true, apellido: true, email: true } },
        },
        orderBy: { created_at: 'desc' },
        take: 500,
      });

      const filtros = [
        fecha_inicio ? `Desde: ${fecha_inicio}` : '',
        fecha_fin ? `Hasta: ${fecha_fin}` : '',
        estado ? `Estado: ${estado}` : '',
      ].filter(Boolean).join(' | ');

      await pdfGenerator.generarReporteOrdenes(ordenes, res, filtros);
    } catch (error) { next(error); }
  },

  async pdfInventario(req: Request, res: Response, next: NextFunction) {
    try {
      const productos = await prisma.cat_productos.findMany({
        where: { activo: true },
        include: {
          categoria: { select: { nombre: true } },
          stock: true,
        },
        orderBy: { categoria_id: 'asc' },
      });
      await pdfGenerator.generarReporteInventario(productos, res);
    } catch (error) { next(error); }
  },
};
