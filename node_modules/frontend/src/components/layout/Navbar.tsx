import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu, Search, LogOut, LayoutDashboard, Package } from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { useCartStore } from '../../stores/cartStore';
import { authService } from '../../services/auth.service';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { isAuthenticated, user, isAdmin, isStaff } = useAuthStore();
  const { getTotalItems, toggleCart } = useCartStore();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalogo?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = async () => {
    await authService.logout();
    toast.success('Sesión cerrada');
    navigate('/');
  };

  const totalItems = getTotalItems();

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-700 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-primary-800 hidden sm:block">Mi Tienda</span>
          </Link>

          {/* Búsqueda */}
          <form onSubmit={handleSearch} className="flex-1 max-w-md mx-4 hidden md:flex">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar productos..."
                className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary-600">
                <Search className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Acciones */}
          <div className="flex items-center gap-2">
            {/* Carrito */}
            <button
              onClick={toggleCart}
              className="relative p-2 text-gray-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors"
            >
              <ShoppingCart className="w-6 h-6" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </button>

            {/* Usuario */}
            {isAuthenticated ? (
              <div className="relative group">
                <button className="flex items-center gap-2 p-2 text-gray-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors">
                  <User className="w-5 h-5" />
                  <span className="text-sm font-medium hidden sm:block">{user?.nombre}</span>
                </button>
                <div className="absolute right-0 mt-1 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <Link to="/perfil" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    <User className="w-4 h-4" /> Mi Perfil
                  </Link>
                  <Link to="/mis-ordenes" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    <Package className="w-4 h-4" /> Mis Pedidos
                  </Link>
                  {isStaff() && (
                    <Link to="/admin/dashboard" className="flex items-center gap-2 px-4 py-2 text-sm text-primary-700 hover:bg-primary-50 font-medium">
                      <LayoutDashboard className="w-4 h-4" /> Panel Admin
                    </Link>
                  )}
                  <hr className="my-1 border-gray-100" />
                  <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left">
                    <LogOut className="w-4 h-4" /> Cerrar Sesión
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="text-sm text-gray-600 hover:text-primary-700 px-3 py-2 rounded-lg hover:bg-primary-50 transition-colors">
                  Ingresar
                </Link>
                <Link to="/registro" className="btn-primary text-sm py-1.5 px-4">
                  Registrarse
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Categorías nav */}
        <div className="flex items-center gap-6 pb-2 overflow-x-auto">
          {['Electrónica', 'Ropa', 'Deportes', 'Hogar'].map((cat) => (
            <Link
              key={cat}
              to={`/catalogo?categoria=${cat}`}
              className="text-sm text-gray-600 hover:text-primary-700 whitespace-nowrap transition-colors"
            >
              {cat}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
