import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  id: number;
  producto_id: number;
  nombre: string;
  sku: string;
  precio: number;
  cantidad: number;
  imagen_url?: string;
  stock_disponible: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (productoId: number) => void;
  updateQuantity: (productoId: number, cantidad: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  getTotalItems: () => number;
  getSubtotal: () => number;
  getIgv: () => number;
  getTotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (newItem) => {
        const { items } = get();
        const existing = items.find((i) => i.producto_id === newItem.producto_id);
        if (existing) {
          const nuevaCantidad = Math.min(
            existing.cantidad + newItem.cantidad,
            newItem.stock_disponible
          );
          set({
            items: items.map((i) =>
              i.producto_id === newItem.producto_id ? { ...i, cantidad: nuevaCantidad } : i
            ),
          });
        } else {
          set({
            items: [...items, { ...newItem, id: Date.now() }],
          });
        }
      },

      removeItem: (productoId) =>
        set({ items: get().items.filter((i) => i.producto_id !== productoId) }),

      updateQuantity: (productoId, cantidad) => {
        if (cantidad <= 0) {
          get().removeItem(productoId);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.producto_id === productoId
              ? { ...i, cantidad: Math.min(cantidad, i.stock_disponible) }
              : i
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),

      getTotalItems: () => get().items.reduce((acc, i) => acc + i.cantidad, 0),

      getSubtotal: () =>
        get().items.reduce((acc, i) => acc + i.precio * i.cantidad, 0),

      getIgv: () => get().getSubtotal() * 0.18,

      getTotal: () => get().getSubtotal() * 1.18,
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ items: state.items }),
    }
  )
);
