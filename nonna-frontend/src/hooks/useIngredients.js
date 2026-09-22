import { useState, useEffect } from "react";

export default function useIngredients() {
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchIngredients() {
      try {
        // Request ingredient DTOs 
        const response = await fetch("http://localhost:8080/ingredients");

        // parse JSON response
        const data = await response.json();

        // Store ingredients in state
        setIngredients(data);
      } catch {
        // Fetch failed -- ingredients stays empty
      } finally {
        // Loading ends regardless of success or failure
        setLoading(false);
      }
    }

    // Run once on mount
    fetchIngredients();
  }, []);

  return { ingredients, loading };
}
