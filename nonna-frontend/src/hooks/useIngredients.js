import { useState, useEffect } from "react";

export default function useIngredients() {
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchIngredients() {
      try {
        const response = await fetch("http://localhost:8080/ingredients");
        const data = await response.json();
        setIngredients(data);
      } catch {
        // Fetch failed -- ingredients stays empty, consumers already handle that state
      } finally {
        setLoading(false);
      }
    }

    fetchIngredients();
  }, []);

  return { ingredients, loading };
}