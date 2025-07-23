import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  brand: string;
  condition: 'Neu' | 'Gebraucht' | 'Generalüberholt';
  image: string;
  quantity: number;
  seller: {
    name: string;
    rating: number;
    location: string;
  };
  shipping: {
    cost: number;
    time: string;
  };
  warranty: string;
  carCompatibility: string;
}

interface CartStore {
  items: CartItem[];
  isLoading: boolean;
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalShipping: () => number;
  getItemCount: () => number;
  loadCart: () => Promise<void>;
  saveCart: () => Promise<void>;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  isLoading: false,

  addToCart: (item) => {
    const { items } = get();
    const existingItem = items.find(cartItem => cartItem.id === item.id);
    
    if (existingItem) {
      set({
        items: items.map(cartItem => 
          cartItem.id === item.id 
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      });
    } else {
      set({
        items: [...items, { ...item, quantity: 1 }]
      });
    }
    
    get().saveCart();
  },

  removeFromCart: (itemId) => {
    set({
      items: get().items.filter(item => item.id !== itemId)
    });
    get().saveCart();
  },

  updateQuantity: (itemId, quantity) => {
    if (quantity <= 0) {
      get().removeFromCart(itemId);
      return;
    }
    
    set({
      items: get().items.map(item => 
        item.id === itemId ? { ...item, quantity } : item
      )
    });
    get().saveCart();
  },

  clearCart: () => {
    set({ items: [] });
    get().saveCart();
  },

  getTotalPrice: () => {
    return get().items.reduce((total, item) => total + (item.price * item.quantity), 0);
  },

  getTotalShipping: () => {
    const uniqueSellers = new Set(get().items.map(item => item.seller.name));
    return get().items.reduce((total, item) => {
      // Only add shipping cost once per seller
      const isFirstItemFromSeller = get().items.find(i => i.seller.name === item.seller.name)?.id === item.id;
      return total + (isFirstItemFromSeller ? item.shipping.cost : 0);
    }, 0);
  },

  getItemCount: () => {
    return get().items.reduce((total, item) => total + item.quantity, 0);
  },

  loadCart: async () => {
    set({ isLoading: true });
    try {
      const stored = await AsyncStorage.getItem('cart');
      if (stored) {
        const items = JSON.parse(stored);
        set({ items });
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  saveCart: async () => {
    try {
      await AsyncStorage.setItem('cart', JSON.stringify(get().items));
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  },
}));