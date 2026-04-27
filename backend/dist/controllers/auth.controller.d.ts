import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';
export declare const registro: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const login: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const refresh: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const logout: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const perfil: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=auth.controller.d.ts.map