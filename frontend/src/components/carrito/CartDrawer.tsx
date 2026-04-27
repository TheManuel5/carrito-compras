import { X, ShoppingBag, Plus, Minus, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../../stores/cartStore';
import { useAuthStore } from '../../stores/authStore';

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, getSubtotal, getIgv, getTotal } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const handleCheckout = () => {
    closeCart();
    if (!isAuthenticated) {
      navigate('/login?redirect=/checkout');
    } else {
      navigate('/checkout');
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={closeCart} />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-primary-700" />
            <h2 className="font-bold text-lg">Mi Carrito</h2>
            {items.length > 0 && (
              <span className="bg-primary-100 text-primary-700 text-xs font-bold px-2 py-0.5 rounded-full">
                {items.reduce((acc, i) => acc + i.cantidad, 0)} items
              </span>
            )}
          </div>
          <button onClick={closeCart} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
              <ShoppingBag className="w-16 h-16 text-gray-200 mb-4" />
              <p className="font-medium">Tu carrito está vacío</p>
              <p className="text-sm mt-1">Agrega productos para comenzar</p>
              <button onClick={closeCart} className="mt-4 btn-primary text-sm">
                Explorar Catálogo
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.producto_id} className="flex gap-3 bg-gray-50 rounded-xl p-3">
                {item.imagen_url ? (
                  <img src={item.imagen_url} alt={item.nombre} className="w-16 h-16 object-cover rounded-lg flex-shrink-0" />
                ) : (
                  <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0 flex items-center justify-center">
                    <ShoppingBag className="w-6 h-6 text-gray-400" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 line-clamp-2">{item.nombre}</p>
                  <p className="text-xs text-gray-500 mt-0.5">SKU: {item.sku}</p>
                  <p className="text-sm font-bold text-primary-700 mt-1">
                    S/. {item.precio.toFixed(2)}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <button
                    onClick={() => removeItem(item.producto_id)}
                    className="text-red-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => updateQuantity(item.producto_id, item.cantidad - 1)}
                      className="w-6 h-6 bg-white border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-8 text-center text-sm font-medium">{item.cantidad}</span>
                    <button
                      onClick={() => updateQuantity(item.producto_id, item.cantidad + 1)}
                      disabled={item.cantidad >= item.stock_disponible}
                      className="w-6 h-6 bg-white border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50 disabled:opacity-40"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <p className="text-xs text-gray-500">
                    S/. {(item.precio * item.cantidad).toFixed(2)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer con totales */}
        {items.length > 0 && (
          <div className="border-t border-gray-200 p-4 space-y-3">
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>S/. {getSubtotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>IGV (18%)</span>
                <span>S/. {getIgv().toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-base border-t border-gray-200 pt-2">
                <span>Total</span>
                <span className="text-primary-700">S/. {getTotal().toFixed(2)}</span>
              </div>
            </div>
            <button onClick={handleCheckout} className="w-full btn-primary py-3 text-base rounded-xl">
              Proceder al Checkout
            </button>
            <Link to="/carrito" onClick={closeCart} className="block text-center text-sm text-gray-500 hover:text-gray-700 transition-colors">
              Ver carrito completo
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
