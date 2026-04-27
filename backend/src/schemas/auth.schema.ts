import { z } from 'zod';

export const registroSchema = z.object({
  email: z.string().email('Email inválido').toLowerCase(),
  nombre: z.string().min(2, 'Mínimo 2 caracteres').max(100),
  apellido: z.string().min(2, 'Mínimo 2 caracteres').max(100),
  password: z
    .string()
    .min(8, 'Mínimo 8 caracteres')
    .regex(/[A-Z]/, 'Debe tener al menos una mayúscula')
    .regex(/[0-9]/, 'Debe tener al menos un número'),
  confirmar_password: z.string(),
  telefono: z.string().optional(),
}).refine((data) => data.password === data.confirmar_password, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmar_password'],
});

export const loginSchema = z.object({
  email: z.string().email('Email inválido').toLowerCase(),
  password: z.string().min(1, 'Contraseña requerida'),
});

export const refreshTokenSchema = z.object({
  refresh_token: z.string().min(1),
});

export const cambiarPasswordSchema = z.object({
  password_actual: z.string().min(1),
  password_nuevo: z
    .string()
    .min(8, 'Mínimo 8 caracteres')
    .regex(/[A-Z]/, 'Debe tener al menos una mayúscula')
    .regex(/[0-9]/, 'Debe tener al menos un número'),
  confirmar_password: z.string(),
}).refine((data) => data.password_nuevo === data.confirmar_password, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmar_password'],
});

export const recuperarPasswordSchema = z.object({
  email: z.string().email('Email inválido').toLowerCase(),
});

export type RegistroInput = z.infer<typeof registroSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
