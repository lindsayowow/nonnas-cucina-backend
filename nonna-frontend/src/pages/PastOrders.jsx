import React, { useEffect, useState } from "react";
import "../styles/past-orders.css";
import { Link } from "react-router-dom";
import SideNavBar from "../components/template/SideBarNav.jsx";
import useFavoriteToggle from "../hooks/useFavoriteToggle";
import useDishBuilderContext from "../hooks/useDishBuilderContext";
import FavoriteButton from "../components/buttons/FavoriteButton";

// Formats numbers as US currency
const currency = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(value || 0);

export default function PastOrders({ token }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(false);

  const { toggleFavorite } = useFavoriteToggle(orders, setOrders, token);
  const { getUserIdFromToken } = useDishBuilderContext();
  const userId = getUserIdFromToken(token);

  // Fetch the user's past orders when a valid user ID and token are available
  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    async function fetchOrders() {
      try {
        const response = await fetch(
          `http://localhost:8080/pastorders/user/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        // Token invalid or expired
        if (response.status === 401 || response.status === 403) {
          setAuthError(true);
          setOrders([]);
          return;
        }

        // Successful fetch
        if (response.ok) {
          const data = await response.json();
          setOrders(data ?? []);
        } else {
          // No auth  treat as empty list
          setOrders([]);
        }
      } catch {
        // Network failure treat as empty list
        setOrders([]);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, [userId, token]);

  return (
    <main className="pastorders-layout" aria-label="Past Orders page">

      {/* Left column: Side navigation bar */}
      <div className="section-0" role="region" aria-label="Side navigation bar">
        <div className="navbar-container">
          <SideNavBar />
        </div>
      </div>

      {/* Right column: Past orders content */}
      <section className="pastorders-container">

        {/* User not logged in */}
        {!token && (
          <>
            <h1>Past Orders</h1>

            <p>
              Please{" "}
              <Link to="/auth" className="login-link">
                Log In
              </Link>{" "}
              to see your past orders.
            </p>
          </>
        )}

        {/* Loading state */}
        {token && loading && (
          <>
            <h1>Past Orders</h1>
            <p>Loading...</p>
          </>
        )}

        {/* Unauthorized */}
        {token && !loading && authError && (
          <>
            <h1>Past Orders</h1>
            <p>You are not authorized to view these orders.</p>
          </>
        )}

        {/* No orders */}
        {token && !loading && !authError && (!orders || orders.length === 0) && (
          <>
            <h1>Past Orders</h1>
            <p>You have not created any orders yet.</p>
          </>
        )}

        {/* Past orders */}
        {token && !loading && !authError && orders && orders.length > 0 && (
          <>
            <h1>Past Orders</h1>

            {orders.map((order) => (
              <div key={order.id} className="order-card">

                {/* Order number */}
                <span className="order-number">
                  Order #{order.id}
                </span>

                {/* Order date and total */}
                <div className="order-header unified-header">
                  <span className="left">
                    {new Date(order.orderTimeStamp).toLocaleString()}
                  </span>

                  <span className="right">
                    Total: {currency(order.orderTotal)}
                  </span>
                </div>

                {/* List of dishes included in this order */}
                <ul className="order-dishes">
                  {(order.dishes ?? []).map((dish, index) => {
                    const ingredients =
                      dish.ingredients ??
                      dish.ingredientList ??
                      dish.ingredientsForDish ??
                      [];

                    // Convert ingredient objects into a comma-separated list
                    const ingredientNames =
                      ingredients.length > 0
                        ? ingredients
                            .map((ing) => ing.ingredientName)
                            .join(", ")
                        : "No ingredients listed";

                    return (
                      <li
                        key={dish.id}
                        className="dish-item dish-row"
                      >

                        {/* Dish name and ingredients */}
                        <div className="dish-info">
                          <span className="dish-label">
                            Dish {index + 1}:{" "}
                          </span>

                          <span className="dish-ingredients">
                            {ingredientNames}
                          </span>
                        </div>

                        {/* Dish price and favorite button */}
                        <div className="dish-actions">
                          <span className="dish-cost">
                            {currency(dish.dishCost)}
                          </span>

                          {/* Favorite toggle button */}
                          <FavoriteButton
                            orderId={order.id}
                            dish={dish}
                            toggleFavorite={toggleFavorite}
                          />
                        </div>

                      </li>
                    );
                  })}
                </ul>

              </div>
            ))}
          </>
        )}

      </section>
    </main>
  );
}