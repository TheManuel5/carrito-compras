import { useQuery } from '@tanstack/react-query';
import {
  ScatterChart, Scatter, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';
import { reporteService } from '../../services/orden.service';
import { BarChart3 } from 'lucide-react';

const COLORS_ABC: Record<string, string> = { A: '#1e40af', B: '#10b981', C: '#f59e0b' };
const COLORS_SEG: Record<string, string> = { vip: '#7c3aed', activo: '#10b981', en_riesgo: '#f59e0b', inactivo: '#ef4444' };

export default function Estadisticas() {
  const { data: abc, isLoading: abcLoading } = useQuery({
    queryKey: ['analisis-abc'],
    queryFn: reporteService.analisisABC,
  });

  const { data: rfm, isLoading: rfmLoading } = useQuery({
    queryKey: ['analisis-rfm'],
    queryFn: reporteService.analisisRFM,
  });

  const abcResumen = abc ? {
    A: abc.filter((p: any) => p.clasificacion === 'A'),
    B: abc.filter((p: any) => p.clasificacion === 'B'),
    C: abc.filter((p: any) => p.clasificacion === 'C'),
  } : { A: [], B: [], C: [] };

  const rfmResumen = rfm ? [
    { segmento: 'VIP', count: rfm.filter((c: any) => c.segmento === 'vip').length },
    { segmento: 'Activo', count: rfm.filter((c: any) => c.segmento === 'activo').length },
    { segmento: 'En Riesgo', count: rfm.filter((c: any) => c.segmento === 'en_riesgo').length },
    { segmento: 'Inactivo', count: rfm.filter((c: any) => c.segmento === 'inactivo').length },
  ] : [];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Estadísticas y Análisis</h1>
        <p className="text-gray-500 text-sm mt-1">Análisis descriptivos avanzados del negocio</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Análisis ABC */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-primary-600" />
            <h2 className="font-bold text-gray-800">Análisis ABC de Productos</h2>
          </div>
          <p className="text-xs text-gray-500 mb-4">Clasificación por contribución al ingreso: A=80%, B=15%, C=5%</p>

          {abcLoading ? (
            <div className="h-48 bg-gray-100 rounded-xl animate-pulse" />
          ) : (
            <>
              <div className="grid grid-cols-3 gap-3 mb-4">
                {(['A', 'B', 'C'] as const).map((clase) => (
                  <div key={clase} className="text-center p-3 rounded-xl" style={{ backgroundColor: COLORS_ABC[clase] + '20' }}>
                    <div className="text-2xl font-bold" style={{ color: COLORS_ABC[clase] }}>
                      {abcResumen[clase].length}
                    </div>
                    <div className="text-xs text-gray-500">Clase {clase}</div>
                  </div>
                ))}
              </div>
              <div className="overflow-x-auto max-h-64 overflow-y-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left px-3 py-2 font-semibold text-gray-500 uppercase">Producto</th>
                      <th className="text-right px-3 py-2 font-semibold text-gray-500 uppercase">Ingresos</th>
                      <th className="text-center px-3 py-2 font-semibold text-gray-500 uppercase">Clase</th>
                    </tr>
                  </thead>
                  <tbody>
                    {abc?.slice(0, 15).map((p: any) => (
                      <tr key={p.id} className="border-t border-gray-100 hover:bg-gray-50">
                        <td className="px-3 py-2 text-gray-700">{p.nombre?.substring(0, 30)}{p.nombre?.length > 30 ? '...' : ''}</td>
                        <td className="px-3 py-2 text-right font-mono">S/. {Number(p.ingresos).toFixed(0)}</td>
                        <td className="px-3 py-2 text-center">
                          <span className="font-bold text-xs px-2 py-0.5 rounded" style={{ color: COLORS_ABC[p.clasificacion], backgroundColor: COLORS_ABC[p.clasificacion] + '20' }}>
                            {p.clasificacion}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>

        {/* Análisis RFM */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-purple-600" />
            <h2 className="font-bold text-gray-800">Análisis RFM de Clientes</h2>
          </div>
          <p className="text-xs text-gray-500 mb-4">Recency, Frequency, Monetary — segmentación de clientes</p>

          {rfmLoading ? (
            <div className="h-48 bg-gray-100 rounded-xl animate-pulse" />
          ) : (
            <>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={rfmResumen}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="segmento" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="count" name="Clientes" radius={[4, 4, 0, 0]}>
                    {rfmResumen.map((entry, index) => (
                      <Cell key={index} fill={Object.values(COLORS_SEG)[index]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>

              <div className="mt-4 space-y-2 max-h-48 overflow-y-auto">
                <p className="text-xs font-semibold text-gray-500 uppercase">Top Clientes VIP</p>
                {rfm?.filter((c: any) => c.segmento === 'vip').slice(0, 5).map((c: any) => (
                  <div key={c.id} className="flex justify-between items-center text-xs p-2 bg-purple-50 rounded-lg">
                    <span className="font-medium text-gray-700">{c.nombre} {c.apellido}</span>
                    <span className="font-bold text-purple-700">S/. {Number(c.monetario).toFixed(0)}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Info análisis adicionales */}
      <div className="card">
        <h2 className="font-bold text-gray-800 mb-4">Análisis Disponibles</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { titulo: 'Tendencia de Ventas', desc: 'Regresión lineal + Promedio móvil 3 meses', estado: 'disponible' },
            { titulo: 'Distribución por Hora', desc: 'Ventas por hora del día y día de semana', estado: 'disponible' },
            { titulo: 'Análisis ABC', desc: 'Clasificación por contribución al ingreso', estado: 'activo' },
            { titulo: 'Análisis RFM', desc: 'Segmentación de clientes', estado: 'activo' },
            { titulo: 'Abandono de Carrito', desc: 'Por período y análisis de causas', estado: 'disponible' },
            { titulo: 'Cohorte de Clientes', desc: 'Retención por mes de primera compra', estado: 'disponible' },
            { titulo: 'Correlación Descuento', desc: 'Entre descuento y volumen de venta', estado: 'disponible' },
            { titulo: 'Ticket Promedio', desc: 'Distribución por segmento (box plot)', estado: 'disponible' },
          ].map((a) => (
            <div key={a.titulo} className={`p-3 rounded-xl border ${a.estado === 'activo' ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
              <div className={`text-xs font-bold mb-1 ${a.estado === 'activo' ? 'text-green-700' : 'text-gray-500'}`}>
                {a.estado === 'activo' ? '✓ Activo' : '○ Disponible'}
              </div>
              <p className="text-sm font-medium text-gray-800">{a.titulo}</p>
              <p className="text-xs text-gray-500 mt-0.5">{a.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
