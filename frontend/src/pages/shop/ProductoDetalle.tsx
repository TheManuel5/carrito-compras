import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ShoppingCart, Heart, Star, ChevronLeft, Plus, Minus, Package } from 'lucide-react';
import { productoService } from '../../services/producto.service';
import { useCartStore } from '../../stores/cartStore';
import toast from 'react-hot-toast';

export default function ProductoDetalle() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem, openCart } = useCartStore();
  const [cantidad, setCantidad] = useState(1);
  const [imagenActiva, setImagenActiva] = useState(0);

  const { data: producto, isLoading, isError } = useQuery({
    queryKey: ['producto', id],
    queryFn: () => productoService.obtener(Number(id)),
    enabled: !!id,
  });

  if (isLoading) return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="aspect-square bg-gray-200 rounded-2xl animate-pulse" />
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-8 bg-gray-200 rounded animate-pulse" />)}
        </div>
      </div>
    </div>
  );

  if (isError || !producto) return (
    <div className="text-center py-20">
      <Package className="w-16 h-16 text-gray-200 mx-auto mb-4" />
      <p className="text-gray-500">Producto no encontrado</p>
    </div>
  );

  const stockDisponible = (producto.stock?.cantidad || 0) - (producto.stock?.cantidad_reservada || 0);
  const tieneOferta = producto.precio_oferta && Number(producto.precio_oferta) < Number(producto.precio_venta);
  const precioActual = tieneOferta ? Number(producto.precio_oferta) : Number(producto.precio_venta);
  const descuento = tieneOferta ? Math.round((1 - Number(producto.precio_oferta) / Number(producto.precio_venta)) * 100) : 0;

  const handleAddToCart = () => {
    if (stockDisponible <= 0) return;
    addItem({
      producto_id: producto.id,
      nombre: producto.nombre,
      sku: producto.sku,
      precio: precioActual,
      cantidad,
      imagen_url: producto.imagenes?.[0]?.url,
      stock_disponible: stockDisponible,
    });
    openCart();
    toast.success(`${producto.nombre} agregado al carrito`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6 text-sm">
        <ChevronLeft className="w-4 h-4" /> Volver
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Galería */}
        <div>
          <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100 mb-3">
            {producto.imagenes?.[imagenActiva]?.url ? (
              <img src={producto.imagenes[imagenActiva].url} alt={producto.nombre} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300">
                <Package className="w-24 h-24" />
              </div>
            )}
          </div>
          {producto.imagenes && producto.imagenes.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {producto.imagenes.map((img: any, i: number) => (
                <button key={img.id} onClick={() => setImagenActiva(i)}
                  className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 ${imagenActiva === i ? 'border-primary-500' : 'border-transparent'}`}>
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="space-y-5">
          {producto.categoria && (
            <p className="text-sm text-primary-600 font-medium uppercase tracking-wider">{producto.categoria.nombre}</p>
          )}
          <h1 className="text-3xl font-bold text-gray-800">{producto.nombre}</h1>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex">
              {[1,2,3,4,5].map((i) => <Star key={i} className={`w-4 h-4 ${i <= 4 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'}`} />)}
            </div>
            <span className="text-sm text-gray-500">(12 reseñas)</span>
          </div>

          {/* Precio */}
          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-bold text-primary-700">S/. {precioActual.toFixed(2)}</span>
            {tieneOferta && (
              <>
                <span className="text-xl text-gray-400 line-through">S/. {Number(producto.precio_venta).toFixed(2)}</span>
                <span className="badge bg-red-100 text-red-700">-{descuento}%</span>
              </>
            )}
          </div>

          {/* Stock */}
          {stockDisponible > 0 ? (
            <p className="text-green-600 text-sm font-medium flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full" />
              En stock ({stockDisponible} disponibles)
            </p>
          ) : (
            <p className="text-red-500 text-sm font-medium">⚠️ Sin stock</p>
          )}

          {/* Descripción */}
          {producto.descripcion_corta && (
            <p className="text-gray-600">{producto.descripcion_corta}</p>
          )}

          {/* Atributos */}
          {producto.marca && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-500">Marca:</span>
              <span className="font-medium text-gray-800">{producto.marca.nombre}</span>
            </div>
          )}

          {/* Cantidad y carrito */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 border border-gray-300 rounded-xl px-3 py-2">
              <button onClick={() => setCantidad(Math.max(1, cantidad - 1))} className="text-gray-600 hover:text-gray-800">
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center font-bold text-lg">{cantidad}</span>
              <button
                onClick={() => setCantidad(Math.min(stockDisponible, cantidad + 1))}
                disabled={cantidad >= stockDisponible}
                className="text-gray-600 hover:text-gray-800 disabled:opacity-40"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={stockDisponible <= 0}
              className="flex-1 btn-primary py-3 text-base rounded-xl flex items-center justify-center gap-2 disabled:bg-gray-400"
            >
              <ShoppingCart className="w-5 h-5" />
              {stockDisponible <= 0 ? 'Sin Stock' : 'Agregar al Carrito'}
            </button>
            <button className="p-3 border border-gray-300 rounded-xl text-gray-500 hover:text-red-500 hover:border-red-300 transition-colors">
              <Heart className="w-5 h-5" />
            </button>
          </div>

          <p className="text-sm text-gray-400">
            SKU: <span className="font-mono">{producto.sku}</span>
          </p>
        </div>
      </div>

      {/* Descripción larga */}
      {producto.descripcion_larga && (
        <div className="mt-10 card">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Descripción del Producto</h2>
          <p className="text-gray-600 leading-relaxed whitespace-pre-line">{producto.descripcion_larga}</p>
        </div>
      )}
    </div>
  );
}
