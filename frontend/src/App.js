import React, { useState } from 'react';
import { ToastProvider } from './context/ToastContext';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import ProductCard from './components/ProductCard';
import CartModal from './components/CartModal';
import SuccessScreen from './components/SuccessScreen';
import SearchBar from './components/SearchBar';
import Pagination from './components/Pagination';
import { useProducts } from './hooks/useProducts';
import './App.css';

function ShopApp() {
  const [cartOpen, setCartOpen] = useState(false);
  const [orderResult, setOrderResult] = useState(null);
  const { products, meta, search, page, loading, error, onSearch, setPage } = useProducts();

  const handleCheckoutSuccess = (result) => {
    setCartOpen(false);
    setOrderResult(result);
  };

  return (
    <div className="app">
      <Header onCartClick={() => setCartOpen(true)} />

      <main className="main-content">
        <div className="container">
          <section className="shop-hero">
            <h1>Acessórios Tech</h1>
            
          </section>

          <SearchBar value={search} onChange={onSearch} />

          {error && (
            <div className="alert alert-error" role="alert">{error}</div>
          )}

          {loading ? (
            <div className="loading-grid">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="skeleton-card" aria-hidden="true" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="no-results">
              <span>🔍</span>
              <p>Nenhum produto encontrado{search ? ` para "${search}"` : ''}.</p>
            </div>
          ) : (
            <div className="product-grid">
              {products.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}

          <Pagination page={page} totalPages={meta.totalPages} onPage={setPage} />
        </div>
      </main>

      {cartOpen && (
        <CartModal
          onClose={() => setCartOpen(false)}
          onCheckoutSuccess={handleCheckoutSuccess}
        />
      )}

      {orderResult && (
        <SuccessScreen
          orderResult={orderResult}
          onContinue={() => setOrderResult(null)}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <CartProvider>
        <ShopApp />
      </CartProvider>
    </ToastProvider>
  );
}
