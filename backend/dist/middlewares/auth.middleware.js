"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionalAuthMiddleware = exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
/**
 * Middleware de autenticación JWT
 * Verifica el token Bearer en el header Authorization
 */
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ success: false, message: 'Token de acceso requerido' });
        return;
    }
    const token = authHeader.split(' ')[1];
    try {
        const payload = jsonwebtoken_1.default.verify(token, config_1.config.jwtSecret);
        req.user = payload;
        next();
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            res.status(401).json({ success: false, message: 'Token expirado. Renueve su sesión.' });
        }
        else {
            res.status(401).json({ success: false, message: 'Token inválido' });
        }
    }
};
exports.authMiddleware = authMiddleware;
/**
 * Middleware opcional de autenticación
 * No falla si no hay token, útil para endpoints públicos con datos opcionales
 */
const optionalAuthMiddleware = (req, _res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        try {
            const payload = jsonwebtoken_1.default.verify(token, config_1.config.jwtSecret);
            req.user = payload;
        }
        catch {
            // Token inválido ignorado en middleware opcional
        }
    }
    next();
};
exports.optionalAuthMiddleware = optionalAuthMiddleware;
//# sourceMappingURL=auth.middleware.js.map