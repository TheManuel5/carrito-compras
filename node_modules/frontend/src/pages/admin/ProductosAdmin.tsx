import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Plus, Edit, Trash2, Search, Package, X, Save, Loader2 } from 'lucide-react';
import { productoService } from '../../services/producto.service';
import toast from 'react-hot-toast';

interface ProductoForm {
  nombre: string;
  sku: string;
  descripcion: string;
  precio_costo: string; 
  precio_venta: string;
  precio_oferta: string;
  categoria_id: string;
  marca_id: string;
  estado: string;
  stock_inicial: string;
  imagen_url: string;
}

const FORM_INICIAL: ProductoForm = {
  nombre: '', sku: '', descripcion: '',
  precio_venta: '', precio_oferta: '',
  categoria_id: '', marca_id: '',
  precio_costo: '',
  estado: 'activo', stock_inicial: '0',
  imagen_url: '',
};

function ProductoModal({ producto, onClose, onSuccess }: {
  producto: any | null;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const esEdicion = !!producto;
  const [form, setForm] = useState<ProductoForm>(
    esEdicion ? {
      nombre: producto.nombre || '',
      precio_costo: String(producto.precio_costo || ''),
      sku: producto.sku || '',
      descripcion: producto.descripcion || '',
      precio_venta: String(producto.precio_venta || ''),
      precio_oferta: String(producto.precio_oferta || ''),
      categoria_id: String(producto.categoria_id || ''),
      marca_id: String(producto.marca_id || ''),
      estado: producto.estado || 'activo',
      stock_inicial: String(producto.stock?.cantidad || '0'),
      imagen_url: producto.imagenes?.[0]?.url || ''
    } : FORM_INICIAL
  );

  const mutation = useMutation({
    mutationFn: (body: any) =>
      esEdicion
        ? productoService.actualizar(producto.id, body)
        : productoService.crear(body),
    onSuccess: () => {
      toast.success(esEdicion ? 'Producto actualizado' : 'Producto creado');
      onSuccess();
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Error al guardar producto');
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nombre || !form.sku || !form.precio_venta) {
      toast.error('Nombre, SKU y precio son obligatorios');
      return;
    }
    const body: any = {
      nombre: form.nombre.trim(),
      sku: form.sku.trim().toUpperCase(),
      descripcion: form.descripcion.trim() || undefined,
      precio_venta: parseFloat(form.precio_venta),
      precio_oferta: form.precio_oferta ? parseFloat(form.precio_oferta) : undefined,
      categoria_id: form.categoria_id ? parseInt(form.categoria_id) : undefined,
      marca_id: form.marca_id ? parseInt(form.marca_id) : undefined,
      estado: form.estado,
    };
    if (!esEdicion) body.stock_inicial = parseInt(form.stock_inicial) || 0;
    if (form.precio_costo) {
  body.precio_costo = parseFloat(form.precio_costo);}
if (form.imagen_url) {
  body.imagenes = [
    {
      url: form.imagen_url,
      es_principal: true,
      orden: 1
    }
  ];
}

console.log("FORM IMAGEN URL:", form.imagen_url);
console.log("BODY FINAL:", body);

    mutation.mutate(body);
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl z-10">
          <h2 className="text-lg font-bold text-gray-800">
            {esEdicion ? `Editar: ${producto.nombre}` : 'Nuevo Producto'}
          </h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre <span className="text-red-500">*</span></label>
              <input name="nombre" value={form.nombre} onChange={handleChange} placeholder='Ej: iPad Air M2 11"' className="input-field" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SKU <span className="text-red-500">*</span></label>
              <input name="sku" value={form.sku} onChange={handleChange} placeholder="Ej: APL-IPD-001" className="input-field font-mono uppercase" required />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea name="descripcion" value={form.descripcion} onChange={handleChange} placeholder="Descripción del producto..." rows={3} className="input-field resize-none" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Precio Venta (S/.) <span className="text-red-500">*</span></label>
              <input type="number" name="precio_venta" value={form.precio_venta} onChange={handleChange} min="0" step="0.01" placeholder="0.00" className="input-field" required />
            </div>
            <div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Precio Costo (S/.) <span className="text-red-500">*</span>
  </label>
  <input
    type="number"
    name="precio_costo"
    value={form.precio_costo}
    onChange={handleChange}
    min="0"
    step="0.01"
    placeholder="0.00"
    className="input-field"
    required
  />
</div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Precio Oferta (S/.) <span className="text-xs text-gray-400">(opcional)</span></label>
              <input type="number" name="precio_oferta" value={form.precio_oferta} onChange={handleChange} min="0" step="0.01" placeholder="0.00" className="input-field" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
              <select name="categoria_id" value={form.categoria_id} onChange={handleChange} className="input-field">
                <option value="">— Sin categoría —</option>
                <option value="1">Electrónica</option>
                <option value="2">Deportes</option>
                <option value="3">Hogar y Jardín</option>
                <option value="4">Ropa y Accesorios</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Marca</label>
              <select name="marca_id" value={form.marca_id} onChange={handleChange} className="input-field">
                <option value="">— Sin marca —</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {!esEdicion && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stock Inicial</label>
                <input type="number" name="stock_inicial" value={form.stock_inicial} onChange={handleChange} min="0" placeholder="0" className="input-field" />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
              <select name="estado" value={form.estado} onChange={handleChange} className="input-field">
                <option value="activo">Activo</option>
                <option value="borrador">Borrador</option>
                <option value="inactivo">Inactivo</option>
              </select>
            </div>
          </div>
          <div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    URL de Imagen
  </label>
  <input
    type="text"
    name="imagen_url"
    value={form.imagen_url}
    onChange={handleChange}
    placeholder="https://..."
    className="input-field"
  />
</div>
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
            <button type="button" onClick={onClose} className="btn-secondary">Cancelar</button>
            <button type="submit" disabled={mutation.isPending} className="btn-primary flex items-center gap-2">
              {mutation.isPending ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Guardando...</>
              ) : (
                <><Save className="w-4 h-4" /> {esEdicion ? 'Guardar cambios' : 'Crear producto'}</>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default function ProductosAdmin() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [productoEditando, setProductoEditando] = useState<any | null>(null);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-productos', search, page],
    queryFn: () => productoService.listar({ search, page, limit: 20, estado: 'todos' }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => productoService.eliminar(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-productos'] });
      toast.success('Producto eliminado');
    },
    onError: () => toast.error('Error al eliminar'),
  });

  const abrirNuevo = () => { setProductoEditando(null); setModalAbierto(true); };
  const abrirEditar = (p: any) => { setProductoEditando(p); setModalAbierto(true); };
  const cerrarModal = () => { setModalAbierto(false); setProductoEditando(null); };
  const onGuardadoExitoso = () => { queryClient.invalidateQueries({ queryKey: ['admin-productos'] }); cerrarModal(); };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gestión de Productos</h1>
          <p className="text-gray-500 text-sm mt-1">{data?.total || 0} productos en total</p>
        </div>
        <button onClick={abrirNuevo} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Nuevo Producto
        </button>
      </div>

      <div className="card mb-4">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Buscar por nombre, SKU..." className="input-field pl-9" />
        </div>
      </div>

      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3">Producto</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3">SKU</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3">Categoría</th>
                <th className="text-right text-xs font-semibold text-gray-500 uppercase px-4 py-3">Precio</th>
                <th className="text-center text-xs font-semibold text-gray-500 uppercase px-4 py-3">Stock</th>
                <th className="text-center text-xs font-semibold text-gray-500 uppercase px-4 py-3">Estado</th>
                <th className="text-center text-xs font-semibold text-gray-500 uppercase px-4 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>{Array.from({ length: 7 }).map((_, j) => (
                    <td key={j} className="px-4 py-3"><div className="h-4 bg-gray-200 rounded animate-pulse" /></td>
                  ))}</tr>
                ))
              ) : data?.data?.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-12 text-gray-500">
                  <Package className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                  No se encontraron productos
                </td></tr>
              ) : data?.data?.map((p: any) => {
                const stockDisponible = (p.stock?.cantidad || 0) - (p.stock?.cantidad_reservada || 0);
                return (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          {p.imagenes?.[0]?.url ? <img src={p.imagenes[0].url} alt="" className="w-full h-full object-cover" /> : <Package className="w-5 h-5 text-gray-300 m-2.5" />}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800 text-sm">{p.nombre}</p>
                          {p.marca && <p className="text-xs text-gray-400">{p.marca.nombre}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm font-mono text-gray-500">{p.sku}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{p.categoria?.nombre}</td>
                    <td className="px-4 py-3 text-right">
                      {p.precio_oferta ? (
                        <div>
                          <p className="text-sm font-bold text-primary-700">S/. {Number(p.precio_oferta).toFixed(2)}</p>
                          <p className="text-xs text-gray-400 line-through">S/. {Number(p.precio_venta).toFixed(2)}</p>
                        </div>
                      ) : <p className="text-sm font-bold text-gray-800">S/. {Number(p.precio_venta).toFixed(2)}</p>}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-sm font-bold ${stockDisponible === 0 ? 'text-red-600' : stockDisponible <= 5 ? 'text-orange-600' : 'text-green-600'}`}>
                        {stockDisponible}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`badge ${p.estado === 'activo' ? 'badge-success' : p.estado === 'borrador' ? 'badge-warning' : 'badge-danger'}`}>
                        {p.estado}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => abrirEditar(p)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Editar">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => { if (confirm('¿Eliminar producto?')) deleteMutation.mutate(p.id); }} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Eliminar">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {data?.totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 py-4 border-t border-gray-100">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1 border rounded-lg text-sm disabled:opacity-40">Anterior</button>
            <span className="text-sm text-gray-500">Página {page} de {data.totalPages}</span>
            <button onClick={() => setPage(p => Math.min(data.totalPages, p + 1))} disabled={page === data.totalPages} className="px-3 py-1 border rounded-lg text-sm disabled:opacity-40">Siguiente</button>
          </div>
        )}
      </div>

      {modalAbierto && (
        <ProductoModal producto={productoEditando} onClose={cerrarModal} onSuccess={onGuardadoExitoso} />
      )}
    </div>
  );
}