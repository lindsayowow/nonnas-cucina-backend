import React from 'react';

export default function RemoveDishButton({ onRemoveDish = () => { } }) {
  return (
    <button
      className="removeDishButton"
      // use of state to handle dynamic data
      onClick={onRemoveDish}
      aria-label="Remove this dish from your order"
      title="Remove dish"
      type="button"
    >
      <span aria-hidden="true">🗑️</span>
    </button>
  );
}
