import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';

import { errorHandler } from './middlewares/errorHandler';
import { logger } from './config/logger';
import routes from './routes';

const app = express();

// ============ SEGURIDAD ============
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

app.use(cors({
  origin: '*',


  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-session-id'],

}));

// Rate limiting global
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
  max: parseInt(process.env.RATE_LIMIT_MAX || '100'),
  message: { success: false, message: 'Demasiadas solicitudes. Intente más tarde.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// ============ PARSERS ============
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(compression());

// ============ LOGGING ============
app.use(morgan('combined', {
  stream: { write: (message) => logger.http(message.trim()) },
}));

// ============ ARCHIVOS ESTÁTICOS ============
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ============ SWAGGER / OPENAPI ============
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Carrito de Compras API',
      version: '1.0.0',
      description: 'API RESTful para el sistema de e-commerce con carrito de compras',
    },
    servers: [{ url: '/api/v1', description: 'Servidor principal' }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'],
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ============ RUTAS API ============
app.use('/api/v1', routes);

// Health check
app.get('/health', (_req, res) => {
  res.json({ success: true, message: 'API funcionando correctamente', timestamp: new Date().toISOString() });
});

// ============ MANEJO DE ERRORES ============
app.use(errorHandler);

export default app;
