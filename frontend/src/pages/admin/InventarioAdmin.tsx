import { useQuery } from '@tanstack/react-query';
import { AlertTriangle, Warehouse, Package } from 'lucide-react';
import api from '../../services/api';

export default function InventarioAdmin() {
  const { data, isLoading } = useQuery({
    queryKey: ['inventario-stock'],
    queryFn: async () => { const r = await api.get('/inventario/stock'); return r.data.data; },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Control de Inventario</h1>
        <div className="flex gap-3">
          <button className="btn-secondary flex items-center gap-2 text-sm">
            <AlertTriangle className="w-4 h-4 text-orange-500" /> Stock Bajo
          </button>
          <button className="btn-primary flex items-center gap-2 text-sm">
            <Warehouse className="w-4 h-4" /> Registrar Ajuste
          </button>
        </div>
      </div>

      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['Producto', 'SKU', 'Categoría', 'Stock Físico', 'Reservado', 'Disponible', 'Estado'].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i}>{Array.from({ length: 7 }).map((_, j) => <td key={j} className="px-4 py-3"><div className="h-4 bg-gray-200 rounded animate-pulse" /></td>)}</tr>
                ))
              ) : data?.map((s: any) => {
                const disponible = s.cantidad - s.cantidad_reservada;
                const estadoStock = s.cantidad === 0 ? 'agotado' : disponible <= s.cantidad_min ? 'bajo' : 'ok';
                return (
                  <tr key={s.id} className={`hover:bg-gray-50 ${s.cantidad === 0 ? 'bg-red-50' : ''}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                          {s.producto?.imagenes?.[0]?.url ? (
                            <img src={s.producto.imagenes[0].url} alt="" className="w-full h-full object-cover" />
                          ) : <Package className="w-4 h-4 text-gray-300 m-2" />}
                        </div>
                        <span className="text-sm font-medium text-gray-800">{s.producto?.nombre}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm font-mono text-gray-500">{s.producto?.sku}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{s.producto?.categoria?.nombre}</td>
                    <td className="px-4 py-3 text-sm font-bold text-center">{s.cantidad}</td>
                    <td className="px-4 py-3 text-sm text-center text-orange-600">{s.cantidad_reservada}</td>
                    <td className="px-4 py-3 text-sm font-bold text-center">{disponible}</td>
                    <td className="px-4 py-3">
                      <span className={`badge ${estadoStock === 'ok' ? 'badge-success' : estadoStock === 'bajo' ? 'badge-warning' : 'badge-danger'}`}>
                        {estadoStock === 'ok' ? 'En Stock' : estadoStock === 'bajo' ? 'Stock Bajo' : 'Agotado'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
