import { useState, useEffect } from "react";

export default function useFilters() {
  const [filters, setFilters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFilters() {
      try {
        const response = await fetch("http://localhost:8080/filters");
        const data = await response.json();
        setFilters(data);
      } catch {
        // Fetch failed -- filters stays empty, consumers already handle that state
      } finally {
        setLoading(false);
      }
    }

    fetchFilters();
  }, []);

  return { filters, loading };
}