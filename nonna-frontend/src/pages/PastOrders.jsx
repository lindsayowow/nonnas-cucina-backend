import React, { useEffect, useState } from "react";
import "../styles/past-orders.css";
import { Link } from "react-router-dom";

export default function PastOrders({ token }) {
  const [orders, setOrders] = useState([]);

  // Decode userId from token
  function getUserIdFromToken(token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.sub;
    } catch {
      return null;
    }
  }

  const userId = getUserIdFromToken(token);

  // Fetch past orders for this user
  useEffect(() => {
    if (!userId) return;

    async function fetchOrders() {
      try {
        const response = await fetch(
          `http://localhost:8080/orders/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (response.ok) {
          const data = await response.json();
          setOrders(data);
        } else {
          console.error("Failed to fetch past orders");
        }
      } catch (err) {
        console.error("Error fetching past orders", err);
      }
    }

    fetchOrders();
  }, [userId, token]);

  // Favorite a dish
  async function handleFavorite(dishId) {
    try {
      const response = await fetch(
        `http://localhost:8080/favorites/${dishId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        console.error("Failed to favorite dish");
      }
    } catch (err) {
      console.error("Error favoriting dish", err);
    }
  }

  // If not logged in
  if (!token) {
    return (
      <section className="pastorders-container">
        <h1>Past Orders</h1>
        <p>Please log in to see your past orders.</p>
        <Link to="/auth" className="login-button">Log In</Link>
      </section>
    );
  }

  return (
    <section className="pastorders-container">
      <h1>Past Orders</h1>

      {orders.length === 0 && (
        <p>You have no past orders yet.</p>
      )}

      {orders.map(order => (
        <div key={order.id} className="order-card">
          <h2>Order #{order.id}</h2>
          <p className="timestamp">{order.order_time_stamp}</p>

          <ul className="order-dishes">
            {order.dishes.map(dish => (
              <li key={dish.id} className="dish-item">
                <span>
                  {dish.dish_name || "Unnamed Dish"} — $
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD"
                  }).format(dish.dish_cost)}
                </span>

                <button
                  className="favorite-btn"
                  onClick={() => handleFavorite(dish.id)}
                  aria-label="Add dish to favorites"
                >
                  ♡
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}
