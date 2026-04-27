// src/types/index.ts
import { Request } from 'express';

export interface JwtPayload {
  userId: number;
  email: string;
  roles: string[];
}

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginationParams {
  page: number;
  limit: number;
  search?: string;
  orderBy?: string;
  order?: 'asc' | 'desc';
}
