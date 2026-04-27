(BigInt.prototype as any).toJSON = function() { return Number(this); };
import 'dotenv/config';
import app from './app';
import { logger } from './config/logger';

const PORT = process.env.PORT || 3001;

const server = app.listen(PORT, () => {
  logger.info(`🚀 Servidor iniciado en http://localhost:${PORT}`);
  logger.info(`📚 Documentación API: http://localhost:${PORT}/api/docs`);
  logger.info(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}`);
});

process.on('SIGTERM', () => {
  logger.info('SIGTERM recibido. Cerrando servidor...');
  server.close(() => {
    logger.info('Servidor cerrado.');
    process.exit(0);
  });
});

export default server;
