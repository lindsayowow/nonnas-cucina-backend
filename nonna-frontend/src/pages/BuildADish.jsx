import React, { useRef } from 'react';
import '../styles/build-a-dish.css';

import NonnaReaction from '../components/NonnaReaction.jsx';
import Filters from '../components/Filters.jsx';
import Ingredients from '../components/Ingredients.jsx';
import Dish from '../components/Dish.jsx';

import useDishBuilderContext from "../hooks/useDishBuilderContext";
import useFilters from "../hooks/useFilters";
import useCategories from "../hooks/useCategories";
import useNonna from "../hooks/useNonna";

export default function BuildADish() {
  const {
    selectedFilters,
    selectedIngredients,
    totalPrice,
    showNonnaWarning,
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

  const { categories, loading: categoriesLoading } = useCategories();
  const { filters, loading: filtersLoading } = useFilters();
  const filtersRef = useRef(null);

  // Single shared Nonna AI hook instance for this page. NonnaReaction is
  // rendered twice below (desktop + mobile layouts, toggled via CSS), so
  // calling useNonna here -- once -- and passing the result down as props
  // keeps every milestone request to a single call instead of doubling it.
  const { nonnaState, nonnaMessage } = useNonna({
    selectedIngredients,
    showNonnaWarning
  });

  if (categoriesLoading) {
    return <p>Loading categories...</p>;
  }

  if (filtersLoading) {
  return <p>Loading filters...</p>;
}

  return (
    // main landmark for the Build a Dish page
    <main className="build-container" aria-label="Build a Dish page">

      {/* DESKTOP NONNA */}
      <div className="section-0 desktop-only" role="region" aria-label="Nonna reactions">
        <div className="nonna-container">
          <NonnaReaction nonnaState={nonnaState} nonnaMessage={nonnaMessage} />
        </div>
      </div>

      {/* FILTERS + INGREDIENTS */}
      <div className="section-1" role="region" aria-label="Filters and ingredients">
        <div ref={filtersRef}>
          <Filters
            DietaryFilters={filters}
            selectedFilters={selectedFilters}
            onToggleFilter={toggleFilter}
            clearFilter={clearFilter}
          />
        </div>

        <Ingredients
          selectedFilters={selectedFilters}
          selectedIngredients={selectedIngredients}
          Categories={categories}
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
          <NonnaReaction nonnaState={nonnaState} nonnaMessage={nonnaMessage} />
        </div>
      </div>

    </main>
  );
}
