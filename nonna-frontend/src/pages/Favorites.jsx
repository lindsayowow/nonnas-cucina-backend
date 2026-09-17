import React, { useEffect, useState } from "react";
import "../styles/favorites.css";
import { getFavoriteDishes } from "../services/api";
import { Link } from "react-router-dom";

export default function Favorites({ token }) {
  const [favorites, setFavorites] = useState([]);

  function getUserIdFromToken(token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return Number(payload.sub);
    } catch {
      return null;
    }
  }

  const userId = getUserIdFromToken(token);

  useEffect(() => {
    if (!userId) return;

    getFavoriteDishes().then(allFavs => {
      const userFavs = allFavs.filter(f => Number(f.user_id) === userId);
      setFavorites(userFavs);
    });
  }, [userId]);

  if (!token) {
    return (
      <section className="favorites-container">
        <h1>My Favorite Dishes</h1>
        <p>Please log in to see your favorites.</p>
        <Link to="/auth" className="login-button">Log In</Link>
      </section>
    );
  }

  return (
    <section className="favorites-container">
      <h1>My Favorite Dishes</h1>

      {favorites.length === 0 && <p>You have no favorites yet.</p>}

      <ul>
        {favorites.map((dish, index) => (
          <li key={dish.id}>
            Dish {index + 1} — $
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD"
            }).format(dish.dishCost)}
          </li>
        ))}
      </ul>
    </section>
  );
}
