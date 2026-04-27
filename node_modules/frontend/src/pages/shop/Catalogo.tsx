import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Filter, Grid, List, ChevronDown } from 'lucide-react';
import { productoService } from '../../services/producto.service';
import ProductCard from '../../components/producto/ProductCard';

const ITEMS_POR_PAGINA = [12, 24, 48];

export default function Catalogo() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [precioMin, setPrecioMin] = useState('');
  const [precioMax, setPrecioMax] = useState('');
  const [orderBy, setOrderBy] = useState('created_at');
  const [order, setOrder] = useState('desc');

  const search = searchParams.get('search') || undefined;
  const categoriaId = searchParams.get('categoria_id') || undefined;
  const marcaId = searchParams.get('marca_id') || undefined;

  const params: Record<string, any> = {
    page,
    limit,
    orderBy,
    order,
    estado: 'activo',
    ...(search && { search }),
    ...(categoriaId && { categoria_id: categoriaId }),
    ...(marcaId && { marca_id: marcaId }),
    ...(precioMin && { precio_min: precioMin }),
    ...(precioMax && { precio_max: precioMax }),
    ...(searchParams.get('destacado') && { destacado: true }),
    ...(searchParams.get('nuevo') && { nuevo: true }),
  };

  const { data, isLoading } = useQuery({
    queryKey: ['productos', params],
    queryFn: () => productoService.listar(params),
    placeholderData: (prev) => prev,
  });

  const { data: categorias } = useQuery({
    queryKey: ['categorias'],
    queryFn: productoService.categorias,
  });

  const { data: marcas } = useQuery({
    queryKey: ['marcas'],
    queryFn: productoService.marcas,
  });

  useEffect(() => { setPage(1); }, [search, categoriaId, marcaId, precioMin, precioMax]);

  const totalPages = data?.totalPages || 1;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {search ? `Búsqueda: "${search}"` : 'Catálogo de Productos'}
          </h1>
          {data?.total !== undefined && (
            <p className="text-gray-500 text-sm mt-1">{data.total} productos encontrados</p>
          )}
        </div>
        <button
          onClick={() => setFiltersOpen(!filtersOpen)}
          className="flex items-center gap-2 btn-secondary text-sm"
        >
          <Filter className="w-4 h-4" /> Filtros
        </button>
      </div>

      <div className="flex gap-6">
        {/* Sidebar filtros */}
        <aside className={`${filtersOpen ? 'block' : 'hidden'} lg:block w-64 flex-shrink-0`}>
          <div className="card space-y-6 sticky top-20">
            <h3 className="font-semibold text-gray-800">Filtros</h3>

            {/* Categorías */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Categoría</h4>
              <div className="space-y-2">
                <button
                  onClick={() => { const p = new URLSearchParams(searchParams); p.delete('categoria_id'); setSearchParams(p); }}
                  className={`block text-sm w-full text-left px-2 py-1 rounded ${!categoriaId ? 'text-primary-700 font-medium' : 'text-gray-600 hover:text-gray-800'}`}
                >
                  Todas las categorías
                </button>
                {categorias?.map((cat: any) => (
                  <button
                    key={cat.id}
                    onClick={() => { const p = new URLSearchParams(searchParams); p.set('categoria_id', cat.id); setSearchParams(p); }}
                    className={`block text-sm w-full text-left px-2 py-1 rounded ${categoriaId === String(cat.id) ? 'text-primary-700 font-medium' : 'text-gray-600 hover:text-gray-800'}`}
                  >
                    {cat.nombre}
                  </button>
                ))}
              </div>
            </div>

            {/* Rango de precio */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Precio (S/.)</h4>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={precioMin}
                  onChange={(e) => setPrecioMin(e.target.value)}
                  className="input-field text-sm"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={precioMax}
                  onChange={(e) => setPrecioMax(e.target.value)}
                  className="input-field text-sm"
                />
              </div>
            </div>

            {/* Marcas */}
            {marcas?.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Marca</h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {marcas.map((marca: any) => (
                    <button
                      key={marca.id}
                      onClick={() => { const p = new URLSearchParams(searchParams); marcaId === String(marca.id) ? p.delete('marca_id') : p.set('marca_id', marca.id); setSearchParams(p); }}
                      className={`flex items-center gap-2 text-sm w-full text-left px-2 py-1 rounded ${marcaId === String(marca.id) ? 'text-primary-700 font-medium' : 'text-gray-600 hover:text-gray-800'}`}
                    >
                      <span className={`w-3 h-3 rounded border ${marcaId === String(marca.id) ? 'bg-primary-700 border-primary-700' : 'border-gray-400'}`} />
                      {marca.nombre}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Productos */}
        <div className="flex-1">
          {/* Barra de ordenamiento */}
          <div className="flex items-center justify-between mb-4 bg-white rounded-xl border border-gray-100 px-4 py-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Mostrar:</span>
              {ITEMS_POR_PAGINA.map((n) => (
                <button key={n} onClick={() => { setLimit(n); setPage(1); }}
                  className={`px-2 py-0.5 rounded ${limit === n ? 'bg-primary-100 text-primary-700 font-medium' : 'hover:bg-gray-100'}`}>
                  {n}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <select
                value={`${orderBy}-${order}`}
                onChange={(e) => {
                  const [ob, o] = e.target.value.split('-');
                  setOrderBy(ob); setOrder(o);
                }}
                className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                <option value="created_at-desc">Más recientes</option>
                <option value="precio_venta-asc">Precio: menor a mayor</option>
                <option value="precio_venta-desc">Precio: mayor a menor</option>
                <option value="nombre-asc">Nombre A-Z</option>
                <option value="popularidad-desc">Más vendidos</option>
              </select>
            </div>
          </div>

          {/* Grid productos */}
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array.from({ length: limit }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl h-72 animate-pulse" />
              ))}
            </div>
          ) : data?.data?.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <p className="text-lg font-medium">No se encontraron productos</p>
              <p className="text-sm mt-2">Intenta con otros filtros</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {data?.data?.map((p: any) => <ProductCard key={p.id} producto={p} />)}
            </div>
          )}

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="px-4 py-2 border border-gray-200 rounded-lg text-sm disabled:opacity-40 hover:bg-gray-50">
                Anterior
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = page <= 3 ? i + 1 : page - 2 + i;
                if (pageNum > totalPages) return null;
                return (
                  <button key={pageNum} onClick={() => setPage(pageNum)}
                    className={`w-9 h-9 rounded-lg text-sm ${page === pageNum ? 'bg-primary-700 text-white' : 'border border-gray-200 hover:bg-gray-50'}`}>
                    {pageNum}
                  </button>
                );
              })}
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="px-4 py-2 border border-gray-200 rounded-lg text-sm disabled:opacity-40 hover:bg-gray-50">
                Siguiente
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
