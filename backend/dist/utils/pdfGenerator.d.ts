import { Response } from 'express';
/**
 * Reporte de órdenes del período
 */
export declare const generarReporteOrdenes: (ordenes: any[], res: Response, filtros?: string) => Promise<void>;
/**
 * Reporte de inventario valorizado
 */
export declare const generarReporteInventario: (productos: any[], res: Response) => Promise<void>;
/**
 * Factura individual por orden
 */
export declare const generarFactura: (orden: any, res: Response) => Promise<void>;
//# sourceMappingURL=pdfGenerator.d.ts.map