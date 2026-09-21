import React, { useEffect, useState } from "react";
import "../styles/past-orders.css";
import { Link } from "react-router-dom";
import SideNavBar from "../components/template/SideBarNav.jsx";
import useFavoriteToggle from "../hooks/useFavoriteToggle";
import useDishBuilderContext from "../hooks/useDishBuilderContext";
import FavoriteButton from "../components/buttons/FavoriteButton";

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

  // Shared JWT-decode helper from context, instead of a local duplicate.
  // (The old local version also fell back to payload.userId/payload.id,
  // but the backend JWT only ever sets "sub" -- that fallback was dead.)
  const { getUserIdFromToken } = useDishBuilderContext();
  const userId = getUserIdFromToken(token);

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

        if (response.status === 401 || response.status === 403) {
          setAuthError(true);
          setOrders([]);
          return;
        }

        if (response.ok) {
          const data = await response.json();
          setOrders(data ?? []);
        } else {
          // Non-OK, non-auth failure -- fall back to an empty order list
          setOrders([]);
        }
      } catch {
        // Network error -- fall back to an empty order list
        setOrders([]);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, [userId, token]);

  if (!token) {
    return (
      <section className="pastorders-container">
        <h1>Past Orders</h1>
        <p>Please log in to see your past orders.</p>
        <Link to="/auth" className="login-button">Log In</Link>
      </section>
    );
  }

  if (loading) {
    return (
      <section className="pastorders-container">
        <h1>Past Orders</h1>
        <p>Loading...</p>
      </section>
    );
  }

  if (authError) {
    return (
      <section className="pastorders-container">
        <h1>Past Orders</h1>
        <p>You are not authorized to view these orders.</p>
      </section>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <section className="pastorders-container">
        <h1>Past Orders</h1>
        <p>You have not created any orders yet.</p>
      </section>
    );
  }

  return (
    <main className="pastorders-layout" aria-label="Past Orders page">

      <div className="section-0" role="region" aria-label="Side navigation bar">
        <div className="navbar-container">
          <SideNavBar />
        </div>
      </div>

      <section className="pastorders-container">
        <h1>Past Orders</h1>

        {orders.map(order => (
          <div key={order.id} className="order-card">

            {/* NEW — centered Order # */}
            <span className="order-number">
              Order #{order.id}
            </span>

            <div className="order-header unified-header">
              <span className="left">
                {new Date(order.orderTimeStamp).toLocaleString()}
              </span>

              <span className="right">
                Total: {currency(order.orderTotal)}
              </span>
            </div>

            <ul className="order-dishes">
              {(order.dishes ?? []).map((dish, index) => {
                const ingredients =
                  dish.ingredients ??
                  dish.ingredientList ??
                  dish.ingredientsForDish ??
                  [];

                const ingredientNames = ingredients.length > 0
                  ? ingredients.map(ing => ing.ingredientName).join(", ")
                  : "No ingredients listed";

                return (
                  <li key={dish.id} className="dish-item dish-row">

                    <div className="dish-info">
                      <span className="dish-label">Dish {index + 1}:  </span>
                      <span className="dish-ingredients">{ingredientNames}</span>
                    </div>

                    <div className="dish-actions">
                      <span className="dish-cost">{currency(dish.dishCost)}</span>

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
      </section>
    </main>
  );
}
