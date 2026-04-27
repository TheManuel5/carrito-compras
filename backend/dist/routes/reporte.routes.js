"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const reporte_controller_1 = require("../controllers/reporte.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const rbac_middleware_1 = require("../middlewares/rbac.middleware");
const requireGerente = (0, rbac_middleware_1.requireRole)('administrador', 'gerente_ventas', 'gerente_inventario');
const router = (0, express_1.Router)();
router.get('/kpis', auth_middleware_1.authMiddleware, requireGerente, reporte_controller_1.reporteController.kpis);
router.get('/graficos', auth_middleware_1.authMiddleware, requireGerente, reporte_controller_1.reporteController.graficos);
router.get('/abc', auth_middleware_1.authMiddleware, requireGerente, reporte_controller_1.reporteController.analisisABC);
router.get('/rfm', auth_middleware_1.authMiddleware, requireGerente, reporte_controller_1.reporteController.analisisRFM);
router.get('/pdf/ordenes', auth_middleware_1.authMiddleware, requireGerente, reporte_controller_1.reporteController.pdfOrdenes);
router.get('/pdf/inventario', auth_middleware_1.authMiddleware, requireGerente, reporte_controller_1.reporteController.pdfInventario);
exports.default = router;
//# sourceMappingURL=reporte.routes.js.map