import { useState } from "react";

export default function useDishBuilder() {
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [yourOrder, setYourOrder] = useState([]);
  const [showNonnaWarning, setShowNonnaWarning] = useState(false);

  // Decode JWT and extract userId (sub)
  function getUserIdFromToken(token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.sub;  // numeric userId
    } catch (err) {
      console.error("Invalid token", err);
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

  // Add dish to order
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

  // Send order to backend
  async function sendToKitchen(token) {
    const userId = getUserIdFromToken(token);
console.log("ORDER DEBUG:", JSON.stringify(yourOrder, null, 2));

    if (!userId) {
      console.error("No valid userId found in token");
      return;
    }

    console.log("yourOrder:", yourOrder);
    console.log("TOKEN:", token);
    // above line is temporary for testing. 

    const orderDTO = {
      userId: userId,
      dishes: yourOrder.map(dish => ({
        dishCost: dish.totalCost,
        ingredients: dish.ingredients.map(i => i.id)
      }))
    };

    const response = await fetch("http://localhost:8080/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(orderDTO)
    });

    if (!response.ok) {
      console.error("Order failed:", response.status);
      return;
    }

    // Clear UI only after successful submission
    setYourOrder([]);
    setSelectedIngredients([]);
    setSelectedFilters([]);
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

  // Add dish and reset selections
  function addDishAndReset() {
    const newDish = updateOrder();
    clearIngredients();
    clearFilter();
    return newDish;
  }

  // Nonna warning animation
  function triggerNonnaWarning() {
    setShowNonnaWarning(true);
    setTimeout(() => {
      setShowNonnaWarning(false);
    }, 1200);
  }

  return {
    selectedFilters,
    selectedCategory,
    selectedIngredients,
    totalPrice,
    yourOrder,
    grandTotal,
    showNonnaWarning,

    toggleFilter,
    toggleIngredient,
    setSelectedCategory,
    setSelectedIngredients,
    setSelectedFilters,
    setYourOrder,

    updateOrder,
    sendToKitchen,
    clearFilter,
    clearIngredients,
    removeIngredient,
    removeDish,
    triggerNonnaWarning,
    setShowNonnaWarning,
    addDishAndReset,
    getUserIdFromToken
  };
}
