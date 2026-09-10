import React from 'react';

export default function ClearIngredientsButton({
  clearIngredients,
  selectedIngredients,
  className = ''
}) {
  return (
    <button
      className={className}
      // Event handler example
      onClick={clearIngredients}
      //example of use of state to manage dynamic data
      disabled={selectedIngredients.length === 0}
    >
      Clear All Ingredients
    </button>
  );
}
