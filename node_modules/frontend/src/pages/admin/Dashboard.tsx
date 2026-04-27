import { useQuery } from '@tanstack/react-query';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  TrendingUp, ShoppingBag, Users, Package, AlertTriangle,
  DollarSign, BarChart3, ShoppingCart, RefreshCw
} from 'lucide-react';
import { reporteService } from '../../services/orden.service';

const COLORES = ['#1e40af', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899'];

interface KpiCardProps {
  titulo: string;
  valor: string | number;
  icono: any;
  color: string;
  descripcion?: string;
}

const KpiCard = ({ titulo, valor, icono: Icon, color, descripcion }: KpiCardProps) => (
  <div className="card flex items-center gap-4">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
    <div>
      <p className="text-2xl font-bold text-gray-800">{valor}</p>
      <p className="text-sm font-medium text-gray-600">{titulo}</p>
      {descripcion && <p className="text-xs text-gray-400">{descripcion}</p>}
    </div>
  </div>
);

export default function Dashboard() {
  const { data: kpis, isLoading: kpisLoading } = useQuery({
    queryKey: ['kpis'],
    queryFn: () => reporteService.kpis(),
    refetchInterval: 60000,
  });

  const { data: graficos, isLoading: graficosLoading } = useQuery({
    queryKey: ['graficos', 'mes'],
    queryFn: () => reporteService.graficos('mes'),
  });

  if (kpisLoading) return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {Array.from({ length: 8 }).map((_, i) => <div key={i} className="h-24 bg-gray-200 rounded-xl animate-pulse" />)}
      </div>
    </div>
  );

  const distribucionEstados = kpis?.distribucion_estados?.map((e: any) => ({
    name: e.estado?.replace(/_/g, ' '),
    value: e._count?.id || 0,
  })) || [];

  const topCategorias = kpis?.ingresos_por_categoria?.map((c: any) => ({
    categoria: c.categoria,
    ingresos: Number(c.total_ingresos || 0),
  })) || [];

  const ventasFecha = graficos?.ventasPorFecha?.map((v: any) => ({
    fecha: new Date(v.fecha).toLocaleDateString('es-PE', { month: 'short', day: 'numeric' }),
    ventas: Number(v.total_ventas || 0),
    ordenes: Number(v.cantidad_ordenes || 0),
  })) || [];

  const topProductos = graficos?.topProductos?.slice(0, 8).map((p: any) => ({
    nombre: p.nombre.substring(0, 20) + (p.nombre.length > 20 ? '...' : ''),
    unidades: Number(p.unidades_vendidas || 0),
  })) || [];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Resumen del negocio - {new Date().toLocaleDateString('es-PE', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100"
        >
          <RefreshCw className="w-4 h-4" /> Actualizar
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard titulo="Ventas Totales" valor={`S/. ${Number(kpis?.ventas_totales || 0).toLocaleString('es-PE', { minimumFractionDigits: 2 })}`} icono={DollarSign} color="bg-primary-700" />
        <KpiCard titulo="Total Órdenes" valor={kpis?.cantidad_ordenes || 0} icono={ShoppingBag} color="bg-green-600" />
        <KpiCard titulo="Ticket Promedio" valor={`S/. ${Number(kpis?.ticket_promedio || 0).toFixed(2)}`} icono={TrendingUp} color="bg-blue-600" />
        <KpiCard titulo="Clientes Nuevos" valor={kpis?.clientes_nuevos || 0} icono={Users} color="bg-purple-600" />
        <KpiCard titulo="Tasa Conversión" valor={`${kpis?.tasa_conversion || 0}%`} icono={BarChart3} color="bg-teal-600" />
        <KpiCard titulo="Abandon. Carrito" valor={`${kpis?.tasa_abandono_carrito || 0}%`} icono={ShoppingCart} color="bg-orange-600" />
        <KpiCard titulo="Prod. Agotados" valor={kpis?.productos_agotados || 0} icono={AlertTriangle} color="bg-red-600" descripcion="Requieren reposición" />
        <KpiCard titulo="Stock Bajo" valor={kpis?.productos_stock_bajo || 0} icono={Package} color="bg-yellow-600" descripcion="Bajo stock mínimo" />
      </div>

      {/* Gráficos fila 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        {/* Evolución de ventas */}
        <div className="card lg:col-span-2">
          <h3 className="font-bold text-gray-800 mb-4">Evolución de Ventas (Mensual)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={ventasFecha}>
              <defs>
                <linearGradient id="colorVentas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1e40af" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#1e40af" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="fecha" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `S/. ${v}`} />
              <Tooltip formatter={(v: any) => [`S/. ${Number(v).toFixed(2)}`, 'Ventas']} />
              <Area type="monotone" dataKey="ventas" stroke="#1e40af" fill="url(#colorVentas)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Distribución por estado */}
        <div className="card">
          <h3 className="font-bold text-gray-800 mb-4">Órdenes por Estado</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={distribucionEstados} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {distribucionEstados.map((_: any, i: number) => (
                  <Cell key={i} fill={COLORES[i % COLORES.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Gráficos fila 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top productos */}
        <div className="card">
          <h3 className="font-bold text-gray-800 mb-4">Top 8 Productos Más Vendidos</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={topProductos} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis type="number" tick={{ fontSize: 10 }} />
              <YAxis type="category" dataKey="nombre" width={130} tick={{ fontSize: 10 }} />
              <Tooltip />
              <Bar dataKey="unidades" fill="#1e40af" radius={[0, 4, 4, 0]} name="Unidades" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Ingresos por categoría */}
        <div className="card">
          <h3 className="font-bold text-gray-800 mb-4">Ingresos por Categoría (Top 5)</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={topCategorias}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="categoria" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `S/. ${v}`} />
              <Tooltip formatter={(v: any) => [`S/. ${Number(v).toFixed(2)}`, 'Ingresos']} />
              <Bar dataKey="ingresos" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
