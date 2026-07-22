import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      cart: [],
      shippingAddress: {},
      paymentMethod: 'PromptPay / Bank Transfer', // ตั้งค่าเริ่มต้น
      
      addToCart: async (product, selectedSize) => {
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
            return;
          }
        }
        await get().syncWithBackend();
      },

      decreaseQty: async (cartItemId) => {
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
        await get().syncWithBackend();
      },
      
      removeFromCart: async (cartItemId) => {
        set({ cart: get().cart.filter((item) => item.cartItemId !== cartItemId) });
        await get().syncWithBackend();
      },

      saveShippingAddress: (data) => {
        set({ shippingAddress: data });
      },

      savePaymentMethod: (data) => {
        set({ paymentMethod: data });
      },

      clearCart: async () => {
        set({ cart: [] });
        await get().syncWithBackend();
      },

      resetCartLocally: () => {
        set({ cart: [] });
      },

      syncWithBackend: async () => {
        try {
          const authStorageStr = localStorage.getItem('auth-storage');
          if (!authStorageStr) return;
          const authStorage = JSON.parse(authStorageStr);
          const token = authStorage?.state?.userInfo?.token;
          
          if (!token) return;

          // import api dynamically or use standard fetch if api import is tricky. 
          // Let's assume we can import api at the top.
          const { default: api } = await import('../utils/api');
          
          await api.put('/cart', { items: get().cart }, {
            headers: { Authorization: `Bearer ${token}` }
          });
        } catch (error) {
          console.error('Failed to sync cart with backend:', error);
        }
      },

      fetchBackendCart: async () => {
        try {
          const authStorageStr = localStorage.getItem('auth-storage');
          if (!authStorageStr) return;
          const authStorage = JSON.parse(authStorageStr);
          const token = authStorage?.state?.userInfo?.token;
          
          if (!token) return;

          const { default: api } = await import('../utils/api');
          const { data } = await api.get('/cart', {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          // Merge logic: If local cart has items, we should keep them and sync back.
          // If local cart is empty, use backend cart.
          const localCart = get().cart;
          if (localCart.length > 0) {
            // Merge logic: Combine by cartItemId
            const mergedCart = [...localCart];
            
            data.forEach(backendItem => {
              const exists = mergedCart.find(item => item.cartItemId === backendItem.cartItemId);
              if (!exists) {
                mergedCart.push(backendItem);
              } else {
                // If exists, maybe take max qty or keep local. We'll keep local's qty but ensure we don't exceed stock
                const stock = backendItem.countInStock !== undefined ? backendItem.countInStock : 10;
                exists.qty = Math.min(exists.qty + backendItem.qty, stock);
              }
            });
            
            set({ cart: mergedCart });
            await get().syncWithBackend();
          } else {
            // Local is empty, just use backend
            set({ cart: data });
          }
        } catch (error) {
          console.error('Failed to fetch cart from backend:', error);
        }
      }
    }),
    {
      name: 'cart-storage', // ชื่อ key ที่จะถูกเก็บใน localStorage
    }
  )
);