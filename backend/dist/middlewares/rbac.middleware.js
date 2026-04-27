"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireGerente = exports.requireStaff = exports.requireAdmin = exports.requireRole = void 0;
/**
 * Middleware RBAC - Verifica que el usuario tenga el/los roles requeridos
 */
const requireRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Autenticación requerida' });
            return;
        }
        const userRoles = req.user.roles || [];
        const hasRole = roles.some((role) => userRoles.includes(role));
        if (!hasRole) {
            res.status(403).json({
                success: false,
                message: `Acceso denegado. Se requiere uno de los roles: ${roles.join(', ')}`,
            });
            return;
        }
        next();
    };
};
exports.requireRole = requireRole;
/**
 * Middleware para acceso solo de administradores
 */
exports.requireAdmin = (0, exports.requireRole)('administrador');
/**
 * Middleware para acceso de staff (admin, gerente ventas, gerente inventario, vendedor)
 */
exports.requireStaff = (0, exports.requireRole)('administrador', 'gerente_ventas', 'gerente_inventario', 'vendedor');
/**
 * Middleware para acceso de gerentes
 */
exports.requireGerente = (0, exports.requireRole)('administrador', 'gerente_ventas', 'gerente_inventario');
//# sourceMappingURL=rbac.middleware.js.map