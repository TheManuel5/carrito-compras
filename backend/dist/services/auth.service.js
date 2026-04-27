"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.refreshToken = exports.login = exports.registrar = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const uuid_1 = require("uuid");
const prisma_1 = __importDefault(require("../config/prisma"));
const config_1 = require("../config");
const errorHandler_1 = require("../middlewares/errorHandler");
/**
 * Genera access token y refresh token para un usuario
 */
const generarTokens = (payload) => {
    const accessToken = jsonwebtoken_1.default.sign(payload, config_1.config.jwtSecret, {
        expiresIn: config_1.config.jwtExpiresIn,
    });
    const refreshToken = jsonwebtoken_1.default.sign({ userId: payload.userId }, config_1.config.jwtRefreshSecret, {
        expiresIn: config_1.config.jwtRefreshExpiresIn,
    });
    return { accessToken, refreshToken };
};
/**
 * Registra un nuevo usuario (rol cliente por defecto)
 */
const registrar = async (data) => {
    const existe = await prisma_1.default.seg_usuarios.findUnique({ where: { email: data.email } });
    if (existe)
        throw new errorHandler_1.AppError('El email ya está registrado', 409);
    const password_hash = await bcryptjs_1.default.hash(data.password, config_1.config.bcryptSaltRounds);
    const token_verificacion = (0, uuid_1.v4)();
    const usuario = await prisma_1.default.seg_usuarios.create({
        data: {
            email: data.email,
            nombre: data.nombre,
            apellido: data.apellido,
            password_hash,
            telefono: data.telefono,
            token_verificacion,
        },
    });
    // Asignar rol cliente
    const rolCliente = await prisma_1.default.seg_roles.findUnique({ where: { nombre: 'cliente' } });
    if (rolCliente) {
        await prisma_1.default.seg_usuario_rol.create({
            data: { usuario_id: usuario.id, rol_id: rolCliente.id },
        });
    }
    // Crear perfil de cliente
    await prisma_1.default.cli_clientes.create({ data: { usuario_id: usuario.id } });
    // TODO: Enviar email de verificación con token_verificacion
    const roles = ['cliente'];
    const payload = { userId: usuario.id, email: usuario.email, roles };
    const tokens = generarTokens(payload);
    const refreshExpiry = new Date();
    refreshExpiry.setDate(refreshExpiry.getDate() + 7);
    await prisma_1.default.seg_usuarios.update({
        where: { id: usuario.id },
        data: { refresh_token: tokens.refreshToken, refresh_token_exp: refreshExpiry },
    });
    return {
        usuario: { id: usuario.id, email: usuario.email, nombre: usuario.nombre, apellido: usuario.apellido, roles },
        ...tokens,
    };
};
exports.registrar = registrar;
/**
 * Login de usuario con email y contraseña
 */
const login = async (data) => {
    const usuario = await prisma_1.default.seg_usuarios.findUnique({
        where: { email: data.email },
        include: {
            roles: { include: { rol: true } },
        },
    });
    if (!usuario || !usuario.activo) {
        throw new errorHandler_1.AppError('Credenciales inválidas', 401);
    }
    const passwordValido = await bcryptjs_1.default.compare(data.password, usuario.password_hash);
    if (!passwordValido)
        throw new errorHandler_1.AppError('Credenciales inválidas', 401);
    const roles = usuario.roles.map((r) => r.rol.nombre);
    const payload = { userId: usuario.id, email: usuario.email, roles };
    const tokens = generarTokens(payload);
    const refreshExpiry = new Date();
    refreshExpiry.setDate(refreshExpiry.getDate() + 7);
    await prisma_1.default.seg_usuarios.update({
        where: { id: usuario.id },
        data: {
            refresh_token: tokens.refreshToken,
            refresh_token_exp: refreshExpiry,
            ultimo_login: new Date(),
        },
    });
    return {
        usuario: {
            id: usuario.id,
            email: usuario.email,
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            roles,
        },
        ...tokens,
    };
};
exports.login = login;
/**
 * Renovar access token con refresh token
 */
const refreshToken = async (token) => {
    let payload;
    try {
        payload = jsonwebtoken_1.default.verify(token, config_1.config.jwtRefreshSecret);
    }
    catch {
        throw new errorHandler_1.AppError('Refresh token inválido o expirado', 401);
    }
    const usuario = await prisma_1.default.seg_usuarios.findFirst({
        where: {
            id: payload.userId,
            refresh_token: token,
            refresh_token_exp: { gt: new Date() },
            activo: true,
        },
        include: { roles: { include: { rol: true } } },
    });
    if (!usuario)
        throw new errorHandler_1.AppError('Sesión inválida. Inicie sesión nuevamente.', 401);
    const roles = usuario.roles.map((r) => r.rol.nombre);
    const newPayload = { userId: usuario.id, email: usuario.email, roles };
    const tokens = generarTokens(newPayload);
    const refreshExpiry = new Date();
    refreshExpiry.setDate(refreshExpiry.getDate() + 7);
    await prisma_1.default.seg_usuarios.update({
        where: { id: usuario.id },
        data: { refresh_token: tokens.refreshToken, refresh_token_exp: refreshExpiry },
    });
    return tokens;
};
exports.refreshToken = refreshToken;
/**
 * Cerrar sesión
 */
const logout = async (userId) => {
    await prisma_1.default.seg_usuarios.update({
        where: { id: userId },
        data: { refresh_token: null, refresh_token_exp: null },
    });
};
exports.logout = logout;
//# sourceMappingURL=auth.service.js.map