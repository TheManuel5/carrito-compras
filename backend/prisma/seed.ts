import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...');

  // Roles
  const roles = await Promise.all([
    prisma.seg_roles.upsert({ where: { nombre: 'administrador' }, update: {}, create: { nombre: 'administrador', descripcion: 'Acceso total al sistema' } }),
    prisma.seg_roles.upsert({ where: { nombre: 'cliente' }, update: {}, create: { nombre: 'cliente', descripcion: 'Cliente comprador' } }),
    prisma.seg_roles.upsert({ where: { nombre: 'gerente_ventas' }, update: {}, create: { nombre: 'gerente_ventas', descripcion: 'Gestión de ventas' } }),
    prisma.seg_roles.upsert({ where: { nombre: 'gerente_inventario' }, update: {}, create: { nombre: 'gerente_inventario', descripcion: 'Gestión de inventario' } }),
    prisma.seg_roles.upsert({ where: { nombre: 'vendedor' }, update: {}, create: { nombre: 'vendedor', descripcion: 'Vendedor y atención al cliente' } }),
  ]);
  console.log('✅ Roles creados');

  // Permisos
  const modulos = ['productos', 'categorias', 'ordenes', 'inventario', 'clientes', 'reportes', 'usuarios', 'estadisticas'];
  const acciones = ['leer', 'crear', 'editar', 'eliminar', 'aprobar'];
  for (const modulo of modulos) {
    for (const accion of acciones) {
      await prisma.seg_permisos.upsert({
        where: { modulo_accion: { modulo, accion } },
        update: {},
        create: { modulo, accion, descripcion: `Permiso para ${accion} en ${modulo}` },
      });
    }
  }
  console.log('✅ Permisos creados');

  // Admin user
  const adminHash = await bcrypt.hash('Admin123!', 12);
  const adminUser = await prisma.seg_usuarios.upsert({
    where: { email: 'admin@carritocompras.com' },
    update: {},
    create: {
      email: 'admin@carritocompras.com',
      nombre: 'Administrador',
      apellido: 'Sistema',
      password_hash: adminHash,
      email_verificado: true,
      activo: true,
    },
  });
  await prisma.seg_usuario_rol.upsert({
    where: { usuario_id_rol_id: { usuario_id: adminUser.id, rol_id: roles[0].id } },
    update: {},
    create: { usuario_id: adminUser.id, rol_id: roles[0].id },
  });
  console.log('✅ Usuario administrador creado: admin@carritocompras.com / Admin123!');

  // Monedas
  await prisma.monedas.upsert({ where: { codigo: 'PEN' }, update: {}, create: { codigo: 'PEN', nombre: 'Sol Peruano', simbolo: 'S/.' } });
  await prisma.monedas.upsert({ where: { codigo: 'USD' }, update: {}, create: { codigo: 'USD', nombre: 'Dólar Americano', simbolo: '$' } });
  console.log('✅ Monedas creadas');

  // Marcas
  const marcas = ['Samsung', 'LG', 'Sony', 'Apple', 'HP', 'Lenovo', 'Nike', 'Adidas', 'Sin Marca'];
  for (const nombre of marcas) {
    await prisma.cat_marcas.upsert({ where: { nombre }, update: {}, create: { nombre } });
  }
  console.log('✅ Marcas creadas');

  // Unidades de medida
  const unidades = [
    { nombre: 'Unidad', simbolo: 'und' },
    { nombre: 'Kilogramo', simbolo: 'kg' },
    { nombre: 'Litro', simbolo: 'L' },
    { nombre: 'Metro', simbolo: 'm' },
    { nombre: 'Par', simbolo: 'par' },
  ];
  for (const u of unidades) {
    await prisma.cat_unidades_medida.upsert({ where: { nombre: u.nombre }, update: {}, create: u });
  }
  console.log('✅ Unidades de medida creadas');

  // Categorías y subcategorías
  const catElectronica = await prisma.cat_categorias.upsert({
    where: { id: 1 }, update: {}, create: { nombre: 'Electrónica', descripcion: 'Dispositivos electrónicos', imagen_url: 'https://picsum.photos/seed/electronica/400/300' },
  });
  const catRopa = await prisma.cat_categorias.upsert({
    where: { id: 2 }, update: {}, create: { nombre: 'Ropa y Accesorios', descripcion: 'Moda y estilo', imagen_url: 'https://picsum.photos/seed/ropa/400/300' },
  });
  const catDeportes = await prisma.cat_categorias.upsert({
    where: { id: 3 }, update: {}, create: { nombre: 'Deportes', descripcion: 'Equipamiento deportivo', imagen_url: 'https://picsum.photos/seed/deportes/400/300' },
  });
  const catHogar = await prisma.cat_categorias.upsert({
    where: { id: 4 }, update: {}, create: { nombre: 'Hogar y Jardín', descripcion: 'Para tu hogar', imagen_url: 'https://picsum.photos/seed/hogar/400/300' },
  });

  const subSmartphones = await prisma.cat_subcategorias.create({ data: { categoria_id: catElectronica.id, nombre: 'Smartphones', descripcion: 'Teléfonos inteligentes' } }).catch(() => prisma.cat_subcategorias.findFirst({ where: { nombre: 'Smartphones' } })) as any;
  const subLaptops = await prisma.cat_subcategorias.create({ data: { categoria_id: catElectronica.id, nombre: 'Laptops', descripcion: 'Computadoras portátiles' } }).catch(() => prisma.cat_subcategorias.findFirst({ where: { nombre: 'Laptops' } })) as any;
  console.log('✅ Categorías creadas');

  // Marcas IDs
  const samsung = await prisma.cat_marcas.findUnique({ where: { nombre: 'Samsung' } });
  const apple = await prisma.cat_marcas.findUnique({ where: { nombre: 'Apple' } });
  const nike = await prisma.cat_marcas.findUnique({ where: { nombre: 'Nike' } });
  const unidad = await prisma.cat_unidades_medida.findUnique({ where: { nombre: 'Unidad' } });

  // Métodos de envío
  await prisma.ord_metodos_envio.createMany({
    data: [
      { nombre: 'Envío Estándar', descripcion: 'Entrega en 5-7 días hábiles', precio: 10.00, dias_estimados: 7 },
      { nombre: 'Envío Express', descripcion: 'Entrega en 1-2 días hábiles', precio: 25.00, dias_estimados: 2 },
      { nombre: 'Recojo en Tienda', descripcion: 'Recoge en nuestras tiendas', precio: 0.00, dias_estimados: 1 },
    ],
    skipDuplicates: true,
  });
  console.log('✅ Métodos de envío creados');

  // Estados de orden
  const estados = [
    { nombre: 'pendiente_pago', descripcion: 'Esperando confirmación de pago', orden: 1 },
    { nombre: 'pagada', descripcion: 'Pago confirmado', orden: 2 },
    { nombre: 'en_proceso', descripcion: 'En preparación', orden: 3 },
    { nombre: 'enviada', descripcion: 'En camino', orden: 4 },
    { nombre: 'entregada', descripcion: 'Entregada al cliente', orden: 5 },
    { nombre: 'cancelada', descripcion: 'Orden cancelada', orden: 6 },
    { nombre: 'devuelta', descripcion: 'Devolución procesada', orden: 7 },
  ];
  for (const e of estados) {
    await prisma.ord_estados_orden.upsert({ where: { nombre: e.nombre }, update: {}, create: e });
  }
  console.log('✅ Estados de orden creados');

  // Configuración del sistema
  const configs = [
    { clave: 'igv_porcentaje', valor: '18', tipo: 'number', descripcion: 'Porcentaje de IGV/IVA' },
    { clave: 'moneda_default', valor: 'PEN', tipo: 'string', descripcion: 'Moneda por defecto' },
    { clave: 'nombre_empresa', valor: 'Mi Tienda Online', tipo: 'string', descripcion: 'Nombre de la empresa' },
    { clave: 'email_soporte', valor: 'soporte@mitienda.com', tipo: 'string', descripcion: 'Email de soporte' },
    { clave: 'stock_alerta_minimo', valor: '5', tipo: 'number', descripcion: 'Stock mínimo para alertas' },
    { clave: 'checkout_timeout_min', valor: '15', tipo: 'number', descripcion: 'Tiempo en minutos para reserva en checkout' },
  ];
  for (const c of configs) {
    await prisma.configuracion_sistema.upsert({ where: { clave: c.clave }, update: {}, create: c });
  }
  console.log('✅ Configuración del sistema creada');

  // 20 Productos de ejemplo
  const productos = [
    { sku: 'SAM-S24-001', nombre: 'Samsung Galaxy S24 Ultra', descripcion_corta: 'Smartphone flagship 2024', precio_costo: 2800, precio_venta: 3999, categoria_id: catElectronica.id, subcategoria_id: subSmartphones?.id, marca_id: samsung?.id, unidad_medida_id: unidad?.id, destacado: true, nuevo: true },
    { sku: 'APL-IPH15-001', nombre: 'Apple iPhone 15 Pro Max', descripcion_corta: 'iPhone más avanzado', precio_costo: 3200, precio_venta: 4599, categoria_id: catElectronica.id, subcategoria_id: subSmartphones?.id, marca_id: apple?.id, unidad_medida_id: unidad?.id, destacado: true },
    { sku: 'SAM-GAL-002', nombre: 'Samsung Galaxy A55', descripcion_corta: 'Smartphone gama media premium', precio_costo: 900, precio_venta: 1399, precio_oferta: 1199, categoria_id: catElectronica.id, subcategoria_id: subSmartphones?.id, marca_id: samsung?.id, unidad_medida_id: unidad?.id },
    { sku: 'APL-IPH15-002', nombre: 'Apple iPhone 15', descripcion_corta: 'iPhone estándar 2024', precio_costo: 2100, precio_venta: 2999, categoria_id: catElectronica.id, subcategoria_id: subSmartphones?.id, marca_id: apple?.id, unidad_medida_id: unidad?.id },
    { sku: 'LEN-LAP-001', nombre: 'Lenovo IdeaPad 5 Pro', descripcion_corta: 'Laptop para trabajo y estudio', precio_costo: 1800, precio_venta: 2799, categoria_id: catElectronica.id, subcategoria_id: subLaptops?.id, unidad_medida_id: unidad?.id, destacado: true },
    { sku: 'HP-LAP-001', nombre: 'HP Pavilion Gaming 15', descripcion_corta: 'Laptop gaming entry-level', precio_costo: 2200, precio_venta: 3299, precio_oferta: 2999, categoria_id: catElectronica.id, subcategoria_id: subLaptops?.id, unidad_medida_id: unidad?.id },
    { sku: 'APL-MAC-001', nombre: 'MacBook Air M3', descripcion_corta: 'Laptop ultradelgada Apple', precio_costo: 3500, precio_venta: 4999, categoria_id: catElectronica.id, subcategoria_id: subLaptops?.id, marca_id: apple?.id, unidad_medida_id: unidad?.id, destacado: true },
    { sku: 'NIK-ZAP-001', nombre: 'Nike Air Max 270', descripcion_corta: 'Zapatillas running premium', precio_costo: 250, precio_venta: 459, categoria_id: catDeportes.id, marca_id: nike?.id, unidad_medida_id: unidad?.id, nuevo: true },
    { sku: 'NIK-ZAP-002', nombre: 'Nike Revolution 7', descripcion_corta: 'Zapatillas running accesibles', precio_costo: 150, precio_venta: 279, precio_oferta: 239, categoria_id: catDeportes.id, marca_id: nike?.id, unidad_medida_id: unidad?.id },
    { sku: 'ADS-ZAP-001', nombre: 'Adidas Ultraboost 23', descripcion_corta: 'Zapatillas alta performance', precio_costo: 290, precio_venta: 499, categoria_id: catDeportes.id, unidad_medida_id: unidad?.id, destacado: true },
    { sku: 'ROB-CAM-001', nombre: 'Camiseta Polo Slim Fit', descripcion_corta: 'Camiseta polo 100% algodón', precio_costo: 35, precio_venta: 79, categoria_id: catRopa.id, unidad_medida_id: unidad?.id },
    { sku: 'ROB-PAN-001', nombre: 'Pantalón Chino Clásico', descripcion_corta: 'Pantalón casual elegante', precio_costo: 60, precio_venta: 129, categoria_id: catRopa.id, unidad_medida_id: unidad?.id },
    { sku: 'ROB-CHO-001', nombre: 'Chaqueta Impermeable Outdoor', descripcion_corta: 'Perfecta para lluvia', precio_costo: 120, precio_venta: 229, precio_oferta: 189, categoria_id: catRopa.id, unidad_medida_id: unidad?.id, nuevo: true },
    { sku: 'HOG-CAF-001', nombre: 'Cafetera Espresso Automática', descripcion_corta: 'Café perfecto cada mañana', precio_costo: 350, precio_venta: 599, categoria_id: catHogar.id, unidad_medida_id: unidad?.id, destacado: true },
    { sku: 'HOG-LIC-001', nombre: 'Licuadora de Alta Potencia 1000W', descripcion_corta: 'Para batidos y sopas', precio_costo: 120, precio_venta: 219, categoria_id: catHogar.id, unidad_medida_id: unidad?.id },
    { sku: 'DEP-PEL-001', nombre: 'Pelota de Fútbol Profesional', descripcion_corta: 'Balón FIFA Quality Pro', precio_costo: 80, precio_venta: 149, categoria_id: catDeportes.id, unidad_medida_id: unidad?.id },
    { sku: 'SAM-TV-001', nombre: 'Smart TV Samsung 55" 4K QLED', descripcion_corta: 'Experiencia cinematográfica en casa', precio_costo: 1800, precio_venta: 2799, categoria_id: catElectronica.id, marca_id: samsung?.id, unidad_medida_id: unidad?.id, destacado: true },
    { sku: 'HOG-ASP-001', nombre: 'Aspiradora Robot Inteligente', descripcion_corta: 'Limpieza automática con IA', precio_costo: 450, precio_venta: 799, precio_oferta: 699, categoria_id: catHogar.id, unidad_medida_id: unidad?.id, nuevo: true },
    { sku: 'DEP-MAN-001', nombre: 'Mancuernas Ajustables 20kg', descripcion_corta: 'Set completo para gym en casa', precio_costo: 200, precio_venta: 349, categoria_id: catDeportes.id, unidad_medida_id: unidad?.id },
    { sku: 'APL-IPD-001', nombre: 'iPad Air M2 11"', descripcion_corta: 'Tablet premium para creativos', precio_costo: 1800, precio_venta: 2599, categoria_id: catElectronica.id, marca_id: apple?.id, unidad_medida_id: unidad?.id, destacado: true, nuevo: true },
  ];

  for (const p of productos) {
    const created = await prisma.cat_productos.create({
      data: {
        ...p,
        precio_costo: p.precio_costo,
        precio_venta: p.precio_venta,
        precio_oferta: p.precio_oferta ?? null,
        descripcion_larga: `${p.descripcion_corta}. Producto de alta calidad con garantía de satisfacción.`,
      },
    }).catch(() => null);

    if (created) {
      // Imagen placeholder
      await prisma.cat_imagenes_producto.create({
        data: {
          producto_id: created.id,
          url: `https://picsum.photos/seed/${created.sku}/600/600`,
          alt: created.nombre,
          es_principal: true,
          orden: 0,
        },
      });
      // Stock inicial
      await prisma.inv_stock_producto.create({
        data: {
          producto_id: created.id,
          cantidad: Math.floor(Math.random() * 80) + 20,
          cantidad_min: 5,
        },
      });
    }
  }

  console.log('✅ 20 productos de ejemplo creados con stock e imágenes');
  console.log('🎉 Seed completado exitosamente!');
  console.log('');
  console.log('📋 Credenciales de acceso:');
  console.log('   Admin: admin@carritocompras.com / Admin123!');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
