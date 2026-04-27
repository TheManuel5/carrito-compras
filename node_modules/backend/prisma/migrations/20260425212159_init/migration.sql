-- CreateTable
CREATE TABLE "seg_roles" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,
    "descripcion" VARCHAR(255),
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "seg_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seg_permisos" (
    "id" SERIAL NOT NULL,
    "modulo" VARCHAR(50) NOT NULL,
    "accion" VARCHAR(50) NOT NULL,
    "descripcion" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "seg_permisos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seg_rol_permiso" (
    "id" SERIAL NOT NULL,
    "rol_id" INTEGER NOT NULL,
    "permiso_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "seg_rol_permiso_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seg_usuarios" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "apellido" VARCHAR(100) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "telefono" VARCHAR(20),
    "email_verificado" BOOLEAN NOT NULL DEFAULT false,
    "token_verificacion" VARCHAR(255),
    "token_recuperacion" VARCHAR(255),
    "token_exp_recuperacion" TIMESTAMP(3),
    "refresh_token" TEXT,
    "refresh_token_exp" TIMESTAMP(3),
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "ultimo_login" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "seg_usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seg_usuario_rol" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "rol_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "seg_usuario_rol_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auditoria_registro" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER,
    "accion" VARCHAR(50) NOT NULL,
    "modulo" VARCHAR(50) NOT NULL,
    "tabla" VARCHAR(100),
    "registro_id" INTEGER,
    "datos_anteriores" JSONB,
    "datos_nuevos" JSONB,
    "ip" VARCHAR(45),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "auditoria_registro_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "configuracion_sistema" (
    "id" SERIAL NOT NULL,
    "clave" VARCHAR(100) NOT NULL,
    "valor" TEXT NOT NULL,
    "tipo" VARCHAR(20) NOT NULL,
    "descripcion" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "configuracion_sistema_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "monedas" (
    "id" SERIAL NOT NULL,
    "codigo" VARCHAR(3) NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,
    "simbolo" VARCHAR(5) NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "monedas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tipo_cambio" (
    "id" SERIAL NOT NULL,
    "moneda_id" INTEGER NOT NULL,
    "tasa" DECIMAL(15,6) NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tipo_cambio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cat_categorias" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "descripcion" TEXT,
    "imagen_url" VARCHAR(500),
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cat_categorias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cat_subcategorias" (
    "id" SERIAL NOT NULL,
    "categoria_id" INTEGER NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "descripcion" TEXT,
    "imagen_url" VARCHAR(500),
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cat_subcategorias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cat_marcas" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "descripcion" TEXT,
    "logo_url" VARCHAR(500),
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cat_marcas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cat_unidades_medida" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,
    "simbolo" VARCHAR(10) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cat_unidades_medida_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cat_etiquetas" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,
    "color" VARCHAR(7),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cat_etiquetas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cat_atributos" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "tipo" VARCHAR(20) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cat_atributos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cat_valores_atributo" (
    "id" SERIAL NOT NULL,
    "atributo_id" INTEGER NOT NULL,
    "valor" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cat_valores_atributo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cat_productos" (
    "id" SERIAL NOT NULL,
    "sku" VARCHAR(50) NOT NULL,
    "nombre" VARCHAR(255) NOT NULL,
    "descripcion_corta" VARCHAR(500),
    "descripcion_larga" TEXT,
    "categoria_id" INTEGER NOT NULL,
    "subcategoria_id" INTEGER,
    "marca_id" INTEGER,
    "unidad_medida_id" INTEGER,
    "precio_costo" DECIMAL(10,2) NOT NULL,
    "precio_venta" DECIMAL(10,2) NOT NULL,
    "precio_oferta" DECIMAL(10,2),
    "fecha_inicio_oferta" TIMESTAMP(3),
    "fecha_fin_oferta" TIMESTAMP(3),
    "peso" DECIMAL(10,3),
    "alto" DECIMAL(10,2),
    "ancho" DECIMAL(10,2),
    "largo" DECIMAL(10,2),
    "estado" VARCHAR(20) NOT NULL DEFAULT 'activo',
    "destacado" BOOLEAN NOT NULL DEFAULT false,
    "nuevo" BOOLEAN NOT NULL DEFAULT false,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" INTEGER,
    "updated_by" INTEGER,

    CONSTRAINT "cat_productos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cat_imagenes_producto" (
    "id" SERIAL NOT NULL,
    "producto_id" INTEGER NOT NULL,
    "url" VARCHAR(500) NOT NULL,
    "alt" VARCHAR(255),
    "orden" INTEGER NOT NULL DEFAULT 0,
    "es_principal" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cat_imagenes_producto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cat_producto_atributo" (
    "id" SERIAL NOT NULL,
    "producto_id" INTEGER NOT NULL,
    "valor_atributo_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cat_producto_atributo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cat_producto_etiqueta" (
    "id" SERIAL NOT NULL,
    "producto_id" INTEGER NOT NULL,
    "etiqueta_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cat_producto_etiqueta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inv_stock_producto" (
    "id" SERIAL NOT NULL,
    "producto_id" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL DEFAULT 0,
    "cantidad_min" INTEGER NOT NULL DEFAULT 5,
    "cantidad_reservada" INTEGER NOT NULL DEFAULT 0,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inv_stock_producto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inv_movimientos_inventario" (
    "id" SERIAL NOT NULL,
    "stock_id" INTEGER NOT NULL,
    "tipo" VARCHAR(20) NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "cantidad_antes" INTEGER NOT NULL,
    "cantidad_despues" INTEGER NOT NULL,
    "motivo" VARCHAR(255),
    "referencia_id" INTEGER,
    "referencia_tipo" VARCHAR(50),
    "usuario_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "inv_movimientos_inventario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inv_proveedores" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(255) NOT NULL,
    "ruc" VARCHAR(20),
    "email" VARCHAR(255),
    "telefono" VARCHAR(20),
    "direccion" TEXT,
    "contacto" VARCHAR(100),
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inv_proveedores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inv_ordenes_compra" (
    "id" SERIAL NOT NULL,
    "proveedor_id" INTEGER NOT NULL,
    "numero_orden" VARCHAR(50) NOT NULL,
    "estado" VARCHAR(20) NOT NULL DEFAULT 'pendiente',
    "total" DECIMAL(10,2) NOT NULL,
    "fecha_esperada" TIMESTAMP(3),
    "notas" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inv_ordenes_compra_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inv_detalle_orden_compra" (
    "id" SERIAL NOT NULL,
    "orden_compra_id" INTEGER NOT NULL,
    "producto_id" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "precio_unitario" DECIMAL(10,2) NOT NULL,
    "subtotal" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "inv_detalle_orden_compra_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inv_recepciones" (
    "id" SERIAL NOT NULL,
    "orden_compra_id" INTEGER NOT NULL,
    "fecha_recepcion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notas" TEXT,
    "usuario_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "inv_recepciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inv_ajustes" (
    "id" SERIAL NOT NULL,
    "motivo" VARCHAR(255) NOT NULL,
    "usuario_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "inv_ajustes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inv_detalle_ajuste" (
    "id" SERIAL NOT NULL,
    "ajuste_id" INTEGER NOT NULL,
    "producto_id" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,

    CONSTRAINT "inv_detalle_ajuste_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cli_clientes" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "dni" VARCHAR(20),
    "fecha_nacimiento" TIMESTAMP(3),
    "genero" VARCHAR(10),
    "total_compras" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "num_ordenes" INTEGER NOT NULL DEFAULT 0,
    "ultima_compra" TIMESTAMP(3),
    "segmento" VARCHAR(20) NOT NULL DEFAULT 'nuevo',
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cli_clientes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cli_direcciones" (
    "id" SERIAL NOT NULL,
    "cliente_id" INTEGER NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "apellido" VARCHAR(100) NOT NULL,
    "direccion" VARCHAR(500) NOT NULL,
    "ciudad" VARCHAR(100) NOT NULL,
    "departamento" VARCHAR(100) NOT NULL,
    "codigo_postal" VARCHAR(10),
    "telefono" VARCHAR(20) NOT NULL,
    "es_principal" BOOLEAN NOT NULL DEFAULT false,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cli_direcciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cli_lista_deseos" (
    "id" SERIAL NOT NULL,
    "cliente_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cli_lista_deseos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cli_items_lista_deseos" (
    "id" SERIAL NOT NULL,
    "lista_deseos_id" INTEGER NOT NULL,
    "producto_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cli_items_lista_deseos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cli_resenas_producto" (
    "id" SERIAL NOT NULL,
    "cliente_id" INTEGER NOT NULL,
    "producto_id" INTEGER NOT NULL,
    "calificacion" INTEGER NOT NULL,
    "titulo" VARCHAR(255),
    "comentario" TEXT,
    "aprobada" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cli_resenas_producto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cli_historial_navegacion" (
    "id" SERIAL NOT NULL,
    "cliente_id" INTEGER NOT NULL,
    "producto_id" INTEGER NOT NULL,
    "visited_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cli_historial_navegacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ord_carritos" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER,
    "session_id" VARCHAR(255),
    "estado" VARCHAR(20) NOT NULL DEFAULT 'activo',
    "expires_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ord_carritos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ord_items_carrito" (
    "id" SERIAL NOT NULL,
    "carrito_id" INTEGER NOT NULL,
    "producto_id" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "precio" DECIMAL(10,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ord_items_carrito_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ord_metodos_envio" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "descripcion" VARCHAR(255),
    "precio" DECIMAL(10,2) NOT NULL,
    "dias_estimados" INTEGER NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ord_metodos_envio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ord_estados_orden" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,
    "descripcion" VARCHAR(255),
    "orden" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ord_estados_orden_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ord_ordenes" (
    "id" SERIAL NOT NULL,
    "numero_orden" VARCHAR(20) NOT NULL,
    "usuario_id" INTEGER,
    "direccion_envio_id" INTEGER,
    "metodo_envio_id" INTEGER,
    "estado" VARCHAR(30) NOT NULL DEFAULT 'pendiente_pago',
    "subtotal" DECIMAL(10,2) NOT NULL,
    "igv" DECIMAL(10,2) NOT NULL,
    "costo_envio" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "descuento" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "total" DECIMAL(10,2) NOT NULL,
    "codigo_cupon" VARCHAR(50),
    "notas" TEXT,
    "numero_tracking" VARCHAR(100),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ord_ordenes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ord_items_orden" (
    "id" SERIAL NOT NULL,
    "orden_id" INTEGER NOT NULL,
    "producto_id" INTEGER,
    "nombre_producto" VARCHAR(255) NOT NULL,
    "sku" VARCHAR(50) NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "precio_unitario" DECIMAL(10,2) NOT NULL,
    "subtotal" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "ord_items_orden_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ord_pagos" (
    "id" SERIAL NOT NULL,
    "orden_id" INTEGER NOT NULL,
    "metodo" VARCHAR(50) NOT NULL,
    "estado" VARCHAR(20) NOT NULL DEFAULT 'pendiente',
    "monto" DECIMAL(10,2) NOT NULL,
    "moneda" VARCHAR(3) NOT NULL DEFAULT 'PEN',
    "referencia_ext" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ord_pagos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ord_transacciones_pago" (
    "id" SERIAL NOT NULL,
    "pago_id" INTEGER NOT NULL,
    "tipo" VARCHAR(30) NOT NULL,
    "estado" VARCHAR(20) NOT NULL,
    "monto" DECIMAL(10,2) NOT NULL,
    "respuesta_ext" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ord_transacciones_pago_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ord_historial_estados" (
    "id" SERIAL NOT NULL,
    "orden_id" INTEGER NOT NULL,
    "estado_id" INTEGER,
    "estado" VARCHAR(30) NOT NULL,
    "comentario" TEXT,
    "usuario_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ord_historial_estados_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "seg_roles_nombre_key" ON "seg_roles"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "seg_permisos_modulo_accion_key" ON "seg_permisos"("modulo", "accion");

-- CreateIndex
CREATE UNIQUE INDEX "seg_rol_permiso_rol_id_permiso_id_key" ON "seg_rol_permiso"("rol_id", "permiso_id");

-- CreateIndex
CREATE UNIQUE INDEX "seg_usuarios_email_key" ON "seg_usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "seg_usuario_rol_usuario_id_rol_id_key" ON "seg_usuario_rol"("usuario_id", "rol_id");

-- CreateIndex
CREATE UNIQUE INDEX "configuracion_sistema_clave_key" ON "configuracion_sistema"("clave");

-- CreateIndex
CREATE UNIQUE INDEX "monedas_codigo_key" ON "monedas"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "cat_marcas_nombre_key" ON "cat_marcas"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "cat_unidades_medida_nombre_key" ON "cat_unidades_medida"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "cat_etiquetas_nombre_key" ON "cat_etiquetas"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "cat_atributos_nombre_key" ON "cat_atributos"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "cat_productos_sku_key" ON "cat_productos"("sku");

-- CreateIndex
CREATE INDEX "cat_productos_nombre_idx" ON "cat_productos"("nombre");

-- CreateIndex
CREATE INDEX "cat_productos_sku_idx" ON "cat_productos"("sku");

-- CreateIndex
CREATE INDEX "cat_productos_categoria_id_idx" ON "cat_productos"("categoria_id");

-- CreateIndex
CREATE INDEX "cat_productos_estado_idx" ON "cat_productos"("estado");

-- CreateIndex
CREATE UNIQUE INDEX "cat_producto_atributo_producto_id_valor_atributo_id_key" ON "cat_producto_atributo"("producto_id", "valor_atributo_id");

-- CreateIndex
CREATE UNIQUE INDEX "cat_producto_etiqueta_producto_id_etiqueta_id_key" ON "cat_producto_etiqueta"("producto_id", "etiqueta_id");

-- CreateIndex
CREATE UNIQUE INDEX "inv_stock_producto_producto_id_key" ON "inv_stock_producto"("producto_id");

-- CreateIndex
CREATE UNIQUE INDEX "inv_ordenes_compra_numero_orden_key" ON "inv_ordenes_compra"("numero_orden");

-- CreateIndex
CREATE UNIQUE INDEX "cli_clientes_usuario_id_key" ON "cli_clientes"("usuario_id");

-- CreateIndex
CREATE UNIQUE INDEX "cli_lista_deseos_cliente_id_key" ON "cli_lista_deseos"("cliente_id");

-- CreateIndex
CREATE UNIQUE INDEX "cli_items_lista_deseos_lista_deseos_id_producto_id_key" ON "cli_items_lista_deseos"("lista_deseos_id", "producto_id");

-- CreateIndex
CREATE UNIQUE INDEX "cli_resenas_producto_cliente_id_producto_id_key" ON "cli_resenas_producto"("cliente_id", "producto_id");

-- CreateIndex
CREATE INDEX "ord_carritos_usuario_id_idx" ON "ord_carritos"("usuario_id");

-- CreateIndex
CREATE INDEX "ord_carritos_session_id_idx" ON "ord_carritos"("session_id");

-- CreateIndex
CREATE UNIQUE INDEX "ord_items_carrito_carrito_id_producto_id_key" ON "ord_items_carrito"("carrito_id", "producto_id");

-- CreateIndex
CREATE UNIQUE INDEX "ord_estados_orden_nombre_key" ON "ord_estados_orden"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "ord_ordenes_numero_orden_key" ON "ord_ordenes"("numero_orden");

-- CreateIndex
CREATE INDEX "ord_ordenes_numero_orden_idx" ON "ord_ordenes"("numero_orden");

-- CreateIndex
CREATE INDEX "ord_ordenes_usuario_id_idx" ON "ord_ordenes"("usuario_id");

-- CreateIndex
CREATE INDEX "ord_ordenes_estado_idx" ON "ord_ordenes"("estado");

-- CreateIndex
CREATE INDEX "ord_ordenes_created_at_idx" ON "ord_ordenes"("created_at");

-- CreateIndex
CREATE INDEX "ord_historial_estados_orden_id_idx" ON "ord_historial_estados"("orden_id");

-- AddForeignKey
ALTER TABLE "seg_rol_permiso" ADD CONSTRAINT "seg_rol_permiso_rol_id_fkey" FOREIGN KEY ("rol_id") REFERENCES "seg_roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seg_rol_permiso" ADD CONSTRAINT "seg_rol_permiso_permiso_id_fkey" FOREIGN KEY ("permiso_id") REFERENCES "seg_permisos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seg_usuario_rol" ADD CONSTRAINT "seg_usuario_rol_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "seg_usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seg_usuario_rol" ADD CONSTRAINT "seg_usuario_rol_rol_id_fkey" FOREIGN KEY ("rol_id") REFERENCES "seg_roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auditoria_registro" ADD CONSTRAINT "auditoria_registro_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "seg_usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tipo_cambio" ADD CONSTRAINT "tipo_cambio_moneda_id_fkey" FOREIGN KEY ("moneda_id") REFERENCES "monedas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cat_subcategorias" ADD CONSTRAINT "cat_subcategorias_categoria_id_fkey" FOREIGN KEY ("categoria_id") REFERENCES "cat_categorias"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cat_valores_atributo" ADD CONSTRAINT "cat_valores_atributo_atributo_id_fkey" FOREIGN KEY ("atributo_id") REFERENCES "cat_atributos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cat_productos" ADD CONSTRAINT "cat_productos_categoria_id_fkey" FOREIGN KEY ("categoria_id") REFERENCES "cat_categorias"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cat_productos" ADD CONSTRAINT "cat_productos_subcategoria_id_fkey" FOREIGN KEY ("subcategoria_id") REFERENCES "cat_subcategorias"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cat_productos" ADD CONSTRAINT "cat_productos_marca_id_fkey" FOREIGN KEY ("marca_id") REFERENCES "cat_marcas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cat_productos" ADD CONSTRAINT "cat_productos_unidad_medida_id_fkey" FOREIGN KEY ("unidad_medida_id") REFERENCES "cat_unidades_medida"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cat_imagenes_producto" ADD CONSTRAINT "cat_imagenes_producto_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "cat_productos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cat_producto_atributo" ADD CONSTRAINT "cat_producto_atributo_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "cat_productos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cat_producto_atributo" ADD CONSTRAINT "cat_producto_atributo_valor_atributo_id_fkey" FOREIGN KEY ("valor_atributo_id") REFERENCES "cat_valores_atributo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cat_producto_etiqueta" ADD CONSTRAINT "cat_producto_etiqueta_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "cat_productos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cat_producto_etiqueta" ADD CONSTRAINT "cat_producto_etiqueta_etiqueta_id_fkey" FOREIGN KEY ("etiqueta_id") REFERENCES "cat_etiquetas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inv_stock_producto" ADD CONSTRAINT "inv_stock_producto_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "cat_productos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inv_movimientos_inventario" ADD CONSTRAINT "inv_movimientos_inventario_stock_id_fkey" FOREIGN KEY ("stock_id") REFERENCES "inv_stock_producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inv_ordenes_compra" ADD CONSTRAINT "inv_ordenes_compra_proveedor_id_fkey" FOREIGN KEY ("proveedor_id") REFERENCES "inv_proveedores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inv_detalle_orden_compra" ADD CONSTRAINT "inv_detalle_orden_compra_orden_compra_id_fkey" FOREIGN KEY ("orden_compra_id") REFERENCES "inv_ordenes_compra"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inv_recepciones" ADD CONSTRAINT "inv_recepciones_orden_compra_id_fkey" FOREIGN KEY ("orden_compra_id") REFERENCES "inv_ordenes_compra"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inv_detalle_ajuste" ADD CONSTRAINT "inv_detalle_ajuste_ajuste_id_fkey" FOREIGN KEY ("ajuste_id") REFERENCES "inv_ajustes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cli_clientes" ADD CONSTRAINT "cli_clientes_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "seg_usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cli_direcciones" ADD CONSTRAINT "cli_direcciones_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "cli_clientes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cli_lista_deseos" ADD CONSTRAINT "cli_lista_deseos_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "cli_clientes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cli_items_lista_deseos" ADD CONSTRAINT "cli_items_lista_deseos_lista_deseos_id_fkey" FOREIGN KEY ("lista_deseos_id") REFERENCES "cli_lista_deseos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cli_items_lista_deseos" ADD CONSTRAINT "cli_items_lista_deseos_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "cat_productos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cli_resenas_producto" ADD CONSTRAINT "cli_resenas_producto_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "cli_clientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cli_resenas_producto" ADD CONSTRAINT "cli_resenas_producto_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "cat_productos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cli_historial_navegacion" ADD CONSTRAINT "cli_historial_navegacion_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "cli_clientes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cli_historial_navegacion" ADD CONSTRAINT "cli_historial_navegacion_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "cat_productos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ord_carritos" ADD CONSTRAINT "ord_carritos_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "seg_usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ord_items_carrito" ADD CONSTRAINT "ord_items_carrito_carrito_id_fkey" FOREIGN KEY ("carrito_id") REFERENCES "ord_carritos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ord_items_carrito" ADD CONSTRAINT "ord_items_carrito_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "cat_productos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ord_ordenes" ADD CONSTRAINT "ord_ordenes_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "seg_usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ord_ordenes" ADD CONSTRAINT "ord_ordenes_direccion_envio_id_fkey" FOREIGN KEY ("direccion_envio_id") REFERENCES "cli_direcciones"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ord_ordenes" ADD CONSTRAINT "ord_ordenes_metodo_envio_id_fkey" FOREIGN KEY ("metodo_envio_id") REFERENCES "ord_metodos_envio"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ord_items_orden" ADD CONSTRAINT "ord_items_orden_orden_id_fkey" FOREIGN KEY ("orden_id") REFERENCES "ord_ordenes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ord_items_orden" ADD CONSTRAINT "ord_items_orden_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "cat_productos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ord_pagos" ADD CONSTRAINT "ord_pagos_orden_id_fkey" FOREIGN KEY ("orden_id") REFERENCES "ord_ordenes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ord_transacciones_pago" ADD CONSTRAINT "ord_transacciones_pago_pago_id_fkey" FOREIGN KEY ("pago_id") REFERENCES "ord_pagos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ord_historial_estados" ADD CONSTRAINT "ord_historial_estados_orden_id_fkey" FOREIGN KEY ("orden_id") REFERENCES "ord_ordenes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ord_historial_estados" ADD CONSTRAINT "ord_historial_estados_estado_id_fkey" FOREIGN KEY ("estado_id") REFERENCES "ord_estados_orden"("id") ON DELETE SET NULL ON UPDATE CASCADE;
