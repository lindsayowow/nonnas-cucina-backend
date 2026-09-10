import React, { useState } from 'react';
import '../styles/ingredients.css';
import IngredientsData from '../data/ingredients.json';
import IngredientButton from './buttons/IngredientButton.jsx';
import ClearIngredientsButton from './buttons/ClearIngredientsButton.jsx';
import DishButton from "./buttons/DishButton.jsx";
import { categoryMap, inversionList, filterMap } from '../utils/constants.js';

export default function Ingredients({
  Categories,
  selectedFilters,
  selectedIngredients,
  onToggleIngredient,
  clearIngredients,
  resetFilters,
  updateOrder,
  yourOrder,
  triggerNonnaWarning,
  scrollToRef
}) {

  // Example of hooks
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [fadeOut, setFadeOut] = useState(false);

  const handleAddToOrder = () => {
    const newDish = updateOrder();

    if (newDish) {
      setFadeOut(false);
      setConfirmationMessage(
        `Dish #${newDish.id} has been added to your order. You now have ${yourOrder.length + 1} items in your cart.`
      );

      setTimeout(() => setFadeOut(true), 2500);
      setTimeout(() => setConfirmationMessage(""), 3500);
    }

    clearIngredients();
    resetFilters && resetFilters();

    // allow React to finish re-rendering before scrolling
    setTimeout(() => {
      scrollToRef?.current?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }, 0);
  };

  return (
    // region landmark for screen readers
    <div
      className="card ingredientClass"
      role="region"
      aria-labelledby="ingredients-title"
    >
      <h2 id="ingredients-title" className="text-center">
        Choose Your Ingredients
      </h2>

      {Categories.map((Category) => (
        <div
          key={Category}
          className="categoryContainer"
          role="region"
          aria-label={`${Category} ingredients`}
        >
          <h3 className="categoryHeader text-center">{Category}</h3>

          <div className="ingredientButtons">
            {IngredientsData
              .filter((ingredient) => ingredient.category === categoryMap[Category])
              .map((ingredient) => {
                const disabled = selectedFilters.some((filter) => {
                  const property = filterMap[filter];
                  const isInverted = inversionList.includes(filter);
                  return isInverted
                    ? ingredient[property] === true
                    : ingredient[property] === false;
                });

                const isSelected = selectedIngredients.some(
                  (item) => item.name === ingredient.name
                );

                return (
                  <IngredientButton
                    key={ingredient.name}
                    ingredient={ingredient}
                    onToggleIngredient={onToggleIngredient}
                    isSelected={isSelected}
                    disabled={disabled}
                    triggerNonnaWarning={triggerNonnaWarning}
                  />
                );
              })}
          </div>
        </div>
      ))}

      <div className="ingredient-actions">
        <DishButton
          className="build-action-button"
          onClick={handleAddToOrder}
          disabled={selectedIngredients.length === 0}
        >
          Add to Order
        </DishButton>

        {/* Parent passing props to child */}
        <ClearIngredientsButton
          className="btn build-action-button"
          clearIngredients={clearIngredients}
          selectedIngredients={selectedIngredients}
        />
      </div>

      {confirmationMessage && (
        <div className={`confirmation-message ${fadeOut ? "fade-out" : ""}`}>
          {confirmationMessage}
        </div>
      )}
    </div>
  );
}