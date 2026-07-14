import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      cart: [],
      shippingAddress: {},
      paymentMethod: 'PromptPay / Bank Transfer', // ตั้งค่าเริ่มต้น
      
      addToCart: (product, selectedSize) => {
        const currentCart = get().cart;
        const cartItemId = `${product._id}-${selectedSize}`;
        
        const existingItem = currentCart.find((item) => item.cartItemId === cartItemId);
        const stock = product.countInStock !== undefined ? product.countInStock : 10;
        
        if (existingItem) {
          if (existingItem.qty >= stock) {
            alert('Cannot add more than available stock.');
            return;
          }
          set({
            cart: currentCart.map((item) => 
              item.cartItemId === cartItemId ? { ...item, qty: item.qty + 1 } : item
            )
          });
        } else {
          if (stock > 0) {
            set({ cart: [...currentCart, { ...product, qty: 1, selectedSize, cartItemId }] });
          } else {
            alert('Product is out of stock.');
          }
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
    }),
    {
      name: 'cart-storage', // ชื่อ key ที่จะถูกเก็บใน localStorage
    }
  )
);