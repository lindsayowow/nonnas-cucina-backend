import { useState, useEffect } from "react";

export default function useFilters() {
  const [filters, setFilters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFilters() {
      try {
        // Request filter DTOs
        const response = await fetch("http://localhost:8080/filters");

        // parsing JSON response
        const data = await response.json();

        // Stores filter state
        setFilters(data);
      } catch {
        // Fetch failed - filters stay empty
      } finally {
        // Loading ends regardless of success or failure
        setLoading(false);
      }
    }

    fetchFilters();
  }, []);

  return { filters, loading };
}
