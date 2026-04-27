import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';
/**
 * Middleware de autenticación JWT
 * Verifica el token Bearer en el header Authorization
 */
export declare const authMiddleware: (req: AuthenticatedRequest, res: Response, next: NextFunction) => void;
/**
 * Middleware opcional de autenticación
 * No falla si no hay token, útil para endpoints públicos con datos opcionales
 */
export declare const optionalAuthMiddleware: (req: AuthenticatedRequest, _res: Response, next: NextFunction) => void;
//# sourceMappingURL=auth.middleware.d.ts.map