import { useQuery } from '@tanstack/react-query';
import { Package, Clock, CheckCircle, Truck, XCircle, RefreshCw } from 'lucide-react';
import { ordenService } from '../../services/orden.service';
import { EstadoOrden } from '../../types';

const estadoConfig: Record<string, { label: string; color: string; icon: any }> = {
  pendiente_pago: { label: 'Pendiente de Pago', color: 'badge-warning', icon: Clock },
  pagada: { label: 'Pagada', color: 'badge-info', icon: CheckCircle },
  en_proceso: { label: 'En Proceso', color: 'badge-info', icon: Package },
  enviada: { label: 'Enviada', color: 'badge-info', icon: Truck },
  entregada: { label: 'Entregada', color: 'badge-success', icon: CheckCircle },
  cancelada: { label: 'Cancelada', color: 'badge-danger', icon: XCircle },
  devuelta: { label: 'Devuelta', color: 'badge-gray', icon: RefreshCw },
};

export default function MisOrdenes() {
  const { data, isLoading } = useQuery({
    queryKey: ['mis-ordenes'],
    queryFn: () => ordenService.listar({ page: 1, limit: 20 } as any),
  });

  if (isLoading) return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-32 bg-gray-200 rounded-xl animate-pulse" />)}
      </div>
    </div>
  );

  const ordenes = data?.data || [];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Mis Pedidos</h1>

      {ordenes.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <Package className="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <p className="font-medium">Aún no tienes pedidos</p>
        </div>
      ) : (
        <div className="space-y-4">
          {ordenes.map((orden: any) => {
            const estado = estadoConfig[orden.estado] || { label: orden.estado, color: 'badge-gray', icon: Package };
            const Icon = estado.icon;
            return (
              <div key={orden.id} className="card">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-bold text-gray-800">#{orden.numero_orden}</p>
                    <p className="text-sm text-gray-400">{new Date(orden.created_at).toLocaleDateString('es-PE', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                  </div>
                  <div className="text-right">
                    <span className={`badge ${estado.color} flex items-center gap-1`}>
                      <Icon className="w-3 h-3" />{estado.label}
                    </span>
                    <p className="text-lg font-bold text-primary-700 mt-1">S/. {Number(orden.total).toFixed(2)}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">{orden.items?.length || 0} producto(s)</p>
                  <div className="flex gap-2">
                    <a
                      href={ordenService.facturaUrl(orden.id)}
                      target="_blank"
                      className="text-sm text-primary-700 hover:underline font-medium"
                    >
                      Descargar Factura
                    </a>
                  </div>
                </div>

                {orden.numero_tracking && (
                  <p className="text-xs text-gray-400 mt-2">
                    Tracking: <span className="font-mono">{orden.numero_tracking}</span>
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
