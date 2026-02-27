const { query, queryOne } = require('../database/db');

function findAll({ search, page = 1, limit = 8 }) {
  const offset = (page - 1) * limit;
  const params = search ? [`%${search}%`, `%${search}%`] : [];
  const where = search ? `WHERE name LIKE ? OR description LIKE ?` : '';

  const products = query(`SELECT * FROM products ${where} LIMIT ? OFFSET ?`, [...params, limit, offset]);
  const countRow = queryOne(`SELECT COUNT(*) as total FROM products ${where}`, params);
  const total = countRow?.total || 0;

  return { products, total, page, limit, totalPages: Math.ceil(total / limit) };
}

function findById(id) {
  return queryOne('SELECT * FROM products WHERE id = ?', [id]);
}

module.exports = { findAll, findById };
