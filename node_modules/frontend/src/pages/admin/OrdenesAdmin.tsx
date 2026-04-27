import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { ShoppingBag, Search, ChevronDown } from 'lucide-react';
import { ordenService } from '../../services/orden.service';
import toast from 'react-hot-toast';

const estadosBadge: Record<string, string> = {
  pendiente_pago: 'badge-warning',
  pagada: 'badge-info',
  en_proceso: 'badge-info',
  enviada: 'badge-info',
  entregada: 'badge-success',
  cancelada: 'badge-danger',
  devuelta: 'badge-gray',
};

const estadosSiguientes: Record<string, string[]> = {
  pendiente_pago: ['pagada', 'cancelada'],
  pagada: ['en_proceso', 'cancelada'],
  en_proceso: ['enviada', 'cancelada'],
  enviada: ['entregada', 'devuelta'],
  entregada: ['devuelta'],
  cancelada: [],
  devuelta: [],
};

export default function OrdenesAdmin() {
  const [search, setSearch] = useState('');
  const [estadoFiltro, setEstadoFiltro] = useState('');
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-ordenes', search, estadoFiltro, page],
    queryFn: () => ordenService.listar({ search, estado: estadoFiltro || undefined, page, limit: 20 } as any),
  });

  const cambiarEstadoMutation = useMutation({
    mutationFn: ({ id, estado }: { id: number; estado: string }) =>
      ordenService.cambiarEstado(id, estado),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-ordenes'] });
      toast.success('Estado actualizado');
    },
    onError: () => toast.error('Error al actualizar'),
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gestión de Órdenes</h1>
          <p className="text-gray-500 text-sm mt-1">{data?.total || 0} órdenes en total</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="card mb-4 flex gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Nro. de orden..." className="input-field pl-9" />
        </div>
        <select value={estadoFiltro} onChange={(e) => { setEstadoFiltro(e.target.value); setPage(1); }} className="input-field max-w-xs">
          <option value="">Todos los estados</option>
          <option value="pendiente_pago">Pendiente Pago</option>
          <option value="pagada">Pagada</option>
          <option value="en_proceso">En Proceso</option>
          <option value="enviada">Enviada</option>
          <option value="entregada">Entregada</option>
          <option value="cancelada">Cancelada</option>
        </select>
      </div>

      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['Nro. Orden', 'Fecha', 'Cliente', 'Items', 'Total', 'Estado', 'Acciones'].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>{Array.from({ length: 7 }).map((_, j) => <td key={j} className="px-4 py-3"><div className="h-4 bg-gray-200 rounded animate-pulse" /></td>)}</tr>
                ))
              ) : data?.data?.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-12 text-gray-500"><ShoppingBag className="w-12 h-12 text-gray-200 mx-auto mb-3" />No hay órdenes</td></tr>
              ) : data?.data?.map((orden: any) => {
                const siguientes = estadosSiguientes[orden.estado] || [];
                return (
                  <tr key={orden.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-mono text-sm font-bold text-primary-700">{orden.numero_orden}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{new Date(orden.created_at).toLocaleDateString('es-PE')}</td>
                    <td className="px-4 py-3 text-sm">
                      <p className="font-medium">{orden.usuario?.nombre} {orden.usuario?.apellido}</p>
                      <p className="text-xs text-gray-400">{orden.usuario?.email}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-center">{orden.items?.length || 0}</td>
                    <td className="px-4 py-3 text-sm font-bold text-primary-700">S/. {Number(orden.total).toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <span className={`badge ${estadosBadge[orden.estado] || 'badge-gray'}`}>
                        {orden.estado?.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {siguientes.length > 0 && (
                        <div className="flex gap-1 flex-wrap">
                          {siguientes.map((sig) => (
                            <button
                              key={sig}
                              onClick={() => cambiarEstadoMutation.mutate({ id: orden.id, estado: sig })}
                              className="text-xs px-2 py-1 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors"
                            >
                              → {sig.replace(/_/g, ' ')}
                            </button>
                          ))}
                        </div>
                      )}
                      <a href={ordenService.facturaUrl(orden.id)} target="_blank" className="text-xs text-gray-400 hover:text-gray-600 mt-1 block">
                        📄 Factura
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {data?.totalPages > 1 && (
          <div className="flex justify-center gap-2 py-4 border-t border-gray-100">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1 border rounded-lg text-sm disabled:opacity-40">Anterior</button>
            <span className="text-sm text-gray-500">Página {page} de {data.totalPages}</span>
            <button onClick={() => setPage(p => Math.min(data.totalPages, p + 1))} disabled={page === data.totalPages} className="px-3 py-1 border rounded-lg text-sm disabled:opacity-40">Siguiente</button>
          </div>
        )}
      </div>
    </div>
  );
}
