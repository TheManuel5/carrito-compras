// Footer.tsx
import { Link } from 'react-router-dom';
import { Package, Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-white text-lg">Mi Tienda</span>
          </div>
          <p className="text-sm text-gray-400">Tu tienda online de confianza. Los mejores productos al mejor precio.</p>
          <div className="flex gap-3 mt-4">
            {[Facebook, Instagram, Twitter].map((Icon, i) => (
              <a key={i} href="#" className="text-gray-400 hover:text-white transition-colors">
                <Icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">Tienda</h4>
          <div className="space-y-2 text-sm">
            {[['Catálogo', '/catalogo'], ['Ofertas', '/catalogo?oferta=true'], ['Nuevos', '/catalogo?nuevo=true']].map(([label, href]) => (
              <Link key={href} to={href} className="block hover:text-white transition-colors">{label}</Link>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">Mi Cuenta</h4>
          <div className="space-y-2 text-sm">
            {[['Mi Perfil', '/perfil'], ['Mis Pedidos', '/mis-ordenes'], ['Iniciar Sesión', '/login'], ['Registrarse', '/registro']].map(([label, href]) => (
              <Link key={href} to={href} className="block hover:text-white transition-colors">{label}</Link>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">Contacto</h4>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-primary-400" /><span>Lima, Perú</span></div>
            <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-primary-400" /><span>+51 999 999 999</span></div>
            <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-primary-400" /><span>info@mitienda.com</span></div>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-800 py-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Mi Tienda Online. Todos los derechos reservados.
      </div>
    </footer>
  );
}
