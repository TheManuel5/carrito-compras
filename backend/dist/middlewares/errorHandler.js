"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.AppError = void 0;
const zod_1 = require("zod");
const logger_1 = require("../config/logger");
class AppError extends Error {
    statusCode;
    isOperational;
    constructor(message, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
const errorHandler = (err, req, res, _next) => {
    logger_1.logger.error({
        message: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method,
        ip: req.ip,
    });
    // Errores de validación Zod
    if (err instanceof zod_1.ZodError) {
        res.status(422).json({
            success: false,
            message: 'Error de validación',
            errors: err.errors.map((e) => `${e.path.join('.')}: ${e.message}`),
        });
        return;
    }
    // Errores operacionales conocidos
    if (err instanceof AppError) {
        res.status(err.statusCode).json({
            success: false,
            message: err.message,
        });
        return;
    }
    // Errores de Prisma
    if (err.code === 'P2002') {
        res.status(409).json({
            success: false,
            message: 'El registro ya existe (duplicado)',
        });
        return;
    }
    if (err.code === 'P2025') {
        res.status(404).json({
            success: false,
            message: 'Registro no encontrado',
        });
        return;
    }
    // Error genérico del servidor
    res.status(500).json({
        success: false,
        message: process.env.NODE_ENV === 'production' ? 'Error interno del servidor' : err.message,
    });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=errorHandler.js.map