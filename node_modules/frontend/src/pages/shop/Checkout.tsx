import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../../stores/cartStore';
import { useAuthStore } from '../../stores/authStore';
import { ordenService } from '../../services/orden.service';
import toast from 'react-hot-toast';
import { CheckCircle, CreditCard, MapPin, Truck, ClipboardList } from 'lucide-react';

const pasos = ['Identificación', 'Dirección', 'Envío', 'Pago', 'Confirmación'];

export default function Checkout() {
  const [paso, setPaso] = useState(1);
  const [metodoPago, setMetodoPago] = useState('contra_entrega');
  const [metodoEnvioId, setMetodoEnvioId] = useState(1);
  const [loading, setLoading] = useState(false);
  const { getTotal, getSubtotal, getIgv, clearCart, items } = useCartStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const [direccion, setDireccion] = useState({
    nombre: user?.nombre || '',
    apellido: user?.apellido || '',
    direccion: '',
    ciudad: 'Lima',
    departamento: 'Lima',
    telefono: '',
  });

  const handlePedido = async () => {
    setLoading(true);
    try {
      const ordenData = {
        items: items.map((item) => ({
          producto_id: item.producto_id,
          cantidad: item.cantidad,
          precio_unitario: item.precio,
        })),
        metodo_envio_id: metodoEnvioId,
        metodo_pago: metodoPago,
        direccion_envio: direccion,
        subtotal: getSubtotal(),
        igv: getIgv(),
        costo_envio: metodoEnvioId === 3 ? 0 : metodoEnvioId === 2 ? 25 : 10,
        total: getTotal(),
      };

      await ordenService.crear(ordenData);
      toast.success('¡Pedido realizado exitosamente!');
      clearCart();
      navigate('/mis-ordenes');
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Error al procesar el pedido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Checkout</h1>

      {/* Progreso */}
      <div className="flex items-center mb-8 overflow-x-auto pb-2">
        {pasos.map((nombre, i) => (
          <div key={nombre} className="flex items-center flex-shrink-0">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${paso > i + 1 ? 'bg-green-500 text-white' : paso === i + 1 ? 'bg-primary-700 text-white' : 'bg-gray-200 text-gray-400'}`}>
              {paso > i + 1 ? '✓' : i + 1}
            </div>
            <span className={`ml-2 text-sm ${paso === i + 1 ? 'font-semibold text-primary-700' : 'text-gray-400'} hidden sm:inline`}>{nombre}</span>
            {i < pasos.length - 1 && <div className={`mx-3 h-0.5 w-12 ${paso > i + 1 ? 'bg-green-500' : 'bg-gray-200'}`} />}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {paso === 1 && (
            <div className="card">
              <div className="flex items-center gap-2 mb-4"><ClipboardList className="w-5 h-5 text-primary-600" /><h2 className="font-bold">Identificación</h2></div>
              <p className="text-gray-600 text-sm mb-2">Estás comprando como:</p>
              <p className="font-medium">{user?.nombre} {user?.apellido}</p>
              <p className="text-gray-500 text-sm">{user?.email}</p>
              <button onClick={() => setPaso(2)} className="btn-primary py-2 px-6 rounded-xl mt-4">Continuar</button>
            </div>
          )}

          {paso === 2 && (
            <div className="card">
              <div className="flex items-center gap-2 mb-4"><MapPin className="w-5 h-5 text-primary-600" /><h2 className="font-bold">Dirección de Envío</h2></div>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                    <input className="input-field" value={direccion.nombre} onChange={e => setDireccion({...direccion, nombre: e.target.value})} placeholder="Juan" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
                    <input className="input-field" value={direccion.apellido} onChange={e => setDireccion({...direccion, apellido: e.target.value})} placeholder="Pérez" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                  <input className="input-field" value={direccion.direccion} onChange={e => setDireccion({...direccion, direccion: e.target.value})} placeholder="Av. Principal 123" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad</label>
                    <input className="input-field" value={direccion.ciudad} onChange={e => setDireccion({...direccion, ciudad: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Departamento</label>
                    <input className="input-field" value={direccion.departamento} onChange={e => setDireccion({...direccion, departamento: e.target.value})} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                  <input className="input-field" value={direccion.telefono} onChange={e => setDireccion({...direccion, telefono: e.target.value})} placeholder="+51 999 999 999" />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setPaso(1)} className="btn-secondary py-2 px-6 rounded-xl">Atrás</button>
                <button onClick={() => setPaso(3)} disabled={!direccion.direccion || !direccion.telefono} className="btn-primary py-2 px-6 rounded-xl disabled:opacity-50">Continuar</button>
              </div>
            </div>
          )}

          {paso === 3 && (
            <div className="card">
              <div className="flex items-center gap-2 mb-4"><Truck className="w-5 h-5 text-primary-600" /><h2 className="font-bold">Método de Envío</h2></div>
              <div className="space-y-3">
                {[
                  { id: 1, nombre: 'Envío Estándar', descripcion: '5-7 días hábiles', precio: 10 },
                  { id: 2, nombre: 'Envío Express', descripcion: '1-2 días hábiles', precio: 25 },
                  { id: 3, nombre: 'Recojo en Tienda', descripcion: 'Disponible al instante', precio: 0 },
                ].map((m) => (
                  <label key={m.id} className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl cursor-pointer hover:border-primary-500">
                    <input type="radio" name="envio" checked={metodoEnvioId === m.id} onChange={() => setMetodoEnvioId(m.id)} className="accent-primary-700" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{m.nombre}</p>
                      <p className="text-sm text-gray-500">{m.descripcion}</p>
                    </div>
                    <span className="font-bold text-primary-700">{m.precio === 0 ? 'Gratis' : `S/. ${m.precio.toFixed(2)}`}</span>
                  </label>
                ))}
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setPaso(2)} className="btn-secondary py-2 px-6 rounded-xl">Atrás</button>
                <button onClick={() => setPaso(4)} className="btn-primary py-2 px-6 rounded-xl">Continuar</button>
              </div>
            </div>
          )}

          {paso === 4 && (
            <div className="card">
              <div className="flex items-center gap-2 mb-4"><CreditCard className="w-5 h-5 text-primary-600" /><h2 className="font-bold">Método de Pago</h2></div>
              <div className="space-y-3">
                {[
                  { id: 'contra_entrega', label: 'Contra Entrega', desc: 'Paga cuando recibas tu pedido' },
                  { id: 'transferencia', label: 'Transferencia Bancaria', desc: 'Datos bancarios al confirmar' },
                  { id: 'stripe', label: 'Tarjeta de Crédito/Débito', desc: 'Visa, Mastercard, Amex' },
                ].map((m) => (
                  <label key={m.id} className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl cursor-pointer hover:border-primary-500">
                    <input type="radio" name="pago" value={m.id} checked={metodoPago === m.id} onChange={() => setMetodoPago(m.id)} className="accent-primary-700" />
                    <div>
                      <p className="font-medium text-gray-800">{m.label}</p>
                      <p className="text-sm text-gray-500">{m.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setPaso(3)} className="btn-secondary py-2 px-6 rounded-xl">Atrás</button>
                <button onClick={() => setPaso(5)} className="btn-primary py-2 px-6 rounded-xl">Revisar Pedido</button>
              </div>
            </div>
          )}

          {paso === 5 && (
            <div className="card">
              <div className="flex items-center gap-2 mb-4"><CheckCircle className="w-5 h-5 text-green-600" /><h2 className="font-bold">Confirmar Pedido</h2></div>
              <div className="space-y-2 mb-4 text-sm">
                <p className="text-gray-500">Enviando a: <span className="font-medium text-gray-800">{direccion.direccion}, {direccion.ciudad}</span></p>
                <p className="text-gray-500">Pago: <span className="font-medium text-gray-800">{metodoPago.replace(/_/g, ' ')}</span></p>
              </div>
              <div className="space-y-2 mb-6">
                {items.map((item) => (
                  <div key={item.producto_id} className="flex justify-between text-sm">
                    <span className="text-gray-700">{item.nombre} x{item.cantidad}</span>
                    <span className="font-medium">S/. {(item.precio * item.cantidad).toFixed(2)}</span>
                  </div>
                ))}
                <div className="border-t pt-3 flex justify-between font-bold text-base">
                  <span>Total</span>
                  <span className="text-primary-700">S/. {getTotal().toFixed(2)}</span>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setPaso(4)} className="btn-secondary py-2 px-6 rounded-xl">Atrás</button>
                <button onClick={handlePedido} disabled={loading} className="btn-primary py-3 px-8 rounded-xl flex-1 flex items-center justify-center gap-2">
                  {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : '✓ Confirmar y Pagar'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Resumen lateral */}
        <div className="card h-fit sticky top-24">
          <h3 className="font-bold mb-4">Tu Pedido</h3>
          <div className="space-y-2 text-sm">
            {items.map((item) => (
              <div key={item.producto_id} className="flex justify-between text-gray-600">
                <span className="truncate mr-2">{item.nombre} x{item.cantidad}</span>
                <span className="flex-shrink-0">S/. {(item.precio * item.cantidad).toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t pt-3 space-y-1">
              <div className="flex justify-between text-gray-500"><span>Subtotal</span><span>S/. {getSubtotal().toFixed(2)}</span></div>
              <div className="flex justify-between text-gray-500"><span>IGV (18%)</span><span>S/. {getIgv().toFixed(2)}</span></div>
              <div className="flex justify-between font-bold text-base">
                <span>Total</span>
                <span className="text-primary-700">S/. {getTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}