import { Router } from 'express';
import authRoutes from './auth.routes';
import productoRoutes from './producto.routes';
import carritoRoutes from './carrito.routes';
import ordenRoutes from './orden.routes';
import inventarioRoutes from './inventario.routes';
import reporteRoutes from './reporte.routes';
import prisma from '../config/prisma';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();
const R = Router;

router.use('/auth', authRoutes);
router.use('/productos', productoRoutes);
router.use('/carrito', carritoRoutes);
router.use('/ordenes', ordenRoutes);
router.use('/inventario', inventarioRoutes);
router.use('/reportes', reporteRoutes);

// Categorías
const catRouter = R();
catRouter.get('/', async (_req, res, next) => {
  try {
    const categorias = await prisma.cat_categorias.findMany({
      where: { activo: true },
      include: { subcategorias: { where: { activo: true } } },
      orderBy: { nombre: 'asc' },
    });
    res.json({ success: true, data: categorias });
  } catch (e) { next(e); }
});
router.use('/categorias', catRouter);

// Marcas
const marcaRouter = R();
marcaRouter.get('/', async (_req, res, next) => {
  try {
    const marcas = await prisma.cat_marcas.findMany({ where: { activo: true }, orderBy: { nombre: 'asc' } });
    res.json({ success: true, data: marcas });
  } catch (e) { next(e); }
});
router.use('/marcas', marcaRouter);

// Clientes
const clienteRouter = R();
clienteRouter.get('/', authMiddleware, async (req: any, res, next) => {
  try {
    const { search, limit = '50' } = req.query;
    const where: any = {};
    if (search) {
      where.usuario = {
        OR: [
          { nombre: { contains: search as string, mode: 'insensitive' } },
          { apellido: { contains: search as string, mode: 'insensitive' } },
          { email: { contains: search as string, mode: 'insensitive' } },
        ],
      };
    }
    const clientes = await prisma.cli_clientes.findMany({
      where,
      take: parseInt(limit as string),
      include: { usuario: { select: { nombre: true, apellido: true, email: true } } },
      orderBy: { created_at: 'desc' },
    });
    const total = await prisma.cli_clientes.count({ where });
    res.json({ success: true, data: clientes, total });
  } catch (e) { next(e); }
});
router.use('/clientes', clienteRouter);

export default router;