import { useState, useEffect, useCallback } from 'react';
import { itemService, Item } from '../services/item.service';

export function useItems() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const res = await itemService.getMyItems(page);
      setItems(res.items);
      setTotalPages(res.totalPages);
    } catch (err) {
      console.error('Failed to fetch items:', err);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  return { items, loading, page, totalPages, setPage, refresh: fetchItems };
}
