import React from 'react';

export default function IngredientButton({
  disabled,
  isSelected,
  onToggleIngredient,
  ingredient,
  triggerNonnaWarning
}) {
  const handleClick = () => {
    if (disabled) {
      triggerNonnaWarning && triggerNonnaWarning();
      return;
    }

    onToggleIngredient(ingredient);
  };

  return (
    <button
      className={`btn IngredientButton 
        ${disabled ? "is-disabled" : ""} 
        ${isSelected ? "selected" : ""}`}
        // Example of user interaction causing update to state - selectedIngredients updates
      onClick={handleClick}
      aria-pressed={isSelected} /*accessibility feature for screen readers*/
      aria-disabled={disabled}
    >
      <span className="emoji" aria-hidden="true">{ingredient.emoji}</span> {ingredient.name}
    </button>
  );
}
