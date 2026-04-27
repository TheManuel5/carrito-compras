import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ChevronRight, Zap, Shield, Truck, RefreshCw } from 'lucide-react';
import { productoService } from '../../services/producto.service';
import ProductCard from '../../components/producto/ProductCard';

const features = [
  { icon: Truck, title: 'Envío Gratis', desc: 'En compras mayores a S/. 100' },
  { icon: Shield, title: 'Compra Segura', desc: 'Pagos 100% protegidos' },
  { icon: RefreshCw, title: 'Devoluciones', desc: '30 días sin preguntas' },
  { icon: Zap, title: 'Entrega Rápida', desc: '24-48 horas a Lima' },
];

export default function Home() {
  const { data, isLoading } = useQuery({
    queryKey: ['productos-destacados'],
    queryFn: productoService.destacados,
  });

  return (
    <div>
      {/* Hero Banner */}
      <section className="relative bg-gradient-to-br from-primary-800 to-primary-600 text-white py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i}
              className="absolute rounded-full bg-white"
              style={{
                width: Math.random() * 100 + 50 + 'px',
                height: Math.random() * 100 + 50 + 'px',
                top: Math.random() * 100 + '%',
                left: Math.random() * 100 + '%',
                opacity: Math.random() * 0.3,
              }}
            />
          ))}
        </div>
        <div className="relative max-w-4xl mx-auto text-center">
          <span className="inline-block bg-white/20 text-white text-sm px-4 py-1 rounded-full mb-6">
            🎉 Ofertas especiales de temporada
          </span>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Los Mejores Productos<br />al Mejor Precio
          </h1>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Descubre miles de productos con envío rápido y seguro a todo el país.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/catalogo" className="bg-white text-primary-700 px-8 py-3 rounded-xl font-bold hover:bg-primary-50 transition-colors text-lg">
              Ver Catálogo
            </Link>
            <Link to="/catalogo?oferta=true" className="border-2 border-white text-white px-8 py-3 rounded-xl font-bold hover:bg-white/10 transition-colors text-lg">
              Ver Ofertas
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 mt-8 mb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {features.map((f) => (
            <div key={f.title} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <f.icon className="w-5 h-5 text-primary-700" />
              </div>
              <div>
                <p className="font-semibold text-gray-800 text-sm">{f.title}</p>
                <p className="text-xs text-gray-500">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Productos Destacados */}
      <section className="max-w-7xl mx-auto px-4 mb-16">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">⭐ Productos Destacados</h2>
            <p className="text-gray-500 text-sm mt-1">Los más vendidos de esta semana</p>
          </div>
          <Link to="/catalogo?destacado=true" className="flex items-center gap-1 text-primary-700 hover:text-primary-800 text-sm font-medium">
            Ver todos <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl h-72 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {data?.destacados?.slice(0, 8).map((p: any) => (
              <ProductCard key={p.id} producto={p} />
            ))}
          </div>
        )}
      </section>

      {/* Nuevos Ingresos */}
      {data?.nuevos?.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 mb-16">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">🆕 Nuevos Ingresos</h2>
              <p className="text-gray-500 text-sm mt-1">Los últimos productos en llegar</p>
            </div>
            <Link to="/catalogo?nuevo=true" className="flex items-center gap-1 text-primary-700 hover:text-primary-800 text-sm font-medium">
              Ver todos <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {data.nuevos.slice(0, 4).map((p: any) => (
              <ProductCard key={p.id} producto={p} />
            ))}
          </div>
        </section>
      )}

      {/* Ofertas */}
      {data?.ofertas?.length > 0 && (
        <section className="bg-gradient-to-r from-red-50 to-orange-50 py-12 mb-0">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">🔥 Ofertas Especiales</h2>
                <p className="text-gray-500 text-sm mt-1">Precios rebajados por tiempo limitado</p>
              </div>
              <Link to="/catalogo?oferta=true" className="flex items-center gap-1 text-red-600 hover:text-red-700 text-sm font-medium">
                Ver todos <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {data.ofertas.slice(0, 4).map((p: any) => (
                <ProductCard key={p.id} producto={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
