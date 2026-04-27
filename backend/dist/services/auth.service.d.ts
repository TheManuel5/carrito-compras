import { RegistroInput, LoginInput } from '../schemas/auth.schema';
/**
 * Registra un nuevo usuario (rol cliente por defecto)
 */
export declare const registrar: (data: RegistroInput) => Promise<{
    accessToken: string;
    refreshToken: string;
    usuario: {
        id: number;
        email: string;
        nombre: string;
        apellido: string;
        roles: string[];
    };
}>;
/**
 * Login de usuario con email y contraseña
 */
export declare const login: (data: LoginInput) => Promise<{
    accessToken: string;
    refreshToken: string;
    usuario: {
        id: number;
        email: string;
        nombre: string;
        apellido: string;
        roles: string[];
    };
}>;
/**
 * Renovar access token con refresh token
 */
export declare const refreshToken: (token: string) => Promise<{
    accessToken: string;
    refreshToken: string;
}>;
/**
 * Cerrar sesión
 */
export declare const logout: (userId: number) => Promise<void>;
//# sourceMappingURL=auth.service.d.ts.map