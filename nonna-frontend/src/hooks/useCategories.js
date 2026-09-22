import { useState, useEffect } from "react";

export default function useCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        // Request all category DTOs 
        const response = await fetch("http://localhost:8080/categories");

        // parse JSON response
        const data = await response.json();

        // Store categories in state
        setCategories(data);
      } catch {
        // Fetch failed — categories remains empty
      } finally {
        // Loading ends
        setLoading(false);
      }
    }

    // Run once on mount
    fetchCategories();
  }, []);

  return { categories, loading };
}
