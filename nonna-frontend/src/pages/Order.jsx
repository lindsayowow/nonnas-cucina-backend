// src/pages/Order.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/order.css';

import OrderButton from '../components/buttons/OrderButton.jsx';
import RemoveDishButton from '../components/buttons/RemoveDishButton.jsx';
import DishButton from '../components/buttons/DishButton.jsx';

import useDishBuilderContext from "../hooks/useDishBuilderContext";

export default function Order({ token }) {
  const navigate = useNavigate();

  const {
    sendToKitchen,
    removeDish,
    yourOrder,
    grandTotal
  } = useDishBuilderContext();

  const [kitchenMessage, setKitchenMessage] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleSendToKitchen = async () => {
    if (!token) {
      setShowLoginModal(true);
      return;
    }

    try {
      const success = await sendToKitchen(token);

      if (success) {
        setKitchenMessage("Your order has been sent to Nonna's Kitchen!");
      }
    } catch (err) {
      console.error("Error sending order:", err);
    }
  };

  console.log("TOKEN IN ORDER PAGE:", token);

  return (
    <div className="order-page">
      <div
        className="card order"
        role="region"
        aria-labelledby="order-title"
      >
        <h2 id="order-title" className="text-center">Your Order</h2>

        {kitchenMessage && (
          <div className="kitchen-confirmation" aria-live="polite">
            {kitchenMessage}
          </div>
        )}

        {yourOrder.length === 0 ? (
          <div className="emptyOrder text-center">
            <p className="clipboardEmoji" aria-hidden="true">📋</p>
            <p>Your current order is empty.</p>
          </div>
        ) : (
          <div>
            <ul
              className="activeOrder"
              role="region"
              aria-label="Current order"
            >
              {yourOrder.map((dish, index) => {
                const emojis = dish.ingredients.map(ing => ing.emoji).join(" ");
                const names = dish.ingredients.map(ing => ing.name).join(", ");

                return (
                  <li
                    key={index}
                    aria-label={`Dish ${index + 1}: ${names}`}
                  >
                    <div className="dishInfo">
                      <div className="dishLine">
                        <strong>Dish {index + 1}</strong>
                      </div>

                      <div className="dishLine" aria-hidden="true">
                        {emojis}
                      </div>

                      <div className="dishLine">
                        {names}
                      </div>

                      <div className="dishLine">
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD"
                        }).format(dish.totalCost)}
                      </div>
                    </div>

                    <RemoveDishButton onRemoveDish={() => removeDish(dish)} />
                  </li>
                );
              })}
            </ul>

            <p className="costSummary text-bold text-center">
              Total Order cost: {grandTotal}
            </p>
          </div>
        )}

        <Link to="/buildadish">
          <DishButton type="button">
            Add Another Dish
          </DishButton>
        </Link>

        <OrderButton
          sendToKitchen={handleSendToKitchen}
          disabled={yourOrder.length === 0}
        />
      </div>

      {showLoginModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>Please log in</h3>
            <p>You need to be logged in to place your order.</p>

            <button
              className="modal-btn"
              onClick={() => navigate("/auth")}
            >
              Go to Login
            </button>

            <button
              className="modal-btn cancel"
              onClick={() => setShowLoginModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
