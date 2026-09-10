import { useState } from "react";

export default function useDishBuilder() {
  // Example of use of hooks
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [yourOrder, setYourOrder] = useState([]);
  const [showNonnaWarning, setShowNonnaWarning] = useState(false);
  // const [nonnaWarning, setNonnaWarning] = useState(false); // future use

  // Adds or removes filter from array
  function toggleFilter(filter) {
    setSelectedFilters(prev =>
      prev.includes(filter)
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  }

  // Adds or removes ingredient from array
  function toggleIngredient(ingredient) {
    setSelectedIngredients(prev =>
      prev.some(item => item.name === ingredient.name)
        ? prev.filter(item => item.name !== ingredient.name)
        : [...prev, ingredient]
    );
  }

  // adds the total cost of one dish
  const totalPrice = selectedIngredients.reduce(
    (sum, ingredient) => sum + (ingredient.price || 0),
    0
  );

  // gives the dish name a number for the order page
  function getNextDishId() {
    if (yourOrder.length === 0) return 1;
    return yourOrder[yourOrder.length - 1].id + 1;
  }

  // creates the dish object to display in order screen and pass props
  function updateOrder() {
    const newDish = {
      id: getNextDishId(),
      ingredients: selectedIngredients,
      totalCost: totalPrice
    };


    setYourOrder(prev => [...prev, newDish]);
    setSelectedIngredients([]);
    setSelectedFilters([]);
    return newDish;
  }

  // adds total cost of the order - all the dishes
  const total = yourOrder.reduce((sum, item) => {
    return sum + (item.totalCost || 0);
  }, 0);

  // currency formatting
  const grandTotal = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(total);

  // when order is sent to kitchen all arrays reset
  function sendToKitchen() {
    setYourOrder([]);
    setSelectedIngredients([]);
    setSelectedFilters([]);
  }

  // resets only filters
  function clearFilter() {
    setSelectedFilters([]);
  }

  // resets only ingredients
  function clearIngredients() {
    setSelectedIngredients([]);
  }

  // removes one ingredient from the array
  function removeIngredient(ingredient) {
    setSelectedIngredients(prev =>
      prev.filter(item => item.name !== ingredient.name)
    );
  }

  // removes one dish from the array
  function removeDish(dish) {
    setYourOrder(prev =>
      prev.filter(item => item.id !== dish.id)
    );
  }

  // when a dish is added to Order, it updates the order array and clears ingredients and filter
  function addDishAndReset() {
    const newDish = updateOrder();
    clearIngredients();
    clearFilter();
    return newDish;
  }

  // timeout on nonna warning message
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
    // nonnaWarning, // future use
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
    addDishAndReset
  };
}
