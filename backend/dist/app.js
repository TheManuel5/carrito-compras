"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const morgan_1 = __importDefault(require("morgan"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const path_1 = __importDefault(require("path"));
const errorHandler_1 = require("./middlewares/errorHandler");
const logger_1 = require("./config/logger");
const routes_1 = __importDefault(require("./routes"));
const app = (0, express_1.default)();
// ============ SEGURIDAD ============
app.use((0, helmet_1.default)({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
}));
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
// Rate limiting global
const limiter = (0, express_rate_limit_1.default)({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
    max: parseInt(process.env.RATE_LIMIT_MAX || '100'),
    message: { success: false, message: 'Demasiadas solicitudes. Intente más tarde.' },
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api/', limiter);
// ============ PARSERS ============
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
app.use((0, compression_1.default)());
// ============ LOGGING ============
app.use((0, morgan_1.default)('combined', {
    stream: { write: (message) => logger_1.logger.http(message.trim()) },
}));
// ============ ARCHIVOS ESTÁTICOS ============
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
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
const swaggerSpec = (0, swagger_jsdoc_1.default)(swaggerOptions);
app.use('/api/docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec));
// ============ RUTAS API ============
app.use('/api/v1', routes_1.default);
// Health check
app.get('/health', (_req, res) => {
    res.json({ success: true, message: 'API funcionando correctamente', timestamp: new Date().toISOString() });
});
// ============ MANEJO DE ERRORES ============
app.use(errorHandler_1.errorHandler);
exports.default = app;
//# sourceMappingURL=app.js.map