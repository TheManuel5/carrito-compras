import { z } from 'zod';
export declare const registroSchema: z.ZodEffects<z.ZodObject<{
    email: z.ZodString;
    nombre: z.ZodString;
    apellido: z.ZodString;
    password: z.ZodString;
    confirmar_password: z.ZodString;
    telefono: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    email: string;
    nombre: string;
    apellido: string;
    password: string;
    confirmar_password: string;
    telefono?: string | undefined;
}, {
    email: string;
    nombre: string;
    apellido: string;
    password: string;
    confirmar_password: string;
    telefono?: string | undefined;
}>, {
    email: string;
    nombre: string;
    apellido: string;
    password: string;
    confirmar_password: string;
    telefono?: string | undefined;
}, {
    email: string;
    nombre: string;
    apellido: string;
    password: string;
    confirmar_password: string;
    telefono?: string | undefined;
}>;
export declare const loginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export declare const refreshTokenSchema: z.ZodObject<{
    refresh_token: z.ZodString;
}, "strip", z.ZodTypeAny, {
    refresh_token: string;
}, {
    refresh_token: string;
}>;
export declare const cambiarPasswordSchema: z.ZodEffects<z.ZodObject<{
    password_actual: z.ZodString;
    password_nuevo: z.ZodString;
    confirmar_password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    confirmar_password: string;
    password_actual: string;
    password_nuevo: string;
}, {
    confirmar_password: string;
    password_actual: string;
    password_nuevo: string;
}>, {
    confirmar_password: string;
    password_actual: string;
    password_nuevo: string;
}, {
    confirmar_password: string;
    password_actual: string;
    password_nuevo: string;
}>;
export declare const recuperarPasswordSchema: z.ZodObject<{
    email: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
}, {
    email: string;
}>;
export type RegistroInput = z.infer<typeof registroSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
//# sourceMappingURL=auth.schema.d.ts.map