import React from 'react';
import '../styles/filters.css';
import FilterButton from './buttons/FilterButton.jsx';
import ClearFilterButton from './buttons/ClearFilterButton.jsx';

export default function Filters(props) {
  return (
    // region landmark for screen readers
    <div
      className="card filterClass"
      role="region"
      aria-labelledby="filters-title"
    >
      <h2 id="filters-title" className="text-center">Dietary Filters</h2>

      {/* Parent passing props to child */}
      <FilterButton
        DietaryFilters={props.DietaryFilters}
        selectedFilters={props.selectedFilters}
        onToggleFilter={props.onToggleFilter}
      />

      <ClearFilterButton
        clearFilter={props.clearFilter}
        selectedFilters={props.selectedFilters}
      />
    </div>
  );
}
