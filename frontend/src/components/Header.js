import React from 'react';
import { useCart } from '../context/CartContext';

export default function Header({ onCartClick }) {
  const { itemCount } = useCart();

  return (
    <header className="site-header">
      <div className="container header-inner">
        <div className="logo">
          <span className="logo-dti">dti</span>
          <span className="logo-shop">shop</span>
        </div>
        <button
          className="cart-button"
          onClick={onCartClick}
          aria-label={`Abrir carrinho, ${itemCount} itens`}
        >
          <span className="cart-icon">🛒</span>
          <span className="cart-label">Carrinho</span>
          {itemCount > 0 && (
            <span className="cart-badge">{itemCount}</span>
          )}
        </button>
      </div>
    </header>
  );
}
