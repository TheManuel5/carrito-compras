"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reporteController = void 0;
const reporteService = __importStar(require("../services/reporte.service"));
const pdfGenerator = __importStar(require("../utils/pdfGenerator"));
const prisma_1 = __importDefault(require("../config/prisma"));
exports.reporteController = {
    async kpis(req, res, next) {
        try {
            const { fecha_inicio, fecha_fin } = req.query;
            const kpis = await reporteService.obtenerKpis(fecha_inicio ? new Date(fecha_inicio) : undefined, fecha_fin ? new Date(fecha_fin) : undefined);
            res.json({ success: true, data: kpis });
        }
        catch (error) {
            next(error);
        }
    },
    async graficos(req, res, next) {
        try {
            const periodo = req.query.periodo || 'mes';
            const datos = await reporteService.obtenerDatosGraficos(periodo);
            res.json({ success: true, data: datos });
        }
        catch (error) {
            next(error);
        }
    },
    async analisisABC(req, res, next) {
        try {
            const datos = await reporteService.analisisABC();
            res.json({ success: true, data: datos });
        }
        catch (error) {
            next(error);
        }
    },
    async analisisRFM(req, res, next) {
        try {
            const datos = await reporteService.analisisRFM();
            res.json({ success: true, data: datos });
        }
        catch (error) {
            next(error);
        }
    },
    async pdfOrdenes(req, res, next) {
        try {
            const { fecha_inicio, fecha_fin, estado } = req.query;
            const where = {};
            if (fecha_inicio)
                where.created_at = { ...where.created_at, gte: new Date(fecha_inicio) };
            if (fecha_fin)
                where.created_at = { ...where.created_at, lte: new Date(fecha_fin) };
            if (estado)
                where.estado = estado;
            const ordenes = await prisma_1.default.ord_ordenes.findMany({
                where,
                include: {
                    items: true,
                    usuario: { select: { nombre: true, apellido: true, email: true } },
                },
                orderBy: { created_at: 'desc' },
                take: 500,
            });
            const filtros = [
                fecha_inicio ? `Desde: ${fecha_inicio}` : '',
                fecha_fin ? `Hasta: ${fecha_fin}` : '',
                estado ? `Estado: ${estado}` : '',
            ].filter(Boolean).join(' | ');
            await pdfGenerator.generarReporteOrdenes(ordenes, res, filtros);
        }
        catch (error) {
            next(error);
        }
    },
    async pdfInventario(req, res, next) {
        try {
            const productos = await prisma_1.default.cat_productos.findMany({
                where: { activo: true },
                include: {
                    categoria: { select: { nombre: true } },
                    stock: true,
                },
                orderBy: { categoria_id: 'asc' },
            });
            await pdfGenerator.generarReporteInventario(productos, res);
        }
        catch (error) {
            next(error);
        }
    },
};
//# sourceMappingURL=reporte.controller.js.map