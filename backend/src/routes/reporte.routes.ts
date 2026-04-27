import { Router } from 'express';
import { reporteController } from '../controllers/reporte.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/rbac.middleware';

const requireGerente = requireRole('administrador', 'gerente_ventas', 'gerente_inventario');

const router = Router();
router.get('/kpis', authMiddleware, requireGerente, reporteController.kpis);
router.get('/graficos', authMiddleware, requireGerente, reporteController.graficos);
router.get('/abc', authMiddleware, requireGerente, reporteController.analisisABC);
router.get('/rfm', authMiddleware, requireGerente, reporteController.analisisRFM);
router.get('/pdf/ordenes', authMiddleware, requireGerente, reporteController.pdfOrdenes);
router.get('/pdf/inventario', authMiddleware, requireGerente, reporteController.pdfInventario);
export default router;