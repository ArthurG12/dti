import { useState, useEffect, useCallback } from 'react';
import { getProducts } from '../services/api';

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [meta, setMeta] = useState({ total: 0, totalPages: 1, page: 1 });
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProducts({ search, page, limit: 8 });
      setProducts(data.products);
      setMeta({ total: data.total, totalPages: data.totalPages, page: data.page });
    } catch {
      setError('Falha ao carregar produtos. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }, [search, page]);

  useEffect(() => { fetch(); }, [fetch]);

  const onSearch = (value) => {
    setSearch(value);
    setPage(1);
  };

  return { products, meta, search, page, loading, error, onSearch, setPage, refetch: fetch };
}
