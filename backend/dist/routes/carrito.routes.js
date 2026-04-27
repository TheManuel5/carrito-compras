"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// carrito.routes.ts
const express_1 = require("express");
const carrito_controller_1 = require("../controllers/carrito.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.get('/', auth_middleware_1.optionalAuthMiddleware, carrito_controller_1.carritoController.obtener);
router.post('/items', auth_middleware_1.optionalAuthMiddleware, carrito_controller_1.carritoController.agregarItem);
router.put('/items/:itemId', auth_middleware_1.optionalAuthMiddleware, carrito_controller_1.carritoController.actualizarItem);
router.delete('/items/:itemId', auth_middleware_1.optionalAuthMiddleware, carrito_controller_1.carritoController.eliminarItem);
router.delete('/', auth_middleware_1.optionalAuthMiddleware, carrito_controller_1.carritoController.vaciar);
exports.default = router;
//# sourceMappingURL=carrito.routes.js.map