import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';
export declare const ordenController: {
    listar(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
    obtener(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
    crear(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
    cambiarEstado(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
    descargarFactura(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
};
//# sourceMappingURL=orden.controller.d.ts.map