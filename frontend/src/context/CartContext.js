import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as api from '../services/api';
import { useToast } from './ToastContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartId, setCartId] = useState(() => {
    const saved = localStorage.getItem('dti_cart_id');
    return saved ? Number(saved) : null;
  });
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const fetchCart = useCallback(async (id) => {
    if (!id) return;
    try {
      const data = await api.getCart(id);
      setCart(data);
    } catch {
      // Cart may be checked out or invalid
      setCartId(null);
      setCart(null);
      localStorage.removeItem('dti_cart_id');
    }
  }, []);

  useEffect(() => {
    if (cartId) fetchCart(cartId);
  }, [cartId, fetchCart]);

  const addToCart = async (productId, quantity = 1) => {
    setLoading(true);
    try {
      const result = await api.addToCart(cartId, productId, quantity);
      if (!cartId) {
        setCartId(result.cartId);
        localStorage.setItem('dti_cart_id', result.cartId);
      }
      setCart(result.cart);
      showToast('Produto adicionado ao carrinho!', 'success');
    } catch (err) {
      showToast(err.response?.data?.error || 'Falha ao adicionar produto.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const updateItem = async (productId, quantity) => {
    if (!cartId) return;
    try {
      const data = await api.updateCartItem(cartId, productId, quantity);
      setCart(data);
    } catch (err) {
      showToast(err.response?.data?.error || 'Falha ao atualizar quantidade.', 'error');
    }
  };

  const removeItem = async (productId) => {
    if (!cartId) return;
    try {
      const data = await api.removeCartItem(cartId, productId);
      setCart(data);
      showToast('Item removido do carrinho.', 'info');
    } catch (err) {
      showToast(err.response?.data?.error || 'Falha ao remover item.', 'error');
    }
  };

  const doCheckout = async () => {
    if (!cartId) return null;
    const result = await api.checkout(cartId);
    setCartId(null);
    setCart(null);
    localStorage.removeItem('dti_cart_id');
    return result;
  };

  const itemCount = cart?.items?.reduce((sum, i) => sum + i.quantity, 0) || 0;

  return (
    <CartContext.Provider value={{ cart, cartId, loading, addToCart, updateItem, removeItem, doCheckout, itemCount }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
