import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

function formatPrice(price) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);
}

export default function ProductCard({ product }) {
  const { addToCart, loading } = useCart();
  const [imgError, setImgError] = useState(false);

  return (
    <article className="product-card">
      <div className="product-image-wrapper">
        {!imgError && product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="product-image"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="product-image-placeholder">
            <span>📦</span>
          </div>
        )}
      </div>
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-description">{product.description}</p>
        <div className="product-footer">
          <span className="product-price">{formatPrice(product.price)}</span>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => addToCart(product.id)}
            disabled={loading}
            aria-label={`Adicionar ${product.name} ao carrinho`}
          >
            + Adicionar
          </button>
        </div>
      </div>
    </article>
  );
}
