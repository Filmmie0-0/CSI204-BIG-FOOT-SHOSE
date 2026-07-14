import { create } from 'zustand';

export const useCartStore = create((set, get) => ({
  cart: [],
  shippingAddress: {},
  paymentMethod: 'PromptPay / Bank Transfer', // ตั้งค่าเริ่มต้น
  
  addToCart: (product, selectedSize) => {
    const currentCart = get().cart;
    const cartItemId = `${product._id}-${selectedSize}`;
    
    const existingItem = currentCart.find((item) => item.cartItemId === cartItemId);
    
    if (existingItem) {
      set({
        cart: currentCart.map((item) => 
          item.cartItemId === cartItemId ? { ...item, qty: item.qty + 1 } : item
        )
      });
    } else {
      set({ cart: [...currentCart, { ...product, qty: 1, selectedSize, cartItemId }] });
    }
  },

  decreaseQty: (cartItemId) => {
    const currentCart = get().cart;
    const existingItem = currentCart.find((item) => item.cartItemId === cartItemId);
    
    if (existingItem.qty === 1) {
      set({ cart: currentCart.filter((item) => item.cartItemId !== cartItemId) });
    } else {
      set({
        cart: currentCart.map((item) => 
          item.cartItemId === cartItemId ? { ...item, qty: item.qty - 1 } : item
        )
      });
    }
  },
  
  removeFromCart: (cartItemId) => {
    set({ cart: get().cart.filter((item) => item.cartItemId !== cartItemId) });
  },

  saveShippingAddress: (data) => {
    set({ shippingAddress: data });
  },

  // --- ฟังก์ชันบันทึกวิธีชำระเงิน ---
  savePaymentMethod: (data) => {
    set({ paymentMethod: data });
  },

  clearCart: () => {
    set({ cart: [] });
  }
}));