import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';

// Layouts
import ShopLayout from './components/layout/ShopLayout';
import AdminLayout from './components/layout/AdminLayout';
import ProtectedRoute from './routes/ProtectedRoute';

// Shop Pages (lazy)
const Home = lazy(() => import('./pages/shop/Home'));
const Catalogo = lazy(() => import('./pages/shop/Catalogo'));
const ProductoDetalle = lazy(() => import('./pages/shop/ProductoDetalle'));
const Carrito = lazy(() => import('./pages/shop/Carrito'));
const Checkout = lazy(() => import('./pages/shop/Checkout'));
const MisOrdenes = lazy(() => import('./pages/shop/MisOrdenes'));
const Perfil = lazy(() => import('./pages/shop/Perfil'));
const Login = lazy(() => import('./pages/shop/Login'));
const Registro = lazy(() => import('./pages/shop/Registro'));

// Admin Pages (lazy)
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const ProductosAdmin = lazy(() => import('./pages/admin/ProductosAdmin'));
const OrdenesAdmin = lazy(() => import('./pages/admin/OrdenesAdmin'));
const InventarioAdmin = lazy(() => import('./pages/admin/InventarioAdmin'));
const ClientesAdmin = lazy(() => import('./pages/admin/ClientesAdmin'));
const Reportes = lazy(() => import('./pages/admin/Reportes'));
const Estadisticas = lazy(() => import('./pages/admin/Estadisticas'));

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-700" />
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {/* Rutas públicas / tienda */}
          <Route element={<ShopLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/catalogo" element={<Catalogo />} />
            <Route path="/producto/:id" element={<ProductoDetalle />} />
            <Route path="/carrito" element={<Carrito />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />

            {/* Rutas autenticadas (cliente) */}
            <Route element={<ProtectedRoute roles={['cliente', 'administrador', 'gerente_ventas', 'gerente_inventario', 'vendedor']} />}>
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/mis-ordenes" element={<MisOrdenes />} />
              <Route path="/perfil" element={<Perfil />} />
            </Route>
          </Route>

          {/* Rutas de administración */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={['administrador', 'gerente_ventas', 'gerente_inventario', 'vendedor']}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="productos" element={
              <ProtectedRoute roles={['administrador', 'gerente_inventario']}>
                <ProductosAdmin />
              </ProtectedRoute>
            } />
            <Route path="ordenes" element={<OrdenesAdmin />} />
            <Route path="inventario" element={
              <ProtectedRoute roles={['administrador', 'gerente_inventario']}>
                <InventarioAdmin />
              </ProtectedRoute>
            } />
            <Route path="clientes" element={
              <ProtectedRoute roles={['administrador', 'gerente_ventas']}>
                <ClientesAdmin />
              </ProtectedRoute>
            } />
            <Route path="reportes" element={<Reportes />} />
            <Route path="estadisticas" element={<Estadisticas />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
