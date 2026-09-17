import React, { useEffect, useState } from "react";
import "../styles/past-orders.css";
import { Link } from "react-router-dom";

export default function PastOrders({ token }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(false);

  // ✅ Updated to handle new login response structure
  function getUserIdFromToken(token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      // Your backend now sends "sub" as userId (string)
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
        console.log("TOKEN:", token);
        console.log("USER ID:", userId);

        const response = await fetch(
          `http://localhost:8080/pastorders/user/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        console.log("PAST ORDERS STATUS:", response.status);

        if (response.status === 401 || response.status === 403) {
          console.error("AUTH ERROR FETCHING PAST ORDERS");
          setAuthError(true);
          setOrders([]);
          return;
        }

        if (response.ok) {
          const data = await response.json();
          console.log("PAST ORDERS DATA:", data);
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

  // 🧩 Conditional rendering
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
        <p>You have no past orders yet.</p>
      </section>
    );
  }

  // ✅ Render grouped dishes and ingredients
  return (
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
              Total:{" "}
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD"
              }).format(order.orderTotal || 0)}
            </p>
          </div>

          <h3>Dishes</h3>
          <ul className="order-dishes">
            {(order.dishes ?? []).map(dish => {
              const ingredients =
                dish.ingredients ??
                dish.ingredientList ??
                dish.ingredientsForDish ??
                [];

              return (
                <li key={dish.id} className="dish-item">
                  <div className="dish-header">
                    <span className="dish-cost">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD"
                      }).format(dish.dishCost || 0)}
                    </span>

                    <button
                      className="favorite-btn"
                      onClick={() => handleFavorite(dish.id)}
                      aria-label="Add dish to favorites"
                    >
                      ♡
                    </button>
                  </div>

                  {/* ✅ Group ingredients under each dish */}
                  {ingredients.length > 0 && (
                    <ul className="ingredient-list">
                      {ingredients.map(ing => (
                        <li key={ing.id} className="ingredient-item">
                          <span className="ingredient-emoji">{ing.emoji}</span>
                          <span className="ingredient-name">{ing.ingredientName}</span>
                          <span className="ingredient-cost">
                            {new Intl.NumberFormat("en-US", {
                              style: "currency",
                              currency: "USD"
                            }).format(ing.ingredientCost || 0)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </section>
  );
}
