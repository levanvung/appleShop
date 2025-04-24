import React, { createContext, useState, useContext, ReactNode } from 'react';

// Định nghĩa kiểu dữ liệu cho sản phẩm trong giỏ hàng - Make sure this is exported
export interface CartItem {
  id: string;
  name: string;
  fullName: string;
  price: string;
  image: string;
  color: string;
  colorName: string;
  quantity: number;
}

// Định nghĩa kiểu dữ liệu cho context
interface CartContextType {
  cartItems: CartItem[];
  cartCount: number;
  isCartOpen: boolean;
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  increaseQuantity: (id: string, color: string) => void;
  decreaseQuantity: (id: string, color: string) => void;
  toggleCart: () => void;
  closeCart: () => void;
}

// Tạo context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Hook để sử dụng context - Exported
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// Provider component
interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const addToCart = (item: CartItem) => {
    setCartItems(prevItems => {
      // Kiểm tra xem sản phẩm đã tồn tại trong giỏ hàng chưa
      const existingItemIndex = prevItems.findIndex(
        i => i.id === item.id && i.color === item.color
      );

      if (existingItemIndex !== -1) {
        // Nếu đã tồn tại, tăng số lượng
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += item.quantity;
        return updatedItems;
      } else {
        // Nếu chưa có, thêm mới
        return [...prevItems, item];
      }
    });
    
    // Mở giỏ hàng khi thêm sản phẩm mới
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const increaseQuantity = (id: string, color: string) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id && item.color === color
          ? { ...item, quantity: item.quantity + 1 } 
          : item
      )
    );
  };

  const decreaseQuantity = (id: string, color: string) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id && item.color === color && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 } 
          : item
      )
    );
  };

  const toggleCart = () => {
    setIsCartOpen(prev => !prev);
  };

  const closeCart = () => {
    setIsCartOpen(false);
  };

  const value = {
    cartItems,
    cartCount,
    isCartOpen,
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    toggleCart,
    closeCart
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export default CartContext; 