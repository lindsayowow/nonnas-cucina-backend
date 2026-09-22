import React, { useEffect, useState } from "react";
import "../styles/favorites.css";
import { Link } from "react-router-dom";
import FavoriteButton from "../components/buttons/FavoriteButton";
import useFavoriteToggle from "../hooks/useFavoriteToggle";
import useDishBuilderContext from "../hooks/useDishBuilderContext";
import SideNavBar from "../components/template/SideBarNav.jsx";

export default function Favorites({ token }) {
  const [allDishes, setAllDishes] = useState([]);

  const { getUserIdFromToken } = useDishBuilderContext();
  const userId = getUserIdFromToken(token);

  // show dishes displayed so that toggleFavorite works
  const wrappedOrders = [
    {
      id: 0,
      dishes: allDishes
    }
  ];

   const { toggleFavorite } = useFavoriteToggle(
    wrappedOrders,
    newOrders => {
      // Extract updated dishes from wrapper
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

        // If unauthorized or failed, fallback to empty list
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
        // Network error → empty list
        setAllDishes([]);
      }
    }

    fetchFavorites();
  }, [userId, token]);

  // User not logged in
  if (!token) {
    return (      
      <section className="favorites-container">
        <h1>My Favorite Dishes</h1>
        <p> Please <Link to="/auth" className="login-link">log in</Link> to see your favorites.</p>
      </section>
    );
  }

  // Filter only dishes marked as favorite
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

        {/* Empty favorites state */}
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

                  {/* Dish cost */}
                  <span className="dish-cost">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD"
                    }).format(dish.dishCost)}
                  </span>

                  {/* Favorite toggle button */}
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
