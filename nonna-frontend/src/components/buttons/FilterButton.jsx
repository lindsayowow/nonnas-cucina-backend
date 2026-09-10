import React from 'react';

export default function FilterButton({
  DietaryFilters,
  selectedFilters,
  onToggleFilter
}) {
  return (
    <div className="filterButtons">
      {DietaryFilters.map((filter) => {
        const isActive = selectedFilters.includes(filter);

        return (
          <button
            key={filter}
            // Example of event handler
            onClick={() => onToggleFilter(filter)}
            className={`btn FilterButton ${isActive ? "active" : ""}`}
            aria-pressed={isActive}
          >
            {filter}
          </button>
        );
      })}
    </div>
  );
}
