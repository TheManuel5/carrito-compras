import { FileText, Download, BarChart3, Package, ShoppingBag, Users, TrendingUp, RefreshCw } from 'lucide-react';
import { reporteService } from '../../services/orden.service';

interface ReporteCard {
  titulo: string;
  descripcion: string;
  tipo: 'operacional' | 'gestion';
  icono: any;
  url?: string;
  action?: () => void;
}

export default function Reportes() {
  const reportesOperacionales: ReporteCard[] = [
    { titulo: 'Reporte de Órdenes', descripcion: 'Listado de órdenes del período con detalle de productos y estados', tipo: 'operacional', icono: ShoppingBag, url: reporteService.pdfOrdenesUrl() },
    { titulo: 'Inventario Valorizado', descripcion: 'Stock actual valorizado por categoría y producto', tipo: 'operacional', icono: Package, url: reporteService.pdfInventarioUrl() },
    { titulo: 'Movimientos de Inventario', descripcion: 'Entradas y salidas del período', tipo: 'operacional', icono: RefreshCw },
    { titulo: 'Productos Stock Bajo', descripcion: 'Productos con stock por debajo del mínimo', tipo: 'operacional', icono: Package },
    { titulo: 'Pagos Recibidos', descripcion: 'Detalle de pagos recibidos en el período', tipo: 'operacional', icono: TrendingUp },
    { titulo: 'Devoluciones', descripcion: 'Listado de devoluciones con motivo y estado', tipo: 'operacional', icono: RefreshCw },
  ];

  const reportesGestion: ReporteCard[] = [
    { titulo: 'Rentabilidad por Producto', descripcion: 'Margen bruto por producto y categoría', tipo: 'gestion', icono: BarChart3 },
    { titulo: 'Ventas por Categoría', descripcion: 'Comparativa mensual de ventas por categoría', tipo: 'gestion', icono: BarChart3 },
    { titulo: 'Comportamiento del Carrito', descripcion: 'Análisis de abandono, conversión y ticket promedio', tipo: 'gestion', icono: ShoppingBag },
    { titulo: 'Análisis de Clientes', descripcion: 'Segmentación: nuevos, recurrentes, inactivos, VIP', tipo: 'gestion', icono: Users },
    { titulo: 'Rotación de Inventario', descripcion: 'Rotación por categoría y nivel de servicio', tipo: 'gestion', icono: Package },
    { titulo: 'Ingresos vs Costos', descripcion: 'Comparativa mensual de ingresos y costos', tipo: 'gestion', icono: TrendingUp },
  ];

  const ReporteItem = ({ reporte }: { reporte: ReporteCard }) => (
    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${reporte.tipo === 'operacional' ? 'bg-blue-100' : 'bg-purple-100'}`}>
        <reporte.icono className={`w-5 h-5 ${reporte.tipo === 'operacional' ? 'text-blue-600' : 'text-purple-600'}`} />
      </div>
      <div className="flex-1">
        <p className="font-medium text-gray-800 text-sm">{reporte.titulo}</p>
        <p className="text-xs text-gray-500">{reporte.descripcion}</p>
      </div>
      {reporte.url ? (
        <a
          href={reporte.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-sm text-primary-700 hover:text-primary-800 font-medium bg-white border border-primary-200 px-3 py-1.5 rounded-lg hover:bg-primary-50 transition-colors flex-shrink-0"
        >
          <Download className="w-3.5 h-3.5" /> PDF
        </a>
      ) : (
        <button className="flex items-center gap-1 text-sm text-gray-400 cursor-not-allowed bg-white border border-gray-200 px-3 py-1.5 rounded-lg flex-shrink-0">
          <Download className="w-3.5 h-3.5" /> PDF
        </button>
      )}
    </div>
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Reportes</h1>
        <p className="text-gray-500 text-sm mt-1">Generación de reportes operacionales y de gestión en PDF</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Reportes Operacionales */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h2 className="font-bold text-gray-800">Reportes Operacionales</h2>
              <p className="text-xs text-gray-500">Generados con PDFKit — datos del día a día</p>
            </div>
          </div>
          <div className="space-y-2">
            {reportesOperacionales.map((r) => <ReporteItem key={r.titulo} reporte={r} />)}
          </div>
        </div>

        {/* Reportes de Gestión */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <h2 className="font-bold text-gray-800">Reportes de Gestión</h2>
              <p className="text-xs text-gray-500">Generados con Puppeteer — análisis estratégico</p>
            </div>
          </div>
          <div className="space-y-2">
            {reportesGestion.map((r) => <ReporteItem key={r.titulo} reporte={r} />)}
          </div>
        </div>
      </div>

      {/* Info adicional */}
      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
        <p className="text-sm text-yellow-800">
          <strong>💡 Nota:</strong> Los reportes marcados como disponibles pueden descargarse directamente.
          Los reportes de gestión con Puppeteer requieren que el servicio de chromium esté disponible en el servidor.
        </p>
      </div>
    </div>
  );
}
