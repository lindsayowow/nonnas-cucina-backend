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
    // If user is not logged in, show error instead of sending order
    if (!token) {
      setShowLoginModal(true);
      return;
    }

    try {
      const success = await sendToKitchen(token);

      if (success) {
        // Successful submission
        setKitchenMessage("Your order has been sent to Nonna's Kitchen!");
      } else {
        // Backend or validation failure
        setKitchenMessage("Something went wrong sending your order. Please try again.");
      }
    } catch {
      // Network or unexpected error
      setKitchenMessage("Something went wrong sending your order. Please try again.");
    }
  };

  return (
    <div className="order-page">
      <div
        className="card order"
        role="region"
        aria-labelledby="order-title"
      >
        <h2 id="order-title" className="text-center">Your Order</h2>

        {/* Confirmation or error message */}
        {kitchenMessage && (
          <div className="kitchen-confirmation" aria-live="polite">
            {kitchenMessage}
          </div>
        )}

        {/* Empty order state */}
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

                      {/* Ingredient emojis */}
                      <div className="dishLine" aria-hidden="true">
                        {emojis}
                      </div>

                      {/* Ingredient names */}
                      <div className="dishLine">
                        {names}
                      </div>

                      {/* Dish cost */}
                      <div className="dishLine">
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD"
                        }).format(dish.totalCost)}
                      </div>
                    </div>

                    {/* Remove dish from order */}
                    <RemoveDishButton onRemoveDish={() => removeDish(dish)} />
                  </li>
                );
              })}
            </ul>

            {/* Total cost */}
            <p className="costSummary text-bold text-center">
              Total Order cost: {grandTotal}
            </p>
          </div>
        )}

        {/* Add another dish */}
        <Link to="/buildadish">
          <DishButton type="button">
            Add Another Dish
          </DishButton>
        </Link>

        {/* Submit order */}
        <OrderButton
          sendToKitchen={handleSendToKitchen}
          disabled={yourOrder.length === 0}
        />
      </div>

      {/* Login popup */}
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
