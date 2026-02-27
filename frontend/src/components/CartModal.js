import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

function formatPrice(price) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);
}

export default function CartModal({ onClose, onCheckoutSuccess }) {
  const { cart, updateItem, removeItem, doCheckout } = useCart();
  const [checkingOut, setCheckingOut] = useState(false);

  const handleQtyChange = (productId, value) => {
    const qty = Number(value);
    if (qty >= 1 && qty <= 10) updateItem(productId, qty);
  };

  const handleCheckout = async () => {
    setCheckingOut(true);
    try {
      const result = await doCheckout();
      onCheckoutSuccess(result);
    } catch (err) {
      alert(err.response?.data?.error || 'Falha no checkout. Tente novamente.');
    } finally {
      setCheckingOut(false);
    }
  };

  const isEmpty = !cart?.items?.length;

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="Carrinho de compras">
      <div className="modal" onClick={e => e.stopPropagation()}>
        <header className="modal-header">
          <h2>🛒 Seu Carrinho</h2>
          <button className="modal-close" onClick={onClose} aria-label="Fechar carrinho">✕</button>
        </header>

        <div className="modal-body">
          {isEmpty ? (
            <div className="cart-empty">
              <span className="cart-empty-icon">🛍️</span>
              <p>Seu carrinho está vazio.</p>
              <button className="btn btn-outline" onClick={onClose}>Ver Produtos</button>
            </div>
          ) : (
            <ul className="cart-list">
              {cart.items.map(item => (
                <li key={item.product_id} className="cart-item">
                  <div className="cart-item-info">
                    <span className="cart-item-name">{item.name}</span>
                    <span className="cart-item-unit-price">{formatPrice(item.price)} cada</span>
                  </div>
                  <div className="cart-item-controls">
                    <div className="qty-control">
                      <button
                        className="qty-btn"
                        onClick={() => handleQtyChange(item.product_id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        aria-label="Diminuir quantidade"
                      >−</button>
                      <span className="qty-value">{item.quantity}</span>
                      <button
                        className="qty-btn"
                        onClick={() => handleQtyChange(item.product_id, item.quantity + 1)}
                        disabled={item.quantity >= 10}
                        aria-label="Aumentar quantidade"
                      >+</button>
                    </div>
                    <span className="cart-item-subtotal">{formatPrice(item.subtotal)}</span>
                    <button
                      className="cart-item-remove"
                      onClick={() => removeItem(item.product_id)}
                      aria-label={`Remover ${item.name}`}
                    >🗑</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {!isEmpty && (
          <footer className="modal-footer">
            <div className="cart-total">
              <span>Total</span>
              <strong>{formatPrice(cart.total)}</strong>
            </div>
            <button
              className="btn btn-primary btn-full"
              onClick={handleCheckout}
              disabled={checkingOut}
            >
              {checkingOut ? 'Processando...' : '✓ Finalizar Pedido'}
            </button>
          </footer>
        )}
      </div>
    </div>
  );
}
