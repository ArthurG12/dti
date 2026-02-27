const { Router } = require('express');
const productController = require('../controllers/productController');
const cartController = require('../controllers/cartController');

const router = Router();

// Products
router.get('/products', productController.list);
router.get('/products/:id', productController.getOne);

// Cart — create cart + add first item
router.post('/cart/items', cartController.addItem);

// Cart — operations on existing cart
router.get('/cart/:cartId', cartController.getCart);
router.post('/cart/:cartId/items', cartController.addItem);
router.put('/cart/:cartId/items/:productId', cartController.updateItem);
router.delete('/cart/:cartId/items/:productId', cartController.removeItem);
router.post('/cart/:cartId/checkout', cartController.checkout);

module.exports = router;
