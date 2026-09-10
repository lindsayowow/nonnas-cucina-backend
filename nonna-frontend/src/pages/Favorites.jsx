import React from "react";
import "../styles/favorites.css";

import {useEffect, useState} from "react";
import {getFavoriteDishes} from "../services/api";

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    getFavoriteDishes().then(setFavorites);
  }, []);

  return (
    <section
      className="favorites-container"
      role="region"
      aria-labelledby="favorite-title">

      <h1 id="favorites-title" >
      My Favorite Dishes
      </h1>

{favorites.length === 0 && <p>You have no favorites yet.</p>}

      <ul>
        {favorites.map(dish => (
          <li key={dish.id}>
            {dish.dishName} — ${dish.dishCost}
          </li>
        ))}
      </ul>

    </section>
  );
}
