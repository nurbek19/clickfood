import { create } from 'zustand';

export const useCartStore = create((set, get) => ({
  items: [],

  addItem: (dish, qty = 1) => {
    set((state) => {
      const index = state.items.findIndex((i) => i._id === dish._id);
      if (index >= 0) {
        const next = [...state.items];
        next[index] = { ...next[index], quantity: (next[index].quantity || 0) + qty };
        return { items: next };
      }
      return { items: [...state.items, { ...dish, quantity: qty }] };
    });
  },

  updateQuantity: (id, quantity) => {
    if (quantity <= 0) {
      set((state) => ({ items: state.items.filter((i) => i._id !== id) }));
      return;
    }
    set((state) => ({
      items: state.items.map((i) => (i._id === id ? { ...i, quantity } : i)),
    }));
  },

  removeItem: (id) => set((state) => ({ items: state.items.filter((i) => i._id !== id) })),
  clear: () => set({ items: [] }),
}));


