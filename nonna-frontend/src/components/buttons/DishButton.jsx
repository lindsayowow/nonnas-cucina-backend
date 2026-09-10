import React from 'react';

export default function DishButton({
  onClick,
  children,
  className = '',
  disabled = false
}) {
  return (
    <button
      type="button"
      className={`btn ${className}`.trim()}
      // example of event handler
      onClick={onClick}
      disabled={disabled}
      aria-disabled={disabled}
    >
      {children}
    </button>
  );
}