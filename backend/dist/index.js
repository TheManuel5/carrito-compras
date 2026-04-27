"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
BigInt.prototype.toJSON = function () { return Number(this); };
require("dotenv/config");
const app_1 = __importDefault(require("./app"));
const logger_1 = require("./config/logger");
const PORT = process.env.PORT || 3001;
const server = app_1.default.listen(PORT, () => {
    logger_1.logger.info(`🚀 Servidor iniciado en http://localhost:${PORT}`);
    logger_1.logger.info(`📚 Documentación API: http://localhost:${PORT}/api/docs`);
    logger_1.logger.info(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}`);
});
process.on('SIGTERM', () => {
    logger_1.logger.info('SIGTERM recibido. Cerrando servidor...');
    server.close(() => {
        logger_1.logger.info('Servidor cerrado.');
        process.exit(0);
    });
});
exports.default = server;
//# sourceMappingURL=index.js.map