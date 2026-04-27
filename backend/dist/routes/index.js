"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_1 = __importDefault(require("./auth.routes"));
const producto_routes_1 = __importDefault(require("./producto.routes"));
const carrito_routes_1 = __importDefault(require("./carrito.routes"));
const orden_routes_1 = __importDefault(require("./orden.routes"));
const inventario_routes_1 = __importDefault(require("./inventario.routes"));
const reporte_routes_1 = __importDefault(require("./reporte.routes"));
const prisma_1 = __importDefault(require("../config/prisma"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
const R = express_1.Router;
router.use('/auth', auth_routes_1.default);
router.use('/productos', producto_routes_1.default);
router.use('/carrito', carrito_routes_1.default);
router.use('/ordenes', orden_routes_1.default);
router.use('/inventario', inventario_routes_1.default);
router.use('/reportes', reporte_routes_1.default);
// Categorías
const catRouter = R();
catRouter.get('/', async (_req, res, next) => {
    try {
        const categorias = await prisma_1.default.cat_categorias.findMany({
            where: { activo: true },
            include: { subcategorias: { where: { activo: true } } },
            orderBy: { nombre: 'asc' },
        });
        res.json({ success: true, data: categorias });
    }
    catch (e) {
        next(e);
    }
});
router.use('/categorias', catRouter);
// Marcas
const marcaRouter = R();
marcaRouter.get('/', async (_req, res, next) => {
    try {
        const marcas = await prisma_1.default.cat_marcas.findMany({ where: { activo: true }, orderBy: { nombre: 'asc' } });
        res.json({ success: true, data: marcas });
    }
    catch (e) {
        next(e);
    }
});
router.use('/marcas', marcaRouter);
// Clientes
const clienteRouter = R();
clienteRouter.get('/', auth_middleware_1.authMiddleware, async (req, res, next) => {
    try {
        const { search, limit = '50' } = req.query;
        const where = {};
        if (search) {
            where.usuario = {
                OR: [
                    { nombre: { contains: search, mode: 'insensitive' } },
                    { apellido: { contains: search, mode: 'insensitive' } },
                    { email: { contains: search, mode: 'insensitive' } },
                ],
            };
        }
        const clientes = await prisma_1.default.cli_clientes.findMany({
            where,
            take: parseInt(limit),
            include: { usuario: { select: { nombre: true, apellido: true, email: true } } },
            orderBy: { created_at: 'desc' },
        });
        const total = await prisma_1.default.cli_clientes.count({ where });
        res.json({ success: true, data: clientes, total });
    }
    catch (e) {
        next(e);
    }
});
router.use('/clientes', clienteRouter);
exports.default = router;
//# sourceMappingURL=index.js.map