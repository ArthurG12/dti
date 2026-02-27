const { run, queryOne, persist } = require('../database/db');

function createOrder(cartId, total) {
  const result = run(`INSERT INTO orders (cart_id, total, status) VALUES (?, ?, 'placed')`, [cartId, total]);
  persist();
  return result.lastInsertRowid;
}

function findById(id) {
  return queryOne('SELECT * FROM orders WHERE id = ?', [id]);
}

module.exports = { createOrder, findById };
