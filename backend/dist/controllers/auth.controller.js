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
exports.perfil = exports.logout = exports.refresh = exports.login = exports.registro = void 0;
const authService = __importStar(require("../services/auth.service"));
const auth_schema_1 = require("../schemas/auth.schema");
const registro = async (req, res, next) => {
    try {
        const data = auth_schema_1.registroSchema.parse(req.body);
        const resultado = await authService.registrar(data);
        res.status(201).json({ success: true, data: resultado, message: 'Registro exitoso' });
    }
    catch (error) {
        next(error);
    }
};
exports.registro = registro;
const login = async (req, res, next) => {
    try {
        const data = auth_schema_1.loginSchema.parse(req.body);
        const resultado = await authService.login(data);
        res.json({ success: true, data: resultado, message: 'Inicio de sesión exitoso' });
    }
    catch (error) {
        next(error);
    }
};
exports.login = login;
const refresh = async (req, res, next) => {
    try {
        const { refresh_token } = auth_schema_1.refreshTokenSchema.parse(req.body);
        const tokens = await authService.refreshToken(refresh_token);
        res.json({ success: true, data: tokens });
    }
    catch (error) {
        next(error);
    }
};
exports.refresh = refresh;
const logout = async (req, res, next) => {
    try {
        if (req.user)
            await authService.logout(req.user.userId);
        res.json({ success: true, message: 'Sesión cerrada' });
    }
    catch (error) {
        next(error);
    }
};
exports.logout = logout;
const perfil = async (req, res, next) => {
    try {
        res.json({ success: true, data: req.user });
    }
    catch (error) {
        next(error);
    }
};
exports.perfil = perfil;
//# sourceMappingURL=auth.controller.js.map