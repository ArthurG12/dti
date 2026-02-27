const productRepository = require('../repositories/productRepository');

function listProducts(query = {}) {
  const { search = '', page = 1, limit = 8 } = query;
  return productRepository.findAll({
    search: search.trim(),
    page: Number(page),
    limit: Number(limit),
  });
}

function getProduct(id) {
  const product = productRepository.findById(Number(id));
  if (!product) throw Object.assign(new Error('Produto não encontrado'), { status: 404 });
  return product;
}

module.exports = { listProducts, getProduct };
