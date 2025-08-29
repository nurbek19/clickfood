import { useCallback, useEffect, useMemo, useState } from 'react';
import deepEqual from 'deep-equal';
import { getFoods } from '@menu/services/foodsService';

export function useDishes({ partnerId }) {
  const [dishes, setDishes] = useState([]);
  const [originalDishes, setOriginalDishes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    if (!partnerId) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await getFoods(partnerId);
      setDishes(data);
      setOriginalDishes(data);
      const cats = Array.from(new Set(data.map((d) => d.category).filter(Boolean)));
      setCategories(cats);
    } catch (e) {
      setError(e);
    } finally {
      setIsLoading(false);
    }
  }, [partnerId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const isChanged = useMemo(() => {
    return dishes.some((d) => {
      const initial = originalDishes.find((x) => x._id === d._id);
      return !initial || !deepEqual(initial, d);
    });
  }, [dishes, originalDishes]);

  const getChangedDishes = useCallback(() => {
    return dishes.filter((d) => {
      const initial = originalDishes.find((x) => x._id === d._id);
      return !initial || !deepEqual(initial, d);
    });
  }, [dishes, originalDishes]);

  return {
    dishes,
    setDishes,
    originalDishes,
    categories,
    setCategories,
    isLoading,
    error,
    isChanged,
    getChangedDishes,
    refresh,
  };
}


