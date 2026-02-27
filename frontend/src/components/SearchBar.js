import React, { useState } from 'react';

export default function SearchBar({ value, onChange }) {
  const [input, setInput] = useState(value);

  const handleSubmit = (e) => {
    e.preventDefault();
    onChange(input);
  };

  const handleClear = () => {
    setInput('');
    onChange('');
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit} role="search">
      <input
        type="search"
        className="search-input"
        placeholder="Buscar produtos..."
        value={input}
        onChange={e => setInput(e.target.value)}
        aria-label="Buscar produtos"
      />
      {input && (
        <button type="button" className="search-clear" onClick={handleClear} aria-label="Limpar busca">✕</button>
      )}
      <button type="submit" className="btn btn-primary search-btn">Buscar</button>
    </form>
  );
}
