import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/rbac.middleware';
import prisma from '../config/prisma';

const router = Router();

// Stock actual
router.get('/stock', authMiddleware, requireRole('administrador', 'gerente_inventario', 'vendedor'), async (req, res, next) => {
  try {
    const { page = '1', limit = '20', search, stock_bajo } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    const where: any = {};
    if (search) {
      where.producto = { OR: [
        { nombre: { contains: search as string, mode: 'insensitive' } },
        { sku: { contains: search as string, mode: 'insensitive' } },
      ]};
    }
    if (stock_bajo === 'true') {
      // productos donde cantidad <= cantidad_min
    }
    const stock = await prisma.inv_stock_producto.findMany({
      where,
      skip,
      take: parseInt(limit as string),
      include: { producto: { include: { categoria: true, imagenes: { where: { es_principal: true }, take: 1 } } } },
    });
    res.json({ success: true, data: stock });
  } catch (error) { next(error); }
});

// Ajuste de stock
router.post('/ajuste', authMiddleware, requireRole('administrador', 'gerente_inventario'), async (req, res, next) => {
  try {
    const { producto_id, cantidad, motivo } = req.body;
    const stock = await prisma.inv_stock_producto.findUnique({ where: { producto_id: parseInt(producto_id) } });
    if (!stock) { res.status(404).json({ success: false, message: 'Producto sin registro de stock' }); return; }

    const cantidadAntes = stock.cantidad;
    const cantidadDespues = cantidadAntes + parseInt(cantidad);
    if (cantidadDespues < 0) { res.status(400).json({ success: false, message: 'Stock resultante no puede ser negativo' }); return; }

    await prisma.$transaction(async (tx) => {
      await tx.inv_stock_producto.update({
        where: { id: stock.id },
        data: { cantidad: cantidadDespues },
      });
      await tx.inv_movimientos_inventario.create({
        data: {
          stock_id: stock.id,
          tipo: cantidad > 0 ? 'ajuste' : 'ajuste',
          cantidad: Math.abs(parseInt(cantidad)),
          cantidad_antes: cantidadAntes,
          cantidad_despues: cantidadDespues,
          motivo,
          usuario_id: (req as any).user?.userId,
        },
      });
    });

    res.json({ success: true, message: 'Ajuste de stock registrado' });
  } catch (error) { next(error); }
});

// Movimientos
router.get('/movimientos', authMiddleware, requireRole('administrador', 'gerente_inventario'), async (req, res, next) => {
  try {
    const movimientos = await prisma.inv_movimientos_inventario.findMany({
      orderBy: { created_at: 'desc' },
      take: 100,
      include: {
        stock: { include: { producto: { select: { nombre: true, sku: true } } } },
      },
    });
    res.json({ success: true, data: movimientos });
  } catch (error) { next(error); }
});

export default router;
