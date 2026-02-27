const cartRepository = require('../repositories/cartRepository');
const productRepository = require('../repositories/productRepository');
const orderRepository = require('../repositories/orderRepository');

const MIN_QTY = 1;
const MAX_QTY = 10;

function createError(message, status = 400) {
  return Object.assign(new Error(message), { status });
}

function validateQuantity(quantity) {
  const qty = Number(quantity);
  if (!Number.isInteger(qty)) throw createError('A quantidade deve ser um número inteiro.');
  if (qty < MIN_QTY) throw createError(`A quantidade mínima por produto é ${MIN_QTY}.`);
  if (qty > MAX_QTY) throw createError(`A quantidade máxima por produto é ${MAX_QTY}.`);
  return qty;
}

function getOrCreateCart(cartId) {
  if (cartId) {
    const cart = cartRepository.findActiveCart(cartId);
    if (cart) return cart.id;
  }
  return cartRepository.createCart();
}

function getCart(cartId) {
  if (!cartId) throw createError('ID do carrinho é obrigatório.', 400);
  const cart = cartRepository.getCartWithItems(cartId);
  if (!cart) throw createError('Carrinho não encontrado.', 404);
  return cart;
}

function addToCart(cartId, productId, quantity = 1) {
  const qty = validateQuantity(quantity);

  const product = productRepository.findById(Number(productId));
  if (!product) throw createError('Produto não encontrado.', 404);

  const resolvedCartId = getOrCreateCart(cartId);

  const existing = cartRepository.findCartItem(resolvedCartId, product.id);
  if (existing) {
    const newQty = existing.quantity + qty;
    if (newQty > MAX_QTY) throw createError(`Não é possível exceder ${MAX_QTY} unidades por produto.`);
    cartRepository.updateItemQuantity(resolvedCartId, product.id, newQty);
  } else {
    cartRepository.addItem(resolvedCartId, product.id, qty);
  }

  return { cartId: resolvedCartId, cart: cartRepository.getCartWithItems(resolvedCartId) };
}

function updateCartItem(cartId, productId, quantity) {
  const qty = validateQuantity(quantity);
  const cart = cartRepository.findActiveCart(cartId);
  if (!cart) throw createError('Carrinho não encontrado.', 404);

  const item = cartRepository.findCartItem(cartId, productId);
  if (!item) throw createError('Item não encontrado no carrinho.', 404);

  cartRepository.updateItemQuantity(cartId, productId, qty);
  return cartRepository.getCartWithItems(cartId);
}

function removeFromCart(cartId, productId) {
  const cart = cartRepository.findActiveCart(cartId);
  if (!cart) throw createError('Carrinho não encontrado.', 404);

  const item = cartRepository.findCartItem(cartId, productId);
  if (!item) throw createError('Item não encontrado no carrinho.', 404);

  cartRepository.removeItem(cartId, productId);
  return cartRepository.getCartWithItems(cartId);
}

function checkout(cartId) {
  const cart = cartRepository.getCartWithItems(cartId);
  if (!cart) throw createError('Carrinho não encontrado.', 404);
  if (cart.status !== 'active') throw createError('Este carrinho já foi finalizado.', 400);
  if (cart.items.length === 0) throw createError('Não é possível finalizar um carrinho vazio.', 400);

  cartRepository.markCartAsOrdered(cartId);
  const orderId = orderRepository.createOrder(cartId, cart.total);

  return {
    message: 'Pedido realizado com sucesso! Obrigado pela sua compra.',
    orderId,
    total: cart.total,
    itemCount: cart.items.length,
  };
}

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, checkout };
