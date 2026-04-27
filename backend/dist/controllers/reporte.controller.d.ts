import { Request, Response, NextFunction } from 'express';
export declare const reporteController: {
    kpis(req: Request, res: Response, next: NextFunction): Promise<void>;
    graficos(req: Request, res: Response, next: NextFunction): Promise<void>;
    analisisABC(req: Request, res: Response, next: NextFunction): Promise<void>;
    analisisRFM(req: Request, res: Response, next: NextFunction): Promise<void>;
    pdfOrdenes(req: Request, res: Response, next: NextFunction): Promise<void>;
    pdfInventario(req: Request, res: Response, next: NextFunction): Promise<void>;
};
//# sourceMappingURL=reporte.controller.d.ts.map