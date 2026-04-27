"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.recuperarPasswordSchema = exports.cambiarPasswordSchema = exports.refreshTokenSchema = exports.loginSchema = exports.registroSchema = void 0;
const zod_1 = require("zod");
exports.registroSchema = zod_1.z.object({
    email: zod_1.z.string().email('Email inválido').toLowerCase(),
    nombre: zod_1.z.string().min(2, 'Mínimo 2 caracteres').max(100),
    apellido: zod_1.z.string().min(2, 'Mínimo 2 caracteres').max(100),
    password: zod_1.z
        .string()
        .min(8, 'Mínimo 8 caracteres')
        .regex(/[A-Z]/, 'Debe tener al menos una mayúscula')
        .regex(/[0-9]/, 'Debe tener al menos un número'),
    confirmar_password: zod_1.z.string(),
    telefono: zod_1.z.string().optional(),
}).refine((data) => data.password === data.confirmar_password, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmar_password'],
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email('Email inválido').toLowerCase(),
    password: zod_1.z.string().min(1, 'Contraseña requerida'),
});
exports.refreshTokenSchema = zod_1.z.object({
    refresh_token: zod_1.z.string().min(1),
});
exports.cambiarPasswordSchema = zod_1.z.object({
    password_actual: zod_1.z.string().min(1),
    password_nuevo: zod_1.z
        .string()
        .min(8, 'Mínimo 8 caracteres')
        .regex(/[A-Z]/, 'Debe tener al menos una mayúscula')
        .regex(/[0-9]/, 'Debe tener al menos un número'),
    confirmar_password: zod_1.z.string(),
}).refine((data) => data.password_nuevo === data.confirmar_password, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmar_password'],
});
exports.recuperarPasswordSchema = zod_1.z.object({
    email: zod_1.z.string().email('Email inválido').toLowerCase(),
});
//# sourceMappingURL=auth.schema.js.map