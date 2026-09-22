import { useState } from "react";

// Example of hooks
export default function useDishBuilder() {
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [yourOrder, setYourOrder] = useState([]);
  const [showNonnaWarning, setShowNonnaWarning] = useState(false);

  // extract userId from token. Used by sendToKitchen, Profile, SideBarNav, PastOrders, Favorites
  function getUserIdFromToken(token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return Number(payload.sub);  // numeric userId
    } catch {
      // invalid token - treats null as "no user"
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

  // Add dish to order. clears the current ingredients & filters
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

  // Clear entire order (cart reset)
  function clearOrder() {
    setYourOrder([]);
    setSelectedIngredients([]);
    setSelectedFilters([]);
  }

  // Send order to backend. Returns true on success, false on any failure
  // message to the user via state.
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

    // Clear screen after successful submission
    clearOrder();
    return true;
  }

  function clearFilter() {
    setSelectedFilters([]);
  }

  function clearIngredients() {
    setSelectedIngredients([]);
  }

  function removeIngredient(ingredient) {
    setSelectedIngredients(prev =>
      prev.filter(item => item.name !== ingredient.name)
    );
  }

  function removeDish(dish) {
    setYourOrder(prev => prev.filter(item => item !== dish));
  }

  function triggerNonnaWarning() {
    setShowNonnaWarning(true);
    setTimeout(() => {
      setShowNonnaWarning(false);
    }, 1200);
  }

  return {
    selectedFilters,
    selectedIngredients,
    totalPrice,
    yourOrder,
    grandTotal,
    showNonnaWarning,
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
