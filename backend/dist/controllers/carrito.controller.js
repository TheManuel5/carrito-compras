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
Object.defineProperty(exports, "__esModule", { value: true });
exports.carritoController = void 0;
const carritoService = __importStar(require("../services/carrito.service"));
exports.carritoController = {
    async obtener(req, res, next) {
        try {
            const sessionId = req.headers['x-session-id'];
            const carrito = await carritoService.obtenerCarrito(req.user?.userId, sessionId);
            const totales = carritoService.calcularTotales(carrito.items);
            res.json({ success: true, data: { ...carrito, ...totales } });
        }
        catch (error) {
            next(error);
        }
    },
    async agregarItem(req, res, next) {
        try {
            const sessionId = req.headers['x-session-id'];
            const carrito = await carritoService.obtenerCarrito(req.user?.userId, sessionId);
            const { producto_id, cantidad } = req.body;
            const item = await carritoService.agregarItem(carrito.id, parseInt(producto_id), parseInt(cantidad) || 1);
            res.status(201).json({ success: true, data: item, message: 'Producto agregado al carrito' });
        }
        catch (error) {
            next(error);
        }
    },
    async actualizarItem(req, res, next) {
        try {
            const sessionId = req.headers['x-session-id'];
            const carrito = await carritoService.obtenerCarrito(req.user?.userId, sessionId);
            const item = await carritoService.actualizarItem(carrito.id, parseInt(req.params.itemId), parseInt(req.body.cantidad));
            res.json({ success: true, data: item, message: 'Cantidad actualizada' });
        }
        catch (error) {
            next(error);
        }
    },
    async eliminarItem(req, res, next) {
        try {
            const sessionId = req.headers['x-session-id'];
            const carrito = await carritoService.obtenerCarrito(req.user?.userId, sessionId);
            await carritoService.eliminarItem(carrito.id, parseInt(req.params.itemId));
            res.json({ success: true, message: 'Item eliminado del carrito' });
        }
        catch (error) {
            next(error);
        }
    },
    async vaciar(req, res, next) {
        try {
            const sessionId = req.headers['x-session-id'];
            const carrito = await carritoService.obtenerCarrito(req.user?.userId, sessionId);
            await carritoService.vaciarCarrito(carrito.id);
            res.json({ success: true, message: 'Carrito vaciado' });
        }
        catch (error) {
            next(error);
        }
    },
};
//# sourceMappingURL=carrito.controller.js.map