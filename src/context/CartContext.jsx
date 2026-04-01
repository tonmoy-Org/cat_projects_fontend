// contexts/CartContext.jsx
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from '../auth/AuthProvider';
import axiosInstance from '../api/axios';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load cart from database when user logs in
  const loadCartFromDB = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const response = await axiosInstance.get('/cart');
      const dbCart = response.data.cart;
      
      if (dbCart && dbCart.items) {
        // Transform database items to match frontend structure
        const transformedItems = dbCart.items.map(item => ({
          _id: item.itemId,
          itemType: item.itemType,
          quantity: item.quantity,
          ...item.itemData // Spread the actual product/cat data
        }));
        setCartItems(transformedItems);
      } else {
        setCartItems([]);
      }
    } catch (err) {
      console.error('Failed to load cart:', err);
      setError('Failed to load cart');
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Sync local cart with database after login
  const syncCartWithDB = useCallback(async (localCartItems) => {
    if (!user || !localCartItems.length) return;
    
    try {
      const syncData = localCartItems.map(item => ({
        itemType: item.itemType,
        itemId: item._id,
        quantity: item.quantity
      }));
      
      await axiosInstance.post('/cart/sync', { localCart: syncData });
      await loadCartFromDB();
    } catch (err) {
      console.error('Failed to sync cart:', err);
    }
  }, [user, loadCartFromDB]);

  // Load cart when user changes (login/logout)
  useEffect(() => {
    if (user) {
      loadCartFromDB();
    } else {
      // Load from localStorage for guest users
      try {
        const saved = localStorage.getItem('petcare_cart');
        if (saved) {
          setCartItems(JSON.parse(saved));
        }
      } catch {
        setCartItems([]);
      }
    }
  }, [user, loadCartFromDB]);

  // Save to localStorage for guest users
  useEffect(() => {
    if (!user) {
      localStorage.setItem('petcare_cart', JSON.stringify(cartItems));
    }
  }, [cartItems, user]);

  const addToCart = async (product, quantity = 1, itemType = 'Product') => {
    const item = {
      _id: product._id,
      itemType,
      name: product.name || product.title,
      price: product.price,
      image: product.image || product.imageUrl,
      quantity
    };

    if (user) {
      // Add to database cart
      try {
        setLoading(true);
        await axiosInstance.post('/cart', {
          itemType,
          itemId: product._id,
          quantity
        });
        await loadCartFromDB();
      } catch (err) {
        console.error('Failed to add to cart:', err);
        setError('Failed to add item to cart');
      } finally {
        setLoading(false);
      }
    } else {
      // Update local cart
      setCartItems(prev => {
        const existing = prev.find(i => i._id === product._id && i.itemType === itemType);
        if (existing) {
          return prev.map(i =>
            i._id === product._id && i.itemType === itemType
              ? { ...i, quantity: i.quantity + quantity }
              : i
          );
        }
        return [...prev, item];
      });
    }
  };

  const removeFromCart = async (id, itemType = 'Product') => {
    if (user) {
      try {
        setLoading(true);
        await axiosInstance.delete(`/cart/item/${id}`, {
          data: { itemType }
        });
        await loadCartFromDB();
      } catch (err) {
        console.error('Failed to remove from cart:', err);
        setError('Failed to remove item');
      } finally {
        setLoading(false);
      }
    } else {
      setCartItems(prev => prev.filter(i => !(i._id === id && i.itemType === itemType)));
    }
  };

  const updateQty = async (id, qty, itemType = 'Product') => {
    if (qty <= 0) {
      removeFromCart(id, itemType);
      return;
    }

    if (user) {
      try {
        setLoading(true);
        await axiosInstance.put(`/cart/item/${id}`, {
          itemType,
          quantity: qty
        });
        await loadCartFromDB();
      } catch (err) {
        console.error('Failed to update quantity:', err);
        setError('Failed to update quantity');
      } finally {
        setLoading(false);
      }
    } else {
      setCartItems(prev =>
        prev.map(i =>
          i._id === id && i.itemType === itemType
            ? { ...i, quantity: qty }
            : i
        )
      );
    }
  };

  const clearCart = async () => {
    if (user) {
      try {
        setLoading(true);
        await axiosInstance.delete('/cart');
        setCartItems([]);
      } catch (err) {
        console.error('Failed to clear cart:', err);
        setError('Failed to clear cart');
      } finally {
        setLoading(false);
      }
    } else {
      setCartItems([]);
    }
  };

  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);
  const cartTotal = cartItems.reduce((sum, i) => sum + (i.price || 0) * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        cartTotal,
        loading,
        error,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        syncCartWithDB
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
};