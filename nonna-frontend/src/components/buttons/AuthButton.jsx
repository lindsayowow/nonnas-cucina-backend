import React from "react";

export default function AuthButton({
  children,
  onClick,
  type = "button",
  disabled = false,
  ariaDisabled = false,
  loading = false
}) {
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      aria-disabled={ariaDisabled || loading}
      className="btn"
    >
      {loading ? "Please wait..." : children}
    </button>
  );
}
