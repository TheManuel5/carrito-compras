-- =============================================
-- SCRIPT SQL - SISTEMA CARRITO DE COMPRAS
-- Motor: PostgreSQL 16+
-- Convención: snake_case en español
-- Prefijos: cat_ seg_ ord_ inv_ cli_
-- =============================================

-- Crear base de datos
CREATE DATABASE carrito_compras
  WITH ENCODING = 'UTF8'
  LC_COLLATE = 'es_PE.UTF-8'
  LC_CTYPE = 'es_PE.UTF-8'
  TEMPLATE = template0;

\c carrito_compras;

-- Extensión para búsqueda fuzzy
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================
-- SEGURIDAD
-- ============================
CREATE TABLE IF NOT EXISTS seg_roles (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) UNIQUE NOT NULL,
    descripcion VARCHAR(255),
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
COMMENT ON TABLE seg_roles IS 'Roles del sistema: administrador, cliente, gerente_ventas, etc.';

CREATE TABLE IF NOT EXISTS seg_permisos (
    id SERIAL PRIMARY KEY,
    modulo VARCHAR(50) NOT NULL,
    accion VARCHAR(50) NOT NULL,
    descripcion VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(modulo, accion)
);

CREATE TABLE IF NOT EXISTS seg_rol_permiso (
    id SERIAL PRIMARY KEY,
    rol_id INT NOT NULL REFERENCES seg_roles(id) ON DELETE CASCADE,
    permiso_id INT NOT NULL REFERENCES seg_permisos(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(rol_id, permiso_id)
);

CREATE TABLE IF NOT EXISTS seg_usuarios (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    telefono VARCHAR(20),
    email_verificado BOOLEAN DEFAULT FALSE,
    token_verificacion VARCHAR(255),
    token_recuperacion VARCHAR(255),
    token_exp_recuperacion TIMESTAMPTZ,
    refresh_token TEXT,
    refresh_token_exp TIMESTAMPTZ,
    activo BOOLEAN DEFAULT TRUE,
    ultimo_login TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_seg_usuarios_email ON seg_usuarios(email);

CREATE TABLE IF NOT EXISTS seg_usuario_rol (
    id SERIAL PRIMARY KEY,
    usuario_id INT NOT NULL REFERENCES seg_usuarios(id) ON DELETE CASCADE,
    rol_id INT NOT NULL REFERENCES seg_roles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(usuario_id, rol_id)
);

CREATE TABLE IF NOT EXISTS auditoria_registro (
    id SERIAL PRIMARY KEY,
    usuario_id INT REFERENCES seg_usuarios(id) ON DELETE SET NULL,
    accion VARCHAR(50) NOT NULL,
    modulo VARCHAR(50) NOT NULL,
    tabla VARCHAR(100),
    registro_id INT,
    datos_anteriores JSONB,
    datos_nuevos JSONB,
    ip VARCHAR(45),
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_auditoria_usuario ON auditoria_registro(usuario_id);
CREATE INDEX IF NOT EXISTS idx_auditoria_fecha ON auditoria_registro(created_at);

-- ============================
-- CONFIGURACIÓN
-- ============================
CREATE TABLE IF NOT EXISTS configuracion_sistema (
    id SERIAL PRIMARY KEY,
    clave VARCHAR(100) UNIQUE NOT NULL,
    valor TEXT NOT NULL,
    tipo VARCHAR(20) NOT NULL DEFAULT 'string',
    descripcion VARCHAR(255),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS monedas (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(3) UNIQUE NOT NULL,
    nombre VARCHAR(50) NOT NULL,
    simbolo VARCHAR(5) NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tipo_cambio (
    id SERIAL PRIMARY KEY,
    moneda_id INT NOT NULL REFERENCES monedas(id),
    tasa DECIMAL(15, 6) NOT NULL CHECK (tasa > 0),
    fecha TIMESTAMPTZ DEFAULT NOW()
);

-- ============================
-- CATÁLOGO DE PRODUCTOS
-- ============================
CREATE TABLE IF NOT EXISTS cat_categorias (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    imagen_url VARCHAR(500),
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cat_subcategorias (
    id SERIAL PRIMARY KEY,
    categoria_id INT NOT NULL REFERENCES cat_categorias(id) ON DELETE CASCADE,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    imagen_url VARCHAR(500),
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cat_marcas (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) UNIQUE NOT NULL,
    descripcion TEXT,
    logo_url VARCHAR(500),
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cat_unidades_medida (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) UNIQUE NOT NULL,
    simbolo VARCHAR(10) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cat_etiquetas (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) UNIQUE NOT NULL,
    color VARCHAR(7),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cat_atributos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) UNIQUE NOT NULL,
    tipo VARCHAR(20) NOT NULL DEFAULT 'texto',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cat_valores_atributo (
    id SERIAL PRIMARY KEY,
    atributo_id INT NOT NULL REFERENCES cat_atributos(id) ON DELETE CASCADE,
    valor VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cat_productos (
    id SERIAL PRIMARY KEY,
    sku VARCHAR(50) UNIQUE NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    descripcion_corta VARCHAR(500),
    descripcion_larga TEXT,
    categoria_id INT NOT NULL REFERENCES cat_categorias(id),
    subcategoria_id INT REFERENCES cat_subcategorias(id),
    marca_id INT REFERENCES cat_marcas(id),
    unidad_medida_id INT REFERENCES cat_unidades_medida(id),
    precio_costo DECIMAL(10, 2) NOT NULL CHECK (precio_costo >= 0),
    precio_venta DECIMAL(10, 2) NOT NULL CHECK (precio_venta > 0),
    precio_oferta DECIMAL(10, 2) CHECK (precio_oferta >= 0),
    fecha_inicio_oferta TIMESTAMPTZ,
    fecha_fin_oferta TIMESTAMPTZ,
    peso DECIMAL(10, 3),
    alto DECIMAL(10, 2),
    ancho DECIMAL(10, 2),
    largo DECIMAL(10, 2),
    estado VARCHAR(20) NOT NULL DEFAULT 'activo' CHECK (estado IN ('activo','inactivo','borrador')),
    destacado BOOLEAN DEFAULT FALSE,
    nuevo BOOLEAN DEFAULT FALSE,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by INT,
    updated_by INT
);
CREATE INDEX IF NOT EXISTS idx_cat_productos_nombre ON cat_productos USING gin(nombre gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_cat_productos_sku ON cat_productos(sku);
CREATE INDEX IF NOT EXISTS idx_cat_productos_categoria ON cat_productos(categoria_id);
CREATE INDEX IF NOT EXISTS idx_cat_productos_estado ON cat_productos(estado);
CREATE INDEX IF NOT EXISTS idx_cat_productos_precio ON cat_productos(precio_venta);
COMMENT ON TABLE cat_productos IS 'Catálogo de productos del e-commerce';

CREATE TABLE IF NOT EXISTS cat_imagenes_producto (
    id SERIAL PRIMARY KEY,
    producto_id INT NOT NULL REFERENCES cat_productos(id) ON DELETE CASCADE,
    url VARCHAR(500) NOT NULL,
    alt VARCHAR(255),
    orden INT DEFAULT 0,
    es_principal BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cat_producto_atributo (
    id SERIAL PRIMARY KEY,
    producto_id INT NOT NULL REFERENCES cat_productos(id) ON DELETE CASCADE,
    valor_atributo_id INT NOT NULL REFERENCES cat_valores_atributo(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(producto_id, valor_atributo_id)
);

CREATE TABLE IF NOT EXISTS cat_producto_etiqueta (
    id SERIAL PRIMARY KEY,
    producto_id INT NOT NULL REFERENCES cat_productos(id) ON DELETE CASCADE,
    etiqueta_id INT NOT NULL REFERENCES cat_etiquetas(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(producto_id, etiqueta_id)
);

-- ============================
-- INVENTARIO
-- ============================
CREATE TABLE IF NOT EXISTS inv_stock_producto (
    id SERIAL PRIMARY KEY,
    producto_id INT UNIQUE NOT NULL REFERENCES cat_productos(id) ON DELETE CASCADE,
    cantidad INT NOT NULL DEFAULT 0 CHECK (cantidad >= 0),
    cantidad_min INT NOT NULL DEFAULT 5 CHECK (cantidad_min >= 0),
    cantidad_reservada INT NOT NULL DEFAULT 0 CHECK (cantidad_reservada >= 0),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS inv_movimientos_inventario (
    id SERIAL PRIMARY KEY,
    stock_id INT NOT NULL REFERENCES inv_stock_producto(id),
    tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('entrada','salida','ajuste','reserva','liberacion')),
    cantidad INT NOT NULL,
    cantidad_antes INT NOT NULL,
    cantidad_despues INT NOT NULL,
    motivo VARCHAR(255),
    referencia_id INT,
    referencia_tipo VARCHAR(50),
    usuario_id INT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_inv_mov_stock ON inv_movimientos_inventario(stock_id);
CREATE INDEX IF NOT EXISTS idx_inv_mov_fecha ON inv_movimientos_inventario(created_at);

CREATE TABLE IF NOT EXISTS inv_proveedores (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    ruc VARCHAR(20),
    email VARCHAR(255),
    telefono VARCHAR(20),
    direccion TEXT,
    contacto VARCHAR(100),
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS inv_ordenes_compra (
    id SERIAL PRIMARY KEY,
    proveedor_id INT NOT NULL REFERENCES inv_proveedores(id),
    numero_orden VARCHAR(50) UNIQUE NOT NULL,
    estado VARCHAR(20) NOT NULL DEFAULT 'pendiente',
    total DECIMAL(10, 2) NOT NULL CHECK (total >= 0),
    fecha_esperada TIMESTAMPTZ,
    notas TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS inv_detalle_orden_compra (
    id SERIAL PRIMARY KEY,
    orden_compra_id INT NOT NULL REFERENCES inv_ordenes_compra(id) ON DELETE CASCADE,
    producto_id INT NOT NULL,
    cantidad INT NOT NULL CHECK (cantidad > 0),
    precio_unitario DECIMAL(10, 2) NOT NULL CHECK (precio_unitario >= 0),
    subtotal DECIMAL(10, 2) NOT NULL
);

CREATE TABLE IF NOT EXISTS inv_recepciones (
    id SERIAL PRIMARY KEY,
    orden_compra_id INT NOT NULL REFERENCES inv_ordenes_compra(id),
    fecha_recepcion TIMESTAMPTZ DEFAULT NOW(),
    notas TEXT,
    usuario_id INT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS inv_ajustes (
    id SERIAL PRIMARY KEY,
    motivo VARCHAR(255) NOT NULL,
    usuario_id INT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS inv_detalle_ajuste (
    id SERIAL PRIMARY KEY,
    ajuste_id INT NOT NULL REFERENCES inv_ajustes(id) ON DELETE CASCADE,
    producto_id INT NOT NULL,
    cantidad INT NOT NULL
);

-- ============================
-- CLIENTES
-- ============================
CREATE TABLE IF NOT EXISTS cli_clientes (
    id SERIAL PRIMARY KEY,
    usuario_id INT UNIQUE NOT NULL REFERENCES seg_usuarios(id) ON DELETE CASCADE,
    dni VARCHAR(20),
    fecha_nacimiento DATE,
    genero VARCHAR(10),
    total_compras DECIMAL(15, 2) DEFAULT 0,
    num_ordenes INT DEFAULT 0,
    ultima_compra TIMESTAMPTZ,
    segmento VARCHAR(20) DEFAULT 'nuevo' CHECK (segmento IN ('nuevo','recurrente','inactivo','vip')),
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cli_direcciones (
    id SERIAL PRIMARY KEY,
    cliente_id INT NOT NULL REFERENCES cli_clientes(id) ON DELETE CASCADE,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    direccion VARCHAR(500) NOT NULL,
    ciudad VARCHAR(100) NOT NULL,
    departamento VARCHAR(100) NOT NULL,
    codigo_postal VARCHAR(10),
    telefono VARCHAR(20) NOT NULL,
    es_principal BOOLEAN DEFAULT FALSE,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cli_lista_deseos (
    id SERIAL PRIMARY KEY,
    cliente_id INT UNIQUE NOT NULL REFERENCES cli_clientes(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cli_items_lista_deseos (
    id SERIAL PRIMARY KEY,
    lista_deseos_id INT NOT NULL REFERENCES cli_lista_deseos(id) ON DELETE CASCADE,
    producto_id INT NOT NULL REFERENCES cat_productos(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(lista_deseos_id, producto_id)
);

CREATE TABLE IF NOT EXISTS cli_resenas_producto (
    id SERIAL PRIMARY KEY,
    cliente_id INT NOT NULL REFERENCES cli_clientes(id),
    producto_id INT NOT NULL REFERENCES cat_productos(id),
    calificacion INT NOT NULL CHECK (calificacion BETWEEN 1 AND 5),
    titulo VARCHAR(255),
    comentario TEXT,
    aprobada BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(cliente_id, producto_id)
);

CREATE TABLE IF NOT EXISTS cli_historial_navegacion (
    id SERIAL PRIMARY KEY,
    cliente_id INT NOT NULL REFERENCES cli_clientes(id) ON DELETE CASCADE,
    producto_id INT NOT NULL REFERENCES cat_productos(id) ON DELETE CASCADE,
    visited_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================
-- CARRITO Y ÓRDENES
-- ============================
CREATE TABLE IF NOT EXISTS ord_metodos_envio (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion VARCHAR(255),
    precio DECIMAL(10, 2) NOT NULL DEFAULT 0 CHECK (precio >= 0),
    dias_estimados INT NOT NULL DEFAULT 7,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ord_estados_orden (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) UNIQUE NOT NULL,
    descripcion VARCHAR(255),
    orden INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS ord_carritos (
    id SERIAL PRIMARY KEY,
    usuario_id INT REFERENCES seg_usuarios(id) ON DELETE SET NULL,
    session_id VARCHAR(255),
    estado VARCHAR(20) DEFAULT 'activo' CHECK (estado IN ('activo','completado','mergeado','expirado')),
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_ord_carritos_usuario ON ord_carritos(usuario_id);
CREATE INDEX IF NOT EXISTS idx_ord_carritos_session ON ord_carritos(session_id);

CREATE TABLE IF NOT EXISTS ord_items_carrito (
    id SERIAL PRIMARY KEY,
    carrito_id INT NOT NULL REFERENCES ord_carritos(id) ON DELETE CASCADE,
    producto_id INT NOT NULL REFERENCES cat_productos(id),
    cantidad INT NOT NULL CHECK (cantidad > 0),
    precio DECIMAL(10, 2) NOT NULL CHECK (precio >= 0),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(carrito_id, producto_id)
);

CREATE TABLE IF NOT EXISTS ord_ordenes (
    id SERIAL PRIMARY KEY,
    numero_orden VARCHAR(20) UNIQUE NOT NULL,
    usuario_id INT REFERENCES seg_usuarios(id) ON DELETE SET NULL,
    direccion_envio_id INT REFERENCES cli_direcciones(id),
    metodo_envio_id INT REFERENCES ord_metodos_envio(id),
    estado VARCHAR(30) NOT NULL DEFAULT 'pendiente_pago',
    subtotal DECIMAL(10, 2) NOT NULL CHECK (subtotal >= 0),
    igv DECIMAL(10, 2) NOT NULL DEFAULT 0 CHECK (igv >= 0),
    costo_envio DECIMAL(10, 2) NOT NULL DEFAULT 0 CHECK (costo_envio >= 0),
    descuento DECIMAL(10, 2) NOT NULL DEFAULT 0 CHECK (descuento >= 0),
    total DECIMAL(10, 2) NOT NULL CHECK (total >= 0),
    codigo_cupon VARCHAR(50),
    notas TEXT,
    numero_tracking VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_ord_ordenes_numero ON ord_ordenes(numero_orden);
CREATE INDEX IF NOT EXISTS idx_ord_ordenes_usuario ON ord_ordenes(usuario_id);
CREATE INDEX IF NOT EXISTS idx_ord_ordenes_estado ON ord_ordenes(estado);
CREATE INDEX IF NOT EXISTS idx_ord_ordenes_fecha ON ord_ordenes(created_at);

CREATE TABLE IF NOT EXISTS ord_items_orden (
    id SERIAL PRIMARY KEY,
    orden_id INT NOT NULL REFERENCES ord_ordenes(id) ON DELETE CASCADE,
    producto_id INT REFERENCES cat_productos(id) ON DELETE SET NULL,
    nombre_producto VARCHAR(255) NOT NULL,
    sku VARCHAR(50) NOT NULL,
    cantidad INT NOT NULL CHECK (cantidad > 0),
    precio_unitario DECIMAL(10, 2) NOT NULL CHECK (precio_unitario >= 0),
    subtotal DECIMAL(10, 2) NOT NULL CHECK (subtotal >= 0)
);

CREATE TABLE IF NOT EXISTS ord_pagos (
    id SERIAL PRIMARY KEY,
    orden_id INT NOT NULL REFERENCES ord_ordenes(id) ON DELETE CASCADE,
    metodo VARCHAR(50) NOT NULL,
    estado VARCHAR(20) NOT NULL DEFAULT 'pendiente',
    monto DECIMAL(10, 2) NOT NULL CHECK (monto > 0),
    moneda VARCHAR(3) NOT NULL DEFAULT 'PEN',
    referencia_ext VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ord_transacciones_pago (
    id SERIAL PRIMARY KEY,
    pago_id INT NOT NULL REFERENCES ord_pagos(id) ON DELETE CASCADE,
    tipo VARCHAR(30) NOT NULL,
    estado VARCHAR(20) NOT NULL,
    monto DECIMAL(10, 2) NOT NULL,
    respuesta_ext TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ord_historial_estados (
    id SERIAL PRIMARY KEY,
    orden_id INT NOT NULL REFERENCES ord_ordenes(id) ON DELETE CASCADE,
    estado_id INT REFERENCES ord_estados_orden(id),
    estado VARCHAR(30) NOT NULL,
    comentario TEXT,
    usuario_id INT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_ord_historial_orden ON ord_historial_estados(orden_id);

-- ============================
-- DATOS SEMILLA
-- ============================

-- Roles
INSERT INTO seg_roles (nombre, descripcion) VALUES
  ('administrador', 'Acceso total al sistema'),
  ('cliente', 'Cliente comprador'),
  ('gerente_ventas', 'Gestión de ventas y reportes'),
  ('gerente_inventario', 'Gestión de inventario y productos'),
  ('vendedor', 'Atención al cliente y gestión básica de órdenes')
ON CONFLICT (nombre) DO NOTHING;

-- Monedas
INSERT INTO monedas (codigo, nombre, simbolo) VALUES
  ('PEN', 'Sol Peruano', 'S/.'),
  ('USD', 'Dólar Americano', '$'),
  ('EUR', 'Euro', '€')
ON CONFLICT (codigo) DO NOTHING;

-- Marcas
INSERT INTO cat_marcas (nombre) VALUES
  ('Samsung'), ('LG'), ('Sony'), ('Apple'), ('HP'), 
  ('Lenovo'), ('Nike'), ('Adidas'), ('Sin Marca'), ('Dell')
ON CONFLICT (nombre) DO NOTHING;

-- Unidades de medida
INSERT INTO cat_unidades_medida (nombre, simbolo) VALUES
  ('Unidad', 'und'), ('Kilogramo', 'kg'), ('Litro', 'L'), ('Metro', 'm'), ('Par', 'par')
ON CONFLICT (nombre) DO NOTHING;

-- Categorías
INSERT INTO cat_categorias (nombre, descripcion, imagen_url) VALUES
  ('Electrónica', 'Dispositivos electrónicos y tecnología', 'https://picsum.photos/seed/electronica/400/300'),
  ('Ropa y Accesorios', 'Moda y estilo para todos', 'https://picsum.photos/seed/ropa/400/300'),
  ('Deportes', 'Equipamiento y ropa deportiva', 'https://picsum.photos/seed/deportes/400/300'),
  ('Hogar y Jardín', 'Para tu hogar y jardín', 'https://picsum.photos/seed/hogar/400/300')
ON CONFLICT DO NOTHING;

-- Configuración
INSERT INTO configuracion_sistema (clave, valor, tipo, descripcion) VALUES
  ('igv_porcentaje', '18', 'number', 'Porcentaje de IGV'),
  ('moneda_default', 'PEN', 'string', 'Moneda por defecto'),
  ('nombre_empresa', 'Mi Tienda Online', 'string', 'Nombre de la empresa'),
  ('stock_alerta_minimo', '5', 'number', 'Stock mínimo para alertas'),
  ('checkout_timeout_min', '15', 'number', 'Minutos de reserva en checkout')
ON CONFLICT (clave) DO NOTHING;

-- Métodos de envío
INSERT INTO ord_metodos_envio (nombre, descripcion, precio, dias_estimados) VALUES
  ('Envío Estándar', 'Entrega en 5-7 días hábiles', 10.00, 7),
  ('Envío Express', 'Entrega en 1-2 días hábiles', 25.00, 2),
  ('Recojo en Tienda', 'Recoge en nuestras tiendas', 0.00, 1)
ON CONFLICT DO NOTHING;

-- Estados de orden
INSERT INTO ord_estados_orden (nombre, descripcion, orden) VALUES
  ('pendiente_pago', 'Esperando confirmación de pago', 1),
  ('pagada', 'Pago confirmado', 2),
  ('en_proceso', 'En preparación', 3),
  ('enviada', 'En camino', 4),
  ('entregada', 'Entregada al cliente', 5),
  ('cancelada', 'Orden cancelada', 6),
  ('devuelta', 'Devolución procesada', 7)
ON CONFLICT (nombre) DO NOTHING;

-- =============================================
-- FIN DEL SCRIPT
-- =============================================
-- Para ejecutar:
-- psql -U postgres -f create_database.sql
-- =============================================
