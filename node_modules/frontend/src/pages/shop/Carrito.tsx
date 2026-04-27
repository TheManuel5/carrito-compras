import { useCartStore } from '../../stores/cartStore';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';

export default function Carrito() {
  const { items, removeItem, updateQuantity, getSubtotal, getIgv, getTotal, clearCart } = useCartStore();

  if (items.length === 0) return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-center">
      <ShoppingBag className="w-24 h-24 text-gray-200 mx-auto mb-6" />
      <h1 className="text-2xl font-bold text-gray-700 mb-3">Tu carrito está vacío</h1>
      <p className="text-gray-500 mb-8">Explora nuestro catálogo y encuentra lo que necesitas</p>
      <Link to="/catalogo" className="btn-primary inline-block px-8 py-3 text-base rounded-xl">
        Explorar Catálogo
      </Link>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Mi Carrito ({items.reduce((a, i) => a + i.cantidad, 0)} items)</h1>
        <button onClick={clearCart} className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1">
          <Trash2 className="w-4 h-4" /> Vaciar carrito
        </button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          {items.map((item) => (
            <div key={item.producto_id} className="bg-white rounded-xl border border-gray-100 p-4 flex gap-4">
              <div className="w-24 h-24 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                {item.imagen_url ? (
                  <img src={item.imagen_url} alt={item.nombre} className="w-full h-full object-cover" />
                ) : <ShoppingBag className="w-8 h-8 text-gray-300 m-auto mt-8" />}
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-800">{item.nombre}</h3>
                <p className="text-xs text-gray-400">SKU: {item.sku}</p>
                <p className="text-primary-700 font-bold mt-1">S/. {item.precio.toFixed(2)}</p>
              </div>
              <div className="flex flex-col items-end gap-3">
                <button onClick={() => removeItem(item.producto_id)} className="text-red-400 hover:text-red-600">
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-2 py-1">
                  <button onClick={() => updateQuantity(item.producto_id, item.cantidad - 1)}>
                    <Minus className="w-3 h-3 text-gray-600" />
                  </button>
                  <span className="w-6 text-center text-sm font-medium">{item.cantidad}</span>
                  <button onClick={() => updateQuantity(item.producto_id, item.cantidad + 1)} disabled={item.cantidad >= item.stock_disponible}>
                    <Plus className="w-3 h-3 text-gray-600 disabled:opacity-40" />
                  </button>
                </div>
                <p className="text-sm font-bold">S/. {(item.precio * item.cantidad).toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="lg:col-span-1">
          <div className="card sticky top-24 space-y-4">
            <h2 className="font-bold text-lg">Resumen del Pedido</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>S/. {getSubtotal().toFixed(2)}</span></div>
              <div className="flex justify-between text-gray-600"><span>IGV (18%)</span><span>S/. {getIgv().toFixed(2)}</span></div>
              <div className="flex justify-between font-bold text-base border-t border-gray-100 pt-3">
                <span>Total</span><span className="text-primary-700">S/. {getTotal().toFixed(2)}</span>
              </div>
            </div>
            <Link to="/checkout" className="w-full btn-primary py-3 text-base rounded-xl text-center block">
              Proceder al Checkout
            </Link>
            <Link to="/catalogo" className="block text-center text-sm text-gray-500 hover:text-gray-700">
              Seguir comprando
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
