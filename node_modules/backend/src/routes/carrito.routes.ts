// carrito.routes.ts
import { Router } from 'express';
import { carritoController } from '../controllers/carrito.controller';
import { optionalAuthMiddleware } from '../middlewares/auth.middleware';

const router = Router();
router.get('/', optionalAuthMiddleware, carritoController.obtener);
router.post('/items', optionalAuthMiddleware, carritoController.agregarItem);
router.put('/items/:itemId', optionalAuthMiddleware, carritoController.actualizarItem);
router.delete('/items/:itemId', optionalAuthMiddleware, carritoController.eliminarItem);
router.delete('/', optionalAuthMiddleware, carritoController.vaciar);
export default router;