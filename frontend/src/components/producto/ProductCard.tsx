import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import { Producto } from '../../types';
import { useCartStore } from '../../stores/cartStore';
import toast from 'react-hot-toast';

interface ProductCardProps {
  producto: Producto;
}

export default function ProductCard({ producto }: ProductCardProps) {
  const { addItem, openCart } = useCartStore();
  const imagen = producto.imagenes?.[0]?.url;
  const stockDisponible = (producto.stock?.cantidad || 0) - (producto.stock?.cantidad_reservada || 0);
  const tieneOferta = producto.precio_oferta && Number(producto.precio_oferta) < Number(producto.precio_venta);
  const descuento = tieneOferta
    ? Math.round((1 - Number(producto.precio_oferta) / Number(producto.precio_venta)) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (stockDisponible <= 0) return;

    addItem({
      producto_id: producto.id,
      nombre: producto.nombre,
      sku: producto.sku,
      precio: tieneOferta ? Number(producto.precio_oferta) : Number(producto.precio_venta),
      cantidad: 1,
      imagen_url: imagen,
      stock_disponible: stockDisponible,
    });
    openCart();
    toast.success('Producto agregado al carrito');
  };

  return (
    <Link to={`/producto/${producto.id}`} className="group block">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
        {/* Imagen */}
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          {imagen ? (
            <img
              src={imagen}
              alt={producto.nombre}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300">
              <ShoppingCart className="w-12 h-12" />
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {producto.nuevo && (
              <span className="badge bg-green-500 text-white text-xs">Nuevo</span>
            )}
            {tieneOferta && (
              <span className="badge bg-red-500 text-white text-xs">-{descuento}%</span>
            )}
            {stockDisponible <= 0 && (
              <span className="badge bg-gray-500 text-white text-xs">Agotado</span>
            )}
          </div>

          {/* Wishlist */}
          <button className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-500">
            <Heart className="w-4 h-4" />
          </button>

          {/* Add to cart overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-2 translate-y-full group-hover:translate-y-0 transition-transform duration-200">
            <button
              onClick={handleAddToCart}
              disabled={stockDisponible <= 0}
              className="w-full bg-primary-700 text-white py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:bg-primary-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              <ShoppingCart className="w-4 h-4" />
              {stockDisponible <= 0 ? 'Sin Stock' : 'Agregar al Carrito'}
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="p-3">
          {producto.categoria && (
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">{producto.categoria.nombre}</p>
          )}
          <h3 className="font-medium text-gray-800 text-sm line-clamp-2 mb-2">{producto.nombre}</h3>

          {/* Rating placeholder */}
          <div className="flex items-center gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} className={`w-3 h-3 ${i <= 4 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'}`} />
            ))}
            <span className="text-xs text-gray-400 ml-1">(12)</span>
          </div>

          {/* Precio */}
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-primary-700">
              S/. {(tieneOferta ? Number(producto.precio_oferta) : Number(producto.precio_venta)).toFixed(2)}
            </span>
            {tieneOferta && (
              <span className="text-sm text-gray-400 line-through">
                S/. {Number(producto.precio_venta).toFixed(2)}
              </span>
            )}
          </div>

          {/* Stock indicator */}
          {stockDisponible > 0 && stockDisponible <= 10 && (
            <p className="text-xs text-orange-500 mt-1">¡Solo {stockDisponible} disponibles!</p>
          )}
        </div>
      </div>
    </Link>
  );
}
