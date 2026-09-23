import React, { useEffect, useState } from "react";
import "../styles/favorites.css";
import { Link } from "react-router-dom";
import FavoriteButton from "../components/buttons/FavoriteButton";
import useFavoriteToggle from "../hooks/useFavoriteToggle";
import useDishBuilderContext from "../hooks/useDishBuilderContext";
import SideNavBar from "../components/template/SideBarNav.jsx";

export default function Favorites({ token }) {
  const [allDishes, setAllDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(false);

  const { getUserIdFromToken } = useDishBuilderContext();
  const userId = getUserIdFromToken(token);

  // Show dishes in a wrapper so toggleFavorite can work with the existing hook
  const wrappedOrders = [
    {
      id: 0,
      dishes: allDishes
    }
  ];

  // Toggle favorite status and update the local dishes list
  const { toggleFavorite } = useFavoriteToggle(
    wrappedOrders,
    (newOrders) => {
      // Extract updated dishes from wrapper
      setAllDishes(newOrders[0].dishes);
    },
    token
  );

  // Fetch the user's past orders so favorite dishes can be identified
  useEffect(() => {
    // No user ID means there is no authenticated user to fetch favorites for
    if (!userId) {
      setLoading(false);
      return;
    }

    async function fetchFavorites() {
      try {
        const response = await fetch(
          `http://localhost:8080/pastorders/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        // Token invalid or expired
        if (response.status === 401 || response.status === 403) {
          setAuthError(true);
          setAllDishes([]);
          return;
        }

        // Any other failed request treat as an empty list
        if (!response.ok) {
          setAllDishes([]);
          return;
        }

        // Successfully retrieve the user's past orders
        const orders = await response.json();

        //  put all dishes into one list
        const dishes = orders.flatMap((order) =>
          (order.dishes ?? []).map((dish) => ({
            ...dish,
            orderId: order.id,

            // Support ingredient property names
            ingredients:
              dish.ingredients ??
              dish.ingredientList ??
              dish.ingredientsForDish ??
              []
          }))
        );

        setAllDishes(dishes);
      } catch {
        // Network error treat as an empty list
        setAllDishes([]);
      } finally {
        setLoading(false);
      }
    }

    fetchFavorites();
  }, [userId, token]);

  // Filter only dishes marked as favorites
  const favorites = allDishes.filter(
    (dish) => dish.isFavorite === true
  );

  return (
    <main className="favorites-layout" aria-label="Favorites page">

      {/* Left column: Side navigation bar */}
      <div
        className="section-0"
        role="region"
        aria-label="Side navigation bar"
      >
        <div className="navbar-container">
          <SideNavBar />
        </div>
      </div>

      {/* Right column: Favorites content */}
      <section className="favorites-container">

        {/* User not logged in */}
        {!token && (
          <>
            <h1>My Favorite Dishes</h1>

            <p>
              Please{" "}
              <Link to="/auth" className="login-link">
                log in
              </Link>{" "}
              to see your favorites.
            </p>
          </>
        )}

        {/* Loading state */}
        {token && loading && (
          <>
            <h1>My Favorite Dishes</h1>
            <p>Loading...</p>
          </>
        )}

        {/* Unauthorized */}
        {token && !loading && authError && (
          <>
            <h1>My Favorite Dishes</h1>
            <p>
              You are not authorized to view your favorite dishes.
            </p>
          </>
        )}

        {/* No favorite dishes */}
        {token &&
          !loading &&
          !authError &&
          favorites.length === 0 && (
            <>
              <h1>My Favorite Dishes</h1>
              <p>You have no favorites yet.</p>
            </>
          )}

        {/* Favorite dishes */}
        {token &&
          !loading &&
          !authError &&
          favorites.length > 0 && (
            <>
              <h1>My Favorite Dishes</h1>

              <ul className="favorites-list">
                {favorites.map((dish, index) => {
                  // put ingredients into list
                  const ingredientNames =
                    dish.ingredients.length > 0
                      ? dish.ingredients
                          .map((ing) => ing.ingredientName)
                          .join(", ")
                      : "No ingredients listed";

                  return (
                    <li
                      key={dish.id}
                      className="favorite-item"
                    >
                      <div className="favorite-row">

                        {/* Dish number */}
                        <span className="dish-label">
                          Dish {index + 1}:
                        </span>

                        {/* Dish ingredients */}
                        <span className="dish-ingredients">
                          {ingredientNames}
                        </span>

                        {/* Dish cost */}
                        <span className="dish-cost">
                          {new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "USD"
                          }).format(dish.dishCost || 0)}
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
            </>
          )}

      </section>
    </main>
  );
}