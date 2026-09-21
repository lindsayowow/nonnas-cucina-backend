import React from 'react';

export default function IngredientButton({
  disabled,
  isSelected,
  onToggleIngredient,
  ingredient,
  triggerNonnaWarning
}) {
  // Disabled ingredients still respond to clicks -- they trigger Nonna's
  // warning animation instead of toggling selection
  const handleClick = () => {
    if (disabled) {
      triggerNonnaWarning && triggerNonnaWarning();
      return;
    }

    // Pass the full ingredient object including id
    onToggleIngredient(ingredient);
  };

  return (
    <button
      className={`btn IngredientButton ${disabled ? "is-disabled" : ""} ${isSelected ? "selected" : ""}`}
      onClick={handleClick}
      aria-pressed={isSelected}
      aria-disabled={disabled}
    >
      <span className="emoji" aria-hidden="true">{ingredient.emoji}</span>
      {ingredient.name}
    </button>
  );
}
