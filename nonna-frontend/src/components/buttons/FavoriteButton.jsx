import React from "react";

export default function FavoriteButton({ orderId, dish, toggleFavorite }) {
  return (
    <button
      className="favorite-btn"
      onClick={() => toggleFavorite(orderId, dish.id)}
      aria-label={dish.isFavorite ? "Unfavorite dish" : "Favorite dish"}
      title={dish.isFavorite ? "Unfavorite" : "Favorite"}
      type="button"
    >
      {dish.isFavorite ? "❤️" : "♡"}
    </button>
  );
}
