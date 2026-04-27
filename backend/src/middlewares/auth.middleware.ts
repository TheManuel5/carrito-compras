import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { AuthenticatedRequest, JwtPayload } from '../types';

/**
 * Middleware de autenticación JWT
 * Verifica el token Bearer en el header Authorization
 */
export const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ success: false, message: 'Token de acceso requerido' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, config.jwtSecret) as JwtPayload;
    req.user = payload;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ success: false, message: 'Token expirado. Renueve su sesión.' });
    } else {
      res.status(401).json({ success: false, message: 'Token inválido' });
    }
  }
};

/**
 * Middleware opcional de autenticación
 * No falla si no hay token, útil para endpoints públicos con datos opcionales
 */
export const optionalAuthMiddleware = (req: AuthenticatedRequest, _res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const payload = jwt.verify(token, config.jwtSecret) as JwtPayload;
      req.user = payload;
    } catch {
      // Token inválido ignorado en middleware opcional
    }
  }

  next();
};
