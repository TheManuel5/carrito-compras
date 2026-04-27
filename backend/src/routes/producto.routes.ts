import { Router } from 'express';
import * as productoController from '../controllers/producto.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/rbac.middleware';

const router = Router();

// Públicas
router.get('/', productoController.listar);
router.get('/destacados', productoController.destacados);
router.get('/:id', productoController.obtener);

// Admin / Inventario
router.post('/', authMiddleware, requireRole('administrador', 'gerente_inventario'), productoController.crear);
router.put('/:id', authMiddleware, requireRole('administrador', 'gerente_inventario'), productoController.actualizar);
router.delete('/:id', authMiddleware, requireRole('administrador'), productoController.eliminar);

export default router;
