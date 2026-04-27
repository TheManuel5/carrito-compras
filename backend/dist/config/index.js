"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
// src/config/index.ts
exports.config = {
    port: parseInt(process.env.PORT || '3001'),
    nodeEnv: process.env.NODE_ENV || 'development',
    jwtSecret: process.env.JWT_SECRET || 'cambiar_en_produccion',
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'cambiar_en_produccion_refresh',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '15m',
    jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
    bcryptSaltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS || '12'),
    uploadDir: process.env.UPLOAD_DIR || './uploads',
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880'),
    email: {
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.EMAIL_PORT || '587'),
        user: process.env.EMAIL_USER || '',
        pass: process.env.EMAIL_PASS || '',
        from: process.env.EMAIL_FROM || 'noreply@carritocompras.com',
    },
    igvPorcentaje: 0.18,
    checkoutTimeoutMin: 15,
};
//# sourceMappingURL=index.js.map