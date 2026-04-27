import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';
export declare const carritoController: {
    obtener(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
    agregarItem(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
    actualizarItem(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
    eliminarItem(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
    vaciar(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
};
//# sourceMappingURL=carrito.controller.d.ts.map