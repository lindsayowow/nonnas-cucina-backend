import React from 'react';

export default function OrderButton({ sendToKitchen, disabled }) {
  return (
    <button
      type="button"
      className="btn OrderButton"
      onClick={sendToKitchen}
      disabled={disabled}
      aria-disabled={disabled}
    >
      Send Order to Kitchen
    </button>
  );
}
