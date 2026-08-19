import { create } from 'zustand';
import { CartItem, Product } from '../types';

interface State {
  cart: CartItem[];
  addToCart: (product: Product, quantity: number, customizations: CartItem['customizations']) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartSubtotal: () => number;
}

export const useStore = create<State>((set, get) => ({
  cart: [],
  addToCart: (product, quantity, customizations) => {
    set((state) => {
      // Calculate item total based on product price + customization modifiers
      let itemTotal = product.price;
      customizations.forEach((c) => {
        itemTotal += c.selectedOption.price_modifier;
      });
      
      const newCartItem: CartItem = {
        id: Math.random().toString(36).substring(7), // Simple unique ID
        productId: product.id,
        product,
        quantity,
        customizations,
        itemTotal,
      };
      
      return { cart: [...state.cart, newCartItem] };
    });
  },
  removeFromCart: (id) => {
    set((state) => ({ cart: state.cart.filter((item) => item.id !== id) }));
  },
  updateQuantity: (id, quantity) => {
    set((state) => ({
      cart: state.cart.map((item) =>
        item.id === id ? { ...item, quantity } : item
      ),
    }));
  },
  clearCart: () => {
    set({ cart: [] });
  },
  getCartSubtotal: () => {
    return get().cart.reduce((total, item) => total + item.itemTotal * item.quantity, 0);
  },
  getCartTotal: () => {
    return get().getCartSubtotal(); // Add delivery fee if needed
  },
}));
