# 🛒 Sistema Web de E-Commerce — Carrito de Compras

Sistema web completo de e-commerce desarrollado con **React 18 + TypeScript + Node.js/Express + PostgreSQL 16**.

---

## 📋 Stack Tecnológico

### Frontend
| Tecnología | Propósito |
|---|---|
| React 18 + TypeScript 5 | Framework UI |
| Vite 5 | Build tool |
| React Router v6 | Routing con rutas protegidas |
| Zustand | Estado global (auth, carrito) |
| TanStack Query v5 | Cache y sincronización de datos del servidor |
| Recharts 2.x | Gráficos del dashboard |
| Tailwind CSS 3 | Estilos |
| React Hook Form + Zod | Formularios y validación |
| Axios | HTTP Client con interceptores JWT |

### Backend
| Tecnología | Propósito |
|---|---|
| Node.js 20 LTS + TypeScript | Runtime |
| Express 4.18 | Framework web |
| Prisma 5 | ORM tipado |
| Zod | Validación de requests |
| JWT + bcrypt | Autenticación y hash |
| PDFKit | Reportes operacionales PDF |
| Puppeteer | Reportes de gestión PDF con gráficos |
| Winston | Logging estructurado |
| Swagger/OpenAPI | Documentación API |

### Base de Datos
- **PostgreSQL 16+**
- Convención: snake_case en español
- Prefijos por módulo: `cat_`, `ord_`, `inv_`, `cli_`, `seg_`

---

## 🚀 Instalación y Configuración

### Requisitos Previos
- Node.js 20 LTS o superior
- PostgreSQL 16 o superior
- npm 9+

### 1. Clonar el repositorio
```bash
git clone <url-repositorio>
cd carrito-compras
```

### 2. Instalar dependencias
```bash
npm install
npm install --workspace=backend
npm install --workspace=frontend
```

### 3. Configurar variables de entorno
```bash
cp backend/.env.example backend/.env
# Editar backend/.env con tus configuraciones
```

### 4. Crear la base de datos
```bash
# Opción A: Con el script SQL
psql -U postgres -f sql/create_database.sql

# Opción B: Con Prisma
cd backend
npx prisma migrate dev --name init
```

### 5. Cargar datos semilla
```bash
cd backend
npm run db:seed
```

### 6. Iniciar el proyecto
```bash
# Desde la raíz (inicia frontend y backend simultáneamente)
npm run dev

# O por separado:
npm run dev:backend   # Puerto 3001
npm run dev:frontend  # Puerto 5173
```

---

## 🌐 URLs del Sistema

| URL | Descripción |
|---|---|
| `http://localhost:5173` | Tienda Online (Frontend) |
| `http://localhost:5173/admin` | Panel de Administración |
| `http://localhost:3001/api/docs` | Documentación Swagger/OpenAPI |
| `http://localhost:3001/health` | Health check del servidor |

---

## 🔐 Credenciales de Acceso (Seed)

| Usuario | Contraseña | Rol |
|---|---|---|
| admin@carritocompras.com | Admin123! | Administrador |

---

## 📦 Módulos del Sistema

### 🏪 Tienda (Clientes)
- **Home**: Productos destacados, nuevos y ofertas
- **Catálogo**: Filtros por categoría, marca, precio; búsqueda fuzzy; ordenamiento; paginación
- **Detalle de Producto**: Galería, atributos, stock, reseñas
- **Carrito**: Persistencia en localStorage (invitado) + sincronización backend (autenticado)
- **Checkout**: Proceso en 5 pasos (identificación → dirección → envío → pago → confirmación)
- **Mis Órdenes**: Historial con descarga de facturas PDF
- **Perfil**: Datos personales y direcciones

### 🔧 Administración
- **Dashboard**: 9 KPIs + 4 gráficos Recharts con datos en tiempo real
- **Productos**: CRUD completo con filtros, imágenes y gestión de stock
- **Órdenes**: Gestión de estados con historial de cambios
- **Inventario**: Control de stock, ajustes y movimientos
- **Clientes**: Listado con segmentación (nuevo, recurrente, inactivo, VIP)
- **Reportes**: 8 reportes operacionales (PDFKit) + 6 reportes de gestión (Puppeteer)
- **Estadísticas**: Análisis ABC de productos + Análisis RFM de clientes

---

## 👥 Roles del Sistema

| Rol | Descripción |
|---|---|
| `administrador` | Acceso total |
| `cliente` | Comprador (solo tienda) |
| `gerente_ventas` | Dashboard + ventas + clientes (lectura) |
| `gerente_inventario` | Productos + inventario |
| `vendedor` | Órdenes (lectura + cambio básico) |
| Invitado | Catálogo + carrito local |

---

## 📊 Dashboard — KPIs y Gráficos

### KPIs (9 indicadores)
- Ventas totales del período
- Cantidad de órdenes
- Ticket promedio
- Tasa de conversión
- Tasa de abandono de carrito
- Productos agotados
- Productos con stock bajo
- Clientes nuevos
- Órdenes pendientes de procesamiento

### Gráficos (Recharts)
1. **Área**: Evolución de ventas diarias/semanales/mensuales
2. **Barras**: Ventas por categoría de producto
3. **PieChart**: Distribución de órdenes por estado
4. **Barras horizontales**: Top 10 productos más vendidos
5. Análisis ABC (tabla + resumen)
6. Análisis RFM (gráfico de barras + tabla)

---

## 📄 Reportes PDF

### Operacionales (PDFKit)
1. Listado de órdenes del período
2. Inventario valorizado por categoría
3. Movimientos de inventario
4. Productos con stock bajo o agotado
5. Detalle de pagos recibidos
6. Devoluciones
7. Factura individual por orden
8. Comprobante simplificado

### Gestión (Puppeteer)
1. Rentabilidad por producto (margen bruto)
2. Ventas por categoría — comparativa mensual
3. Comportamiento de carritos
4. Clientes: segmentación
5. Rotación de inventario
6. Ingresos vs costos — comparativa mensual

---

## 📁 Estructura del Proyecto

```
carrito-compras/
├── package.json                # Monorepo root
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma       # Modelo de datos completo
│   │   └── seed.ts             # 20 productos + roles + semilla
│   ├── src/
│   │   ├── index.ts            # Entry point
│   │   ├── app.ts              # Express + middlewares
│   │   ├── config/             # Prisma, logger, env
│   │   ├── controllers/        # auth, producto, carrito, orden, reporte
│   │   ├── services/           # auth, producto, carrito, orden, reporte
│   │   ├── routes/             # auth, producto, carrito, orden, inventario, reporte
│   │   ├── middlewares/        # auth JWT, RBAC, errorHandler
│   │   ├── schemas/            # Validación Zod
│   │   └── utils/              # pdfGenerator (PDFKit)
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── App.tsx             # Router principal
│   │   ├── pages/
│   │   │   ├── shop/           # Home, Catalogo, ProductoDetalle, Carrito, Checkout, MisOrdenes, Perfil, Login, Registro
│   │   │   └── admin/          # Dashboard, ProductosAdmin, OrdenesAdmin, InventarioAdmin, ClientesAdmin, Reportes, Estadisticas
│   │   ├── components/
│   │   │   ├── layout/         # Navbar, Footer, ShopLayout, AdminLayout
│   │   │   ├── carrito/        # CartDrawer
│   │   │   └── producto/       # ProductCard
│   │   ├── stores/             # authStore, cartStore, uiStore (Zustand)
│   │   ├── services/           # api.ts (Axios), auth, producto, orden
│   │   ├── routes/             # ProtectedRoute
│   │   └── types/              # TypeScript interfaces
│   └── tailwind.config.js
└── sql/
    └── create_database.sql     # Script SQL completo con semilla
```

---

## 🔧 Scripts Disponibles

```bash
# Raíz
npm run dev              # Inicia frontend y backend
npm run build            # Build de producción
npm run db:migrate       # Ejecuta migraciones Prisma
npm run db:seed          # Carga datos semilla
npm run db:studio        # Prisma Studio (GUI de BD)
npm run test             # Tests del backend

# Backend
cd backend
npm run dev              # Desarrollo con hot-reload
npm run build            # Compilar TypeScript
npm run db:generate      # Regenerar Prisma Client
```

---

## 🛡️ Seguridad Implementada

- **JWT**: Access Token (15 min) + Refresh Token (7 días) con revocación en BD
- **bcrypt**: Hash de contraseñas con 12 salt rounds
- **RBAC**: Role-Based Access Control con middleware por endpoint
- **Helmet.js**: Headers de seguridad HTTP
- **Rate Limiting**: Por IP (100 req/15 min)
- **CORS**: Configurado para el origen del frontend
- **Zod**: Validación de input en todos los endpoints
- **Auditoría**: Log automático de acciones críticas

---

## 📝 Convenciones de Código

- **TypeScript strict mode** en frontend y backend
- **kebab-case** para archivos
- **PascalCase** para componentes React y tipos
- **camelCase** para funciones y variables
- **snake_case en español** para tablas de BD
- **Conventional Commits**: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`

---

## 📮 API Endpoints Principales

```
POST   /api/v1/auth/registro
POST   /api/v1/auth/login
POST   /api/v1/auth/refresh
POST   /api/v1/auth/logout

GET    /api/v1/productos
GET    /api/v1/productos/:id
POST   /api/v1/productos           [admin/inventario]
PUT    /api/v1/productos/:id       [admin/inventario]
DELETE /api/v1/productos/:id       [admin]

GET    /api/v1/carrito
POST   /api/v1/carrito/items
PUT    /api/v1/carrito/items/:id
DELETE /api/v1/carrito/items/:id
DELETE /api/v1/carrito

GET    /api/v1/ordenes
POST   /api/v1/ordenes
GET    /api/v1/ordenes/:id
PATCH  /api/v1/ordenes/:id/estado  [staff]
GET    /api/v1/ordenes/:id/factura

GET    /api/v1/inventario/stock    [staff]
POST   /api/v1/inventario/ajuste   [admin/inventario]
GET    /api/v1/inventario/movimientos

GET    /api/v1/reportes/kpis       [gerentes]
GET    /api/v1/reportes/graficos   [gerentes]
GET    /api/v1/reportes/abc        [gerentes]
GET    /api/v1/reportes/rfm        [gerentes]
GET    /api/v1/reportes/pdf/ordenes
GET    /api/v1/reportes/pdf/inventario
```

Documentación completa: **http://localhost:3001/api/docs**

---

## 🤝 Desarrollado con

Especificación técnica: **Prompt Mejorado Sistema Web Carrito de Compras** (Abril 2026)

Stack: React 18 · Node.js 20 · PostgreSQL 16 · TypeScript 5 · Prisma 5 · Recharts 2 · PDFKit · Tailwind CSS 3
