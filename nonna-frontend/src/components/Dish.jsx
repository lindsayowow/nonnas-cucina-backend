import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/dish.css';
import DishButton from './buttons/DishButton.jsx';
import RemoveIngredientButton from './buttons/RemoveIngredientButton.jsx';

export default function Dish({
  selectedIngredients,
  totalPrice,
  updateOrder,
  removeIngredient,
  yourOrder
}) {
  // Dish count shown on the "Go to Cart" button
  const cartCount = yourOrder?.length || 0;

  return (
    <div className="card dish">
      <h2 className="text-center">Your Dish</h2>

      <div className="dish-content">
        {/* example of conditional rendering */}
        {selectedIngredients.length === 0 ? (
          <div className="empty">
            <p className="dishEmoji" aria-hidden="true">🍽️</p>
            <p>Your current dish is empty.</p>
          </div>
        ) : (
          // Use of lists 
          <ul
            className="activeIngredientsSelected"
            role="region"
            aria-label="Selected ingredients"
          >
            {selectedIngredients.map((ingredient) => (
              <li key={ingredient.id ?? ingredient.name}>
                <span className="ingredientText">
                  <span className="ingredientEmoji" aria-hidden="true">
                    {ingredient.emoji}
                  </span>
                  {ingredient.name} –{" "}
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD"
                  }).format(ingredient.price)}
                </span>
                {/* passing props from parent to child */}
                <RemoveIngredientButton
                  ingredient={ingredient}
                  onRemove={removeIngredient}
                />
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Running total, only shown once something is selected */}
      {selectedIngredients.length > 0 && (
        <p className="dishTotal text-bold text-center">
          Order total:{" "}
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD"
          }).format(totalPrice)}
        </p>
      )}

      {/* Add current selections into a dish on the active order */}
      <DishButton
        onClick={updateOrder}
        disabled={selectedIngredients.length === 0}
      >
        Add to Order
      </DishButton>

      {/* Navigate to the cart/order page */}
      <Link to="/cart">
        <DishButton>
          Go to Cart 🛒 ({cartCount})
        </DishButton>
      </Link>
    </div>
  );
}
