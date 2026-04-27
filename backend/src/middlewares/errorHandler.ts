import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { logger } from '../config/logger';

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  logger.error({
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    ip: req.ip,
  });

  // Errores de validación Zod
  if (err instanceof ZodError) {
    res.status(422).json({
      success: false,
      message: 'Error de validación',
      errors: err.errors.map((e) => `${e.path.join('.')}: ${e.message}`),
    });
    return;
  }

  // Errores operacionales conocidos
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
    return;
  }

  // Errores de Prisma
  if ((err as any).code === 'P2002') {
    res.status(409).json({
      success: false,
      message: 'El registro ya existe (duplicado)',
    });
    return;
  }

  if ((err as any).code === 'P2025') {
    res.status(404).json({
      success: false,
      message: 'Registro no encontrado',
    });
    return;
  }

  // Error genérico del servidor
  res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' ? 'Error interno del servidor' : err.message,
  });
};
