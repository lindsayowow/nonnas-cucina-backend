import React, { useEffect, useState } from "react";
import "../styles/favorites.css";
import { Link } from "react-router-dom";
import FavoriteButton from "../components/buttons/FavoriteButton";
import useFavoriteToggle from "../hooks/useFavoriteToggle";
import SideNavBar from "../components/template/SideBarNav.jsx";

export default function Favorites({ token }) {
  const [allDishes, setAllDishes] = useState([]);

  function getUserIdFromToken(token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return Number(payload.sub);
    } catch {
      return null;
    }
  }

  const userId = getUserIdFromToken(token);

  const wrappedOrders = [
    {
      id: 0,
      dishes: allDishes
    }
  ];

  const { toggleFavorite } = useFavoriteToggle(
    wrappedOrders,
    newOrders => {
      setAllDishes(newOrders[0].dishes);
    },
    token
  );

  useEffect(() => {
    if (!userId) return;

    async function fetchFavorites() {
      try {
        const response = await fetch(
          `http://localhost:8080/pastorders/user/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        if (!response.ok) {
          setAllDishes([]);
          return;
        }

        const orders = await response.json();

        const dishes = orders.flatMap(order =>
          (order.dishes ?? []).map(dish => ({
            ...dish,
            orderId: order.id,
            ingredients:
              dish.ingredients ??
              dish.ingredientList ??
              dish.ingredientsForDish ??
              []
          }))
        );

        setAllDishes(dishes);
      } catch {
        // Network error -- fall back to an empty favorites list
        setAllDishes([]);
      }
    }

    fetchFavorites();
  }, [userId, token]);

  if (!token) {
    return (
      <section className="favorites-container">
        <h1>My Favorite Dishes</h1>
        <p>Please log in to see your favorites.</p>
        <Link to="/auth" className="login-button">Log In</Link>
      </section>
    );
  }

  const favorites = allDishes.filter(dish => dish.isFavorite === true);

  return (
    <main className="favorites-layout" aria-label="Favorites page">

      {/* Always render sidebar - mobile + desktop */}
      <div className="section-0" role="region" aria-label="Side navigation bar">
        <div className="navbar-container">
          <SideNavBar />
        </div>
      </div>

      <section className="favorites-container">
        <h1>My Favorite Dishes</h1>

        {favorites.length === 0 && <p>You have no favorites yet.</p>}

        <ul className="favorites-list">
          {favorites.map((dish, index) => {
            const ingredientNames =
              dish.ingredients.length > 0
                ? dish.ingredients.map(ing => ing.ingredientName).join(", ")
                : "No ingredients listed";

            return (
              <li key={dish.id} className="favorite-item">
                <div className="favorite-row">
                  <span className="dish-label">Dish {index + 1}:</span>
                  <span className="dish-ingredients">{ingredientNames}</span>
                  <span className="dish-cost">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD"
                    }).format(dish.dishCost)}
                  </span>

                  <FavoriteButton
                    orderId={0}
                    dish={dish}
                    toggleFavorite={toggleFavorite}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    </main>
  );
}
