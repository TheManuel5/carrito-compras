import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service';
import { registroSchema, loginSchema, refreshTokenSchema } from '../schemas/auth.schema';
import { AuthenticatedRequest } from '../types';

export const registro = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = registroSchema.parse(req.body);
    const resultado = await authService.registrar(data);
    res.status(201).json({ success: true, data: resultado, message: 'Registro exitoso' });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = loginSchema.parse(req.body);
    const resultado = await authService.login(data);
    res.json({ success: true, data: resultado, message: 'Inicio de sesión exitoso' });
  } catch (error) {
    next(error);
  }
};

export const refresh = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { refresh_token } = refreshTokenSchema.parse(req.body);
    const tokens = await authService.refreshToken(refresh_token);
    res.json({ success: true, data: tokens });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (req.user) await authService.logout(req.user.userId);
    res.json({ success: true, message: 'Sesión cerrada' });
  } catch (error) {
    next(error);
  }
};

export const perfil = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    res.json({ success: true, data: req.user });
  } catch (error) {
    next(error);
  }
};
