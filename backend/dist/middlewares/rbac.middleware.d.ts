import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';
/**
 * Middleware RBAC - Verifica que el usuario tenga el/los roles requeridos
 */
export declare const requireRole: (...roles: string[]) => (req: AuthenticatedRequest, res: Response, next: NextFunction) => void;
/**
 * Middleware para acceso solo de administradores
 */
export declare const requireAdmin: (req: AuthenticatedRequest, res: Response, next: NextFunction) => void;
/**
 * Middleware para acceso de staff (admin, gerente ventas, gerente inventario, vendedor)
 */
export declare const requireStaff: (req: AuthenticatedRequest, res: Response, next: NextFunction) => void;
/**
 * Middleware para acceso de gerentes
 */
export declare const requireGerente: (req: AuthenticatedRequest, res: Response, next: NextFunction) => void;
//# sourceMappingURL=rbac.middleware.d.ts.map