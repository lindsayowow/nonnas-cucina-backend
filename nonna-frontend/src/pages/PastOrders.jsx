import React, { useEffect, useState } from "react";
import "../styles/past-orders.css";
import { Link } from "react-router-dom";

export default function PastOrders({ token }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

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
    if (!userId) {
      setLoading(false);
      return;
    }

    async function fetchOrders() {
      try {
        const response = await fetch(
          `http://localhost:8080/orders/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          // Expecting each order to have: id, orderTimeStamp, orderTotal, dishes[]
          // where dishes[] has: id, dishName, dishCost, ingredients[]
          setOrders(data || []);
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

  // Favorite a dish
  async function handleFavorite(dishId) {
    try {
      const response = await fetch(
        `http://localhost:8080/favorites/${dishId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
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
        <Link to="/auth" className="login-button">
          Log In
        </Link>
      </section>
    );
  }

  // Loading state
  if (loading) {
    return (
      <section className="pastorders-container">
        <h1>Past Orders</h1>
        <p>Loading...</p>
      </section>
    );
  }

  // No orders
  if (!orders || orders.length === 0) {
    return (
      <section className="pastorders-container">
        <h1>Past Orders</h1>
        <p>You have no past orders yet.</p>
      </section>
    );
  }

  return (
    <section className="pastorders-container">
      <h1>Past Orders</h1>

      {orders.map((order) => (
        <div key={order.id} className="order-card">
          <div className="order-header">
            <p className="timestamp">
              {order.orderTimeStamp
                ? new Date(order.orderTimeStamp).toLocaleString()
                : ""}
            </p>
            <h2>Order #{order.id}</h2>
            <p className="order-total">
              Total:{" "}
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(order.orderTotal || 0)}
            </p>
          </div>

          <h3>Dishes</h3>
          <ul className="order-dishes">
            {(order.dishes || []).map((dish) => (
              <li key={dish.id} className="dish-item">
                <div className="dish-header">
                  <span className="dish-name">
                    {dish.dishName || "Unnamed Dish"}
                  </span>
                  <span className="dish-cost">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
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

                <ul className="ingredient-list">
                  {(dish.ingredients || []).map((ing) => (
                    <li key={ing.id} className="ingredient-item">
                      <span className="ingredient-emoji">
                        {ing.emoji || ""}
                      </span>
                      <span className="ingredient-name">
                        {ing.ingredientName || "Ingredient"}
                      </span>
                      <span className="ingredient-cost">
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                        }).format(ing.ingredientCost || 0)}
                      </span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}
