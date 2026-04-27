"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const orden_controller_1 = require("../controllers/orden.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const rbac_middleware_1 = require("../middlewares/rbac.middleware");
const router = (0, express_1.Router)();
router.get('/', auth_middleware_1.authMiddleware, orden_controller_1.ordenController.listar);
router.get('/:id', auth_middleware_1.authMiddleware, orden_controller_1.ordenController.obtener);
router.post('/', auth_middleware_1.authMiddleware, orden_controller_1.ordenController.crear);
router.patch('/:id/estado', auth_middleware_1.authMiddleware, (0, rbac_middleware_1.requireRole)('administrador', 'gerente_ventas', 'vendedor'), orden_controller_1.ordenController.cambiarEstado);
router.get('/:id/factura', auth_middleware_1.authMiddleware, orden_controller_1.ordenController.descargarFactura);
exports.default = router;
//# sourceMappingURL=orden.routes.js.map