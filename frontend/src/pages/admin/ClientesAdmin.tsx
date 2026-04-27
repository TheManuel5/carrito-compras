import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Users, Search } from 'lucide-react';
import api from '../../services/api';

export default function ClientesAdmin() {
  const [search, setSearch] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-clientes', search],
    queryFn: async () => {
      const r = await api.get('/clientes', { params: { search, limit: 50 } });
      return r.data;
    },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Gestión de Clientes</h1>

      <div className="card mb-4">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar por nombre o email..." className="input-field pl-9" />
        </div>
      </div>

      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['Cliente', 'Email', 'Segmento', 'Total Compras', 'Nro. Órdenes', 'Última Compra', 'Estado'].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => <tr key={i}>{Array.from({ length: 7 }).map((_, j) => <td key={j} className="px-4 py-3"><div className="h-4 bg-gray-200 rounded animate-pulse" /></td>)}</tr>)
              ) : !data?.data || data.data.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-12 text-gray-500">
                  <Users className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                  No hay clientes registrados
                </td></tr>
              ) : data.data.map((c: any) => {
                const segmentoBadge: Record<string, string> = { nuevo: 'badge-info', recurrente: 'badge-success', inactivo: 'badge-gray', vip: 'badge-warning' };
                return (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-sm">{c.usuario?.nombre} {c.usuario?.apellido}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{c.usuario?.email}</td>
                    <td className="px-4 py-3">
                      <span className={`badge ${segmentoBadge[c.segmento] || 'badge-gray'}`}>{c.segmento}</span>
                    </td>
                    <td className="px-4 py-3 text-sm font-bold text-primary-700">S/. {Number(c.total_compras || 0).toFixed(2)}</td>
                    <td className="px-4 py-3 text-sm text-center">{c.num_ordenes || 0}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {c.ultima_compra ? new Date(c.ultima_compra).toLocaleDateString('es-PE') : 'Sin compras'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`badge ${c.activo ? 'badge-success' : 'badge-danger'}`}>{c.activo ? 'Activo' : 'Inactivo'}</span>
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
