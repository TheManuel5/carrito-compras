import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import prisma from '../config/prisma';
import { config } from '../config';
import { AppError } from '../middlewares/errorHandler';
import { RegistroInput, LoginInput } from '../schemas/auth.schema';
import { JwtPayload } from '../types';

/**
 * Genera access token y refresh token para un usuario
 */
const generarTokens = (payload: JwtPayload) => {
  const accessToken = jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn as any,
  });
  const refreshToken = jwt.sign({ userId: payload.userId }, config.jwtRefreshSecret, {
    expiresIn: config.jwtRefreshExpiresIn as any,
  });
  return { accessToken, refreshToken };
};

/**
 * Registra un nuevo usuario (rol cliente por defecto)
 */
export const registrar = async (data: RegistroInput) => {
  const existe = await prisma.seg_usuarios.findUnique({ where: { email: data.email } });
  if (existe) throw new AppError('El email ya está registrado', 409);

  const password_hash = await bcrypt.hash(data.password, config.bcryptSaltRounds);
  const token_verificacion = uuidv4();

  const usuario = await prisma.seg_usuarios.create({
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
  const rolCliente = await prisma.seg_roles.findUnique({ where: { nombre: 'cliente' } });
  if (rolCliente) {
    await prisma.seg_usuario_rol.create({
      data: { usuario_id: usuario.id, rol_id: rolCliente.id },
    });
  }

  // Crear perfil de cliente
  await prisma.cli_clientes.create({ data: { usuario_id: usuario.id } });

  // TODO: Enviar email de verificación con token_verificacion

  const roles = ['cliente'];
  const payload: JwtPayload = { userId: usuario.id, email: usuario.email, roles };
  const tokens = generarTokens(payload);

  const refreshExpiry = new Date();
  refreshExpiry.setDate(refreshExpiry.getDate() + 7);

  await prisma.seg_usuarios.update({
    where: { id: usuario.id },
    data: { refresh_token: tokens.refreshToken, refresh_token_exp: refreshExpiry },
  });

  return {
    usuario: { id: usuario.id, email: usuario.email, nombre: usuario.nombre, apellido: usuario.apellido, roles },
    ...tokens,
  };
};

/**
 * Login de usuario con email y contraseña
 */
export const login = async (data: LoginInput) => {
  const usuario = await prisma.seg_usuarios.findUnique({
    where: { email: data.email },
    include: {
      roles: { include: { rol: true } },
    },
  });

  if (!usuario || !usuario.activo) {
    throw new AppError('Credenciales inválidas', 401);
  }

  const passwordValido = await bcrypt.compare(data.password, usuario.password_hash);
  if (!passwordValido) throw new AppError('Credenciales inválidas', 401);

  const roles = usuario.roles.map((r) => r.rol.nombre);
  const payload: JwtPayload = { userId: usuario.id, email: usuario.email, roles };
  const tokens = generarTokens(payload);

  const refreshExpiry = new Date();
  refreshExpiry.setDate(refreshExpiry.getDate() + 7);

  await prisma.seg_usuarios.update({
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

/**
 * Renovar access token con refresh token
 */
export const refreshToken = async (token: string) => {
  let payload: any;
  try {
    payload = jwt.verify(token, config.jwtRefreshSecret);
  } catch {
    throw new AppError('Refresh token inválido o expirado', 401);
  }

  const usuario = await prisma.seg_usuarios.findFirst({
    where: {
      id: payload.userId,
      refresh_token: token,
      refresh_token_exp: { gt: new Date() },
      activo: true,
    },
    include: { roles: { include: { rol: true } } },
  });

  if (!usuario) throw new AppError('Sesión inválida. Inicie sesión nuevamente.', 401);

  const roles = usuario.roles.map((r) => r.rol.nombre);
  const newPayload: JwtPayload = { userId: usuario.id, email: usuario.email, roles };
  const tokens = generarTokens(newPayload);

  const refreshExpiry = new Date();
  refreshExpiry.setDate(refreshExpiry.getDate() + 7);

  await prisma.seg_usuarios.update({
    where: { id: usuario.id },
    data: { refresh_token: tokens.refreshToken, refresh_token_exp: refreshExpiry },
  });

  return tokens;
};

/**
 * Cerrar sesión
 */
export const logout = async (userId: number) => {
  await prisma.seg_usuarios.update({
    where: { id: userId },
    data: { refresh_token: null, refresh_token_exp: null },
  });
};
