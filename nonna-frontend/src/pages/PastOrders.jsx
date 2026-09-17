import React, { useEffect, useState } from "react";
import "../styles/past-orders.css";
import { Link } from "react-router-dom";
import SideNavBar from "../components/template/SideBarNav.jsx";

const currency = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(value || 0);

export default function PastOrders({ token }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(false);

  function getUserIdFromToken(token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      // Backend sends "sub" as the userId (string)
      return Number(payload.sub ?? payload.userId ?? payload.id);
    } catch {
      return null;
    }
  }

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
          console.error("Failed to fetch past orders");
          setOrders([]);
        }
      } catch (err) {
        console.error("Error fetching past orders", err);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, [userId, token]);

  async function handleFavorite(dishId) {
    try {
      const response = await fetch(
        `http://localhost:8080/favorites/${dishId}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (!response.ok) {
        console.error("Failed to favorite dish");
      }
    } catch (err) {
      console.error("Error favoriting dish", err);
    }
  }

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

      {/* DESKTOP NAVBAR */}
      <div className="section-0 desktop-only" role="region" aria-label="Side navigation bar">
        <div className="navbar-container">
          <SideNavBar />
        </div>
      </div>

    <section className="pastorders-container">
      <h1>Past Orders</h1>

      {orders.map(order => (
        <div key={order.id} className="order-card">
          <div className="order-header">
            <p className="timestamp">
              {new Date(order.orderTimeStamp).toLocaleString()}
            </p>
            <h2>Order #{order.id}</h2>
            <p className="order-total">
              Total: {currency(order.orderTotal)}
            </p>
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
                <li key={dish.id} className="dish-item">
                  <span className="dish-label">Dish {index + 1}:</span>
                  <span className="dish-ingredients">{ingredientNames}</span>
                  <span className="dish-cost">{currency(dish.dishCost)}</span>
                  <button
                    className="favorite-btn"
                    onClick={() => handleFavorite(dish.id)}
                    aria-label="Add dish to favorites"
                  >
                    ♡
                  </button>
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
