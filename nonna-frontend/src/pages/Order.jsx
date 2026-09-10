import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/order.css';

import OrderButton from '../components/buttons/OrderButton.jsx';
import RemoveDishButton from '../components/buttons/RemoveDishButton.jsx';
import DishButton from '../components/buttons/DishButton.jsx';

import { useDishBuilderContext } from "../context/DishBuilderContext";

export default function Order() {
  const {
    sendToKitchen,
    removeDish,
    yourOrder,
    grandTotal
  } = useDishBuilderContext();

  const [kitchenMessage, setKitchenMessage] = React.useState("");

  const handleSendToKitchen = () => {
    sendToKitchen();
    setKitchenMessage("Your order has been sent to Nonna's Kitchen!");
  };

  return (
    <div className="order-page">
      <div
        className="card order"
        role="region"
        aria-labelledby="order-title"
      >
        <h2 id="order-title" className="text-center">Your Order</h2>

        {kitchenMessage && (
          <div
            className="kitchen-confirmation"
            aria-live="polite"
          >
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
            {/* Use of lists */}
            <ul
              className="activeOrder"
              role="region"
              aria-label="Current order"
            >
              {yourOrder.map(dish => {
                const emojis = dish.ingredients.map(ing => ing.emoji).join(" ");
                const names = dish.ingredients.map(ing => ing.name).join(", ");

                return (
                  <li
                    key={dish.id}
                    aria-label={`Dish ${dish.id}: ${names}`}
                  >
                    <div className="dishInfo">
                      <div className="dishLine">
                        <strong>Dish {dish.id}</strong>
                      </div>

                      {/* Decorative emojis hidden from screen readers */}
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

                    <RemoveDishButton
                      onRemoveDish={() => removeDish(dish)}
                    />
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
    </div>
  );
}
