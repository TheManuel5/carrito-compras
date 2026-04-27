import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Package, ShoppingBag, Warehouse, Users,
  FileText, BarChart3, Menu, X, LogOut, ChevronRight
} from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { authService } from '../../services/auth.service';
import toast from 'react-hot-toast';

const navItems = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: [] },
  { path: '/admin/productos', label: 'Productos', icon: Package, roles: ['administrador', 'gerente_inventario'] },
  { path: '/admin/ordenes', label: 'Órdenes', icon: ShoppingBag, roles: [] },
  { path: '/admin/inventario', label: 'Inventario', icon: Warehouse, roles: ['administrador', 'gerente_inventario'] },
  { path: '/admin/clientes', label: 'Clientes', icon: Users, roles: ['administrador', 'gerente_ventas'] },
  { path: '/admin/reportes', label: 'Reportes', icon: FileText, roles: [] },
  { path: '/admin/estadisticas', label: 'Estadísticas', icon: BarChart3, roles: [] },
];

export default function AdminLayout() {
  const { user, hasRole } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = async () => {
    await authService.logout();
    toast.success('Sesión cerrada');
    navigate('/');
  };

  const filteredNav = navItems.filter(
    (item) => item.roles.length === 0 || item.roles.some((r) => hasRole(r))
  );

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-primary-800 text-white flex flex-col transition-all duration-300 ease-in-out flex-shrink-0`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-primary-700">
          {sidebarOpen && <span className="font-bold text-lg">Panel Admin</span>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-primary-200 hover:text-white p-1 rounded">
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* User info */}
        {sidebarOpen && (
          <div className="px-4 py-3 border-b border-primary-700">
            <div className="text-sm font-medium">{user?.nombre} {user?.apellido}</div>
            <div className="text-xs text-primary-300">{user?.roles?.[0]?.replace(/_/g, ' ')}</div>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 py-4 space-y-1 overflow-y-auto">
          {filteredNav.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-2.5 mx-2 rounded-lg transition-colors ${
                  active
                    ? 'bg-white text-primary-800 font-semibold'
                    : 'text-primary-100 hover:bg-primary-700 hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && <span className="text-sm">{item.label}</span>}
                {sidebarOpen && active && <ChevronRight className="w-4 h-4 ml-auto" />}
              </Link>
            );
          })}
        </nav>

        {/* Footer links */}
        <div className="p-4 border-t border-primary-700 space-y-2">
          <Link
            to="/"
            className="flex items-center gap-3 text-primary-200 hover:text-white text-sm py-2 px-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Package className="w-4 h-4" />
            {sidebarOpen && 'Ver Tienda'}
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 text-red-300 hover:text-red-200 text-sm py-2 px-2 rounded-lg hover:bg-primary-700 transition-colors w-full"
          >
            <LogOut className="w-4 h-4" />
            {sidebarOpen && 'Cerrar Sesión'}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
