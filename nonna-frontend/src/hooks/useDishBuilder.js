// src/hooks/useDishBuilder.js
import { useState } from "react";

export default function useDishBuilder() {
  // Core dish-building state
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [yourOrder, setYourOrder] = useState([]);
  const [showNonnaWarning, setShowNonnaWarning] = useState(false);

  // Decode JWT and extract userId (sub). Used internally by sendToKitchen,
  // and also exposed below since several pages/components (Profile,
  // SideBarNav, PastOrders, Favorites) need the same decode logic --
  // previously each had its own duplicate copy of this function.
  function getUserIdFromToken(token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return Number(payload.sub);  // numeric userId
    } catch {
      // Malformed/invalid token -- caller treats null as "no user"
      return null;
    }
  }

  // Toggle ingredient filters
  function toggleFilter(filter) {
    setSelectedFilters(prev =>
      prev.includes(filter)
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  }

  // Toggle ingredient selection
  function toggleIngredient(ingredient) {
    setSelectedIngredients(prev =>
      prev.some(item => item.name === ingredient.name)
        ? prev.filter(item => item.name !== ingredient.name)
        : [...prev, ingredient]
    );
  }

  // Calculate dish price
  const totalPrice = selectedIngredients.reduce(
    (sum, ingredient) => sum + (ingredient.price || 0),
    0
  );

  // Add dish to order -- also clears the current ingredient/filter
  // selection, so no separate "add and reset" step is needed
  function updateOrder() {
    const newDish = {
      ingredients: selectedIngredients,
      totalCost: totalPrice
    };

    setYourOrder(prev => [...prev, newDish]);
    setSelectedIngredients([]);
    setSelectedFilters([]);
    return newDish;
  }

  // Calculate total order cost
  const total = yourOrder.reduce((sum, item) => {
    return sum + (item.totalCost || 0);
  }, 0);

  const grandTotal = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(total);

  // Clear entire order (for cart reset)
  function clearOrder() {
    setYourOrder([]);
    setSelectedIngredients([]);
    setSelectedFilters([]);
  }

  // Send order to backend. Returns true on success, false on any failure
  // (invalid token, network error, or non-OK response) -- caller (Order.jsx)
  // surfaces failure to the user via UI state.
  async function sendToKitchen(token) {
    const userId = getUserIdFromToken(token);

    if (!userId) {
      return false;
    }

    const orderDTO = {
      userId: userId,
      dishes: yourOrder.map(dish => ({
        dishCost: dish.totalCost,
        ingredients: dish.ingredients.map(i => i.id)
      }))
    };

    const response = await fetch("http://localhost:8080/pastorders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(orderDTO)
    });

    if (!response.ok) {
      return false;
    }

    // Clear UI only after successful submission
    clearOrder();
    return true;
  }

  // Clear filters
  function clearFilter() {
    setSelectedFilters([]);
  }

  // Clear ingredients
  function clearIngredients() {
    setSelectedIngredients([]);
  }

  // Remove ingredient
  function removeIngredient(ingredient) {
    setSelectedIngredients(prev =>
      prev.filter(item => item.name !== ingredient.name)
    );
  }

  // Remove dish
  function removeDish(dish) {
    setYourOrder(prev => prev.filter(item => item !== dish));
  }

  // Nonna warning animation
  function triggerNonnaWarning() {
    setShowNonnaWarning(true);
    setTimeout(() => {
      setShowNonnaWarning(false);
    }, 1200);
  }

  return {
    // State
    selectedFilters,
    selectedIngredients,
    totalPrice,
    yourOrder,
    grandTotal,
    showNonnaWarning,

    // Toggle/mutate actions
    toggleFilter,
    toggleIngredient,
    updateOrder,
    sendToKitchen,
    clearOrder,
    clearFilter,
    clearIngredients,
    removeIngredient,
    removeDish,
    triggerNonnaWarning,
    setShowNonnaWarning,
    getUserIdFromToken
  };
}