import React from 'react';

function formatPrice(price) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);
}

export default function SuccessScreen({ orderResult, onContinue }) {
  return (
    <div className="success-overlay">
      <div className="success-card">
        <div className="success-icon">✓</div>
        <h2 className="success-title">Pedido Realizado!</h2>
        <p className="success-message">{orderResult.message}</p>
        <div className="success-details">
          <div className="success-detail-row">
            <span>Pedido nº</span>
            <strong>{orderResult.orderId}</strong>
          </div>
          <div className="success-detail-row">
            <span>Itens</span>
            <strong>{orderResult.itemCount}</strong>
          </div>
          <div className="success-detail-row">
            <span>Total</span>
            <strong>{formatPrice(orderResult.total)}</strong>
          </div>
        </div>
        <button className="btn btn-primary btn-full" onClick={onContinue}>
          Continuar Comprando
        </button>
      </div>
    </div>
  );
}
