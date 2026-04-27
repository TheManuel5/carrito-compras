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
exports.destacados = exports.eliminar = exports.actualizar = exports.crear = exports.obtener = exports.listar = void 0;
const productoService = __importStar(require("../services/producto.service"));
const producto_schema_1 = require("../schemas/producto.schema");
const listar = async (req, res, next) => {
    try {
        const filtros = producto_schema_1.filtroProductoSchema.parse(req.query);
        const resultado = await productoService.listarProductos(filtros);
        res.json({ success: true, ...resultado });
    }
    catch (error) {
        next(error);
    }
};
exports.listar = listar;
const obtener = async (req, res, next) => {
    try {
        const producto = await productoService.obtenerProducto(parseInt(req.params.id));
        res.json({ success: true, data: producto });
    }
    catch (error) {
        next(error);
    }
};
exports.obtener = obtener;
const crear = async (req, res, next) => {
    try {
        const data = producto_schema_1.productoSchema.parse(req.body);
        const producto = await productoService.crearProducto(data, req.user.userId);
        res.status(201).json({ success: true, data: producto, message: 'Producto creado exitosamente' });
    }
    catch (error) {
        next(error);
    }
};
exports.crear = crear;
const actualizar = async (req, res, next) => {
    try {
        const data = producto_schema_1.productoSchema.partial().parse(req.body);
        const producto = await productoService.actualizarProducto(parseInt(req.params.id), data, req.user.userId);
        res.json({ success: true, data: producto, message: 'Producto actualizado' });
    }
    catch (error) {
        next(error);
    }
};
exports.actualizar = actualizar;
const eliminar = async (req, res, next) => {
    try {
        await productoService.eliminarProducto(parseInt(req.params.id));
        res.json({ success: true, message: 'Producto eliminado' });
    }
    catch (error) {
        next(error);
    }
};
exports.eliminar = eliminar;
const destacados = async (_req, res, next) => {
    try {
        const data = await productoService.productosDestacados();
        res.json({ success: true, data });
    }
    catch (error) {
        next(error);
    }
};
exports.destacados = destacados;
//# sourceMappingURL=producto.controller.js.map