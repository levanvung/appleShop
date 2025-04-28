// CartContext.tsx
import { createContext, useContext, useState } from 'react';

type CartItem = {
  id: number;
  name: string;
  image: string;
  price: string;
  qty: number;
  selected: boolean;
};

type CartCtx = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  toggleSelectItem: (id: number) => void;
  selectAll: (selected: boolean) => void;
  getSelectedItems: () => CartItem[];
  calculateSelectedTotal: () => number;
};

const CartContext = createContext<CartCtx | null>(null);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  
  const addItem = (item: CartItem) =>
    setItems(prev => {
      const idx = prev.findIndex(p => p.id === item.id);
      if (idx > -1) {                      // đã có: tăng qty
        const copy = [...prev];
        copy[idx].qty += item.qty;
        return copy;
      }
      return [...prev, {...item, selected: false}];
    });

  const toggleSelectItem = (id: number) => {
    setItems(prev => {
      const copy = [...prev];
      const idx = copy.findIndex(item => item.id === id);
      if (idx > -1) {
        copy[idx].selected = !copy[idx].selected;
      }
      return copy;
    });
  };

  const selectAll = (selected: boolean) => {
    setItems(prev => {
      return prev.map(item => ({
        ...item,
        selected
      }));
    });
  };

  const getSelectedItems = () => {
    return items.filter(item => item.selected);
  };

  const calculateSelectedTotal = () => {
    return items.reduce((sum, item) => {
      if (item.selected) {
        return sum + (parseFloat(item.price) * item.qty);
      }
      return sum;
    }, 0);
  };

  return (
    <CartContext.Provider value={{ 
      items, 
      addItem, 
      toggleSelectItem, 
      selectAll, 
      getSelectedItems, 
      calculateSelectedTotal 
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext)!;
