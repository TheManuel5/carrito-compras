import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';
export declare const listar: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const obtener: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const crear: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const actualizar: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const eliminar: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const destacados: (_req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=producto.controller.d.ts.map