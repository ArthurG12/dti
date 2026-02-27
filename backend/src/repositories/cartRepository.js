const { query, queryOne, run, persist } = require('../database/db');

function createCart() {
  const result = run(`INSERT INTO carts (status) VALUES ('active')`);
  persist();
  return result.lastInsertRowid;
}

function findActiveCart(cartId) {
  return queryOne(`SELECT * FROM carts WHERE id = ? AND status = 'active'`, [cartId]);
}

function getCartWithItems(cartId) {
  const cart = queryOne('SELECT * FROM carts WHERE id = ?', [cartId]);
  if (!cart) return null;

  const items = query(`
    SELECT ci.id, ci.quantity, ci.product_id,
           p.name, p.description, p.price, p.image,
           ci.quantity * p.price AS subtotal
    FROM cart_items ci
    JOIN products p ON p.id = ci.product_id
    WHERE ci.cart_id = ?
  `, [cartId]);

  const total = items.reduce((sum, item) => sum + item.subtotal, 0);
  return { ...cart, items, total };
}

function findCartItem(cartId, productId) {
  return queryOne('SELECT * FROM cart_items WHERE cart_id = ? AND product_id = ?', [cartId, productId]);
}

function addItem(cartId, productId, quantity) {
  run('INSERT INTO cart_items (cart_id, product_id, quantity) VALUES (?, ?, ?)', [cartId, productId, quantity]);
  persist();
}

function updateItemQuantity(cartId, productId, quantity) {
  run('UPDATE cart_items SET quantity = ? WHERE cart_id = ? AND product_id = ?', [quantity, cartId, productId]);
  persist();
}

function removeItem(cartId, productId) {
  run('DELETE FROM cart_items WHERE cart_id = ? AND product_id = ?', [cartId, productId]);
  persist();
}

function markCartAsOrdered(cartId) {
  run(`UPDATE carts SET status = 'ordered' WHERE id = ?`, [cartId]);
  persist();
}

module.exports = {
  createCart, findActiveCart, getCartWithItems,
  findCartItem, addItem, updateItemQuantity, removeItem, markCartAsOrdered,
};
