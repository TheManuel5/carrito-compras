import { Router } from 'express';
import { ordenController } from '../controllers/orden.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/rbac.middleware';

const router = Router();
router.get('/', authMiddleware, ordenController.listar);
router.get('/:id', authMiddleware, ordenController.obtener);
router.post('/', authMiddleware, ordenController.crear);
router.patch('/:id/estado', authMiddleware, requireRole('administrador', 'gerente_ventas', 'vendedor'), ordenController.cambiarEstado);
router.get('/:id/factura', authMiddleware, ordenController.descargarFactura);
export default router;
