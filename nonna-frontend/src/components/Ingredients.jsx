import React, { useState } from 'react';
import '../styles/ingredients.css';

import IngredientButton from './buttons/IngredientButton.jsx';
import ClearIngredientsButton from './buttons/ClearIngredientsButton.jsx';
import DishButton from "./buttons/DishButton.jsx";

import useFilters from "../hooks/useFilters";
import useIngredients from "../hooks/useIngredients";

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

  const { ingredients, loading } = useIngredients();
  const { filters } = useFilters();

  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [fadeOut, setFadeOut] = useState(false);

  if (loading) {
    return <p>Loading ingredients...</p>;
  }

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

    setTimeout(() => {
      scrollToRef?.current?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }, 0);
  };

  return (
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
          key={Category.id}
          className="categoryContainer"
          role="region"
          aria-label={`${Category.categoryName} ingredients`}
        >
          <h3 className="categoryHeader text-center">
            {Category.categoryName}
          </h3>

          <div className="ingredientButtons">
            {ingredients
              .filter((ingredient) =>
                ingredient.categoryIds.includes(Category.id)
              )
              .map((ingredient) => {

                const disabled = selectedFilters.some((filterId) => {
                  const filterObj = filters.find(f => f.id === filterId);
                  if (!filterObj) return false;

                  const isAllergenExclusion = filterObj.excludesAllergen === 1;

                  return isAllergenExclusion
                    ? ingredient.filterIds.includes(filterObj.id)
                    : !ingredient.filterIds.includes(filterObj.id);
                });

                const isSelected = selectedIngredients.some(
                  (item) => item.name === ingredient.ingredientName
                );

                return (
                  <IngredientButton
                    key={ingredient.id}
                    ingredient={{
                      id: ingredient.id,                // ⭐ FIXED: include ID
                      name: ingredient.ingredientName,
                      price: ingredient.ingredientCost,
                      emoji: ingredient.emoji
                    }}
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
