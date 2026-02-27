const cartService = require('../services/cartService');

function getCart(req, res, next) {
  try {
    const cart = cartService.getCart(Number(req.params.cartId));
    res.json(cart);
  } catch (err) {
    next(err);
  }
}

function addItem(req, res, next) {
  try {
    const { productId, quantity } = req.body;
    if (!productId) return res.status(400).json({ error: 'productId é obrigatório.' });

    const cartId = req.params.cartId ? Number(req.params.cartId) : null;
    const result = cartService.addToCart(cartId, productId, quantity);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

function updateItem(req, res, next) {
  try {
    const { quantity } = req.body;
    if (quantity === undefined) return res.status(400).json({ error: 'quantidade é obrigatória.' });

    const cart = cartService.updateCartItem(
      Number(req.params.cartId),
      Number(req.params.productId),
      quantity
    );
    res.json(cart);
  } catch (err) {
    next(err);
  }
}

function removeItem(req, res, next) {
  try {
    const cart = cartService.removeFromCart(
      Number(req.params.cartId),
      Number(req.params.productId)
    );
    res.json(cart);
  } catch (err) {
    next(err);
  }
}

function checkout(req, res, next) {
  try {
    const result = cartService.checkout(Number(req.params.cartId));
    res.json(result);
  } catch (err) {
    next(err);
  }
}

module.exports = { getCart, addItem, updateItem, removeItem, checkout };
