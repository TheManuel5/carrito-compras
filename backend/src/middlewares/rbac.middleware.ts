import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';

/**
 * Middleware RBAC - Verifica que el usuario tenga el/los roles requeridos
 */
export const requireRole = (...roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Autenticación requerida' });
      return;
    }

    const userRoles = req.user.roles || [];
    const hasRole = roles.some((role) => userRoles.includes(role));

    if (!hasRole) {
      res.status(403).json({
        success: false,
        message: `Acceso denegado. Se requiere uno de los roles: ${roles.join(', ')}`,
      });
      return;
    }

    next();
  };
};

/**
 * Middleware para acceso solo de administradores
 */
export const requireAdmin = requireRole('administrador');

/**
 * Middleware para acceso de staff (admin, gerente ventas, gerente inventario, vendedor)
 */
export const requireStaff = requireRole(
  'administrador',
  'gerente_ventas',
  'gerente_inventario',
  'vendedor'
);

/**
 * Middleware para acceso de gerentes
 */
export const requireGerente = requireRole('administrador', 'gerente_ventas', 'gerente_inventario');
