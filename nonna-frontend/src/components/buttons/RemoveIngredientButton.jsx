import React from 'react';

export default function RemoveIngredientButton({ ingredient, onRemove }) {
  return (
    <button
      className="removeIngredientButton"
      // use of state to handle dynamic data
      onClick={() => onRemove(ingredient)}
      aria-label={`Remove ${ingredient.name}`}
    >
      <span aria-hidden="true">🗑️</span>
    </button>
  );
}
