const productService = require('../services/productService');

function list(req, res, next) {
  try {
    const data = productService.listProducts(req.query);
    res.json(data);
  } catch (err) {
    next(err);
  }
}

function getOne(req, res, next) {
  try {
    const product = productService.getProduct(req.params.id);
    res.json(product);
  } catch (err) {
    next(err);
  }
}

module.exports = { list, getOne };
