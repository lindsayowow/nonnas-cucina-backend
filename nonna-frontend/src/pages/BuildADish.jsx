import React, { useRef } from 'react';
import '../styles/build-a-dish.css';

import NonnaReaction from '../components/NonnaReaction.jsx';
import Filters from '../components/Filters.jsx';
import Ingredients from '../components/Ingredients.jsx';
import Dish from '../components/Dish.jsx';

import { DietaryFilters, Categories } from '../utils/constants.js';
import { useDishBuilderContext } from "../context/DishBuilderContext";

export default function BuildADish() {
  const {
    selectedFilters,
    selectedIngredients,
    totalPrice,
    toggleFilter,
    toggleIngredient,
    setSelectedCategory,
    updateOrder,
    clearFilter,
    clearIngredients,
    removeIngredient,
    yourOrder,
    triggerNonnaWarning,
    addDishAndReset
  } = useDishBuilderContext();

  const filtersRef = useRef(null);

  return (
    // main landmark for the Build a Dish page
    <main className="build-container" aria-label="Build a Dish page">

      {/* DESKTOP NONNA */}
      <div className="section-0 desktop-only" role="region" aria-label="Nonna reactions">
        <div className="nonna-container">
          <NonnaReaction />
        </div>
      </div>

      {/* FILTERS + INGREDIENTS */}
      <div className="section-1" role="region" aria-label="Filters and ingredients">
        <div ref={filtersRef}>
          <Filters
            DietaryFilters={DietaryFilters}
            selectedFilters={selectedFilters}
            onToggleFilter={toggleFilter}
            clearFilter={clearFilter}
          />
        </div>

        <Ingredients
          selectedFilters={selectedFilters}
          selectedIngredients={selectedIngredients}
          Categories={Categories}
          onSelectedCategory={setSelectedCategory}
          onToggleIngredient={toggleIngredient}
          clearIngredients={clearIngredients}
          updateOrder={updateOrder}
          triggerNonnaWarning={triggerNonnaWarning}
          resetFilters={clearFilter}
          yourOrder={yourOrder}
          scrollToRef={filtersRef}
        />
      </div>

      {/* DISH */}
      <div className="section-2" role="region" aria-label="Your dish and Nonna reactions">
        <div className="dish-container">
          <Dish
            selectedIngredients={selectedIngredients}
            totalPrice={totalPrice}
            updateOrder={updateOrder}
            removeIngredient={removeIngredient}
            yourOrder={yourOrder}
            addDishAAndReset={addDishAndReset}
          />
        </div>

        {/* MOBILE NONNA */}
        <div className="mobile-only mobile-nonna">
          <NonnaReaction />
        </div>
      </div>

    </main>
  );
}
