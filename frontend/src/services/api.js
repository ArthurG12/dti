import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

// Products
export const getProducts = (params = {}) => api.get('/products', { params }).then(r => r.data);
export const getProduct = (id) => api.get(`/products/${id}`).then(r => r.data);

// Cart
export const getCart = (cartId) => api.get(`/cart/${cartId}`).then(r => r.data);

export const addToCart = (cartId, productId, quantity = 1) => {
  const url = cartId ? `/cart/${cartId}/items` : '/cart/items';
  return api.post(url, { productId, quantity }).then(r => r.data);
};

export const updateCartItem = (cartId, productId, quantity) =>
  api.put(`/cart/${cartId}/items/${productId}`, { quantity }).then(r => r.data);

export const removeCartItem = (cartId, productId) =>
  api.delete(`/cart/${cartId}/items/${productId}`).then(r => r.data);

export const checkout = (cartId) =>
  api.post(`/cart/${cartId}/checkout`).then(r => r.data);
