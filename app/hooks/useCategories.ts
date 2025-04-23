import { useEffect, useState } from "react";
import { fetchCategories } from "~/services/fetchCategories";
import type { Category } from "~/services/fetchCategories";

interface UseCategoriesResult {
  categories: Category[];
  isLoading: boolean;
  error: string | null;
}

/**
 * Custom hook to fetch all categories.
 */
export function useCategories(): UseCategoriesResult {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    fetchCategories()
      .then(setCategories)
      .catch((err) => {
        setError(err.message || "取得類別失敗");
        setCategories([]);
      })
      .finally(() => setIsLoading(false));
  }, []);

  return { categories, isLoading, error };
}
