import React from 'react';

export default function FilterButton({
  DietaryFilters,
  selectedFilters,
  onToggleFilter
}) {
  return (
    <div className="filterButtons">
      {DietaryFilters.map((filter) => {
        // filter.id is the unique identifier
        const isActive = selectedFilters.includes(filter.id);

        return (
          <button
            key={filter.id}
            onClick={() => onToggleFilter(filter.id)}   // toggle by ID
            className={`btn FilterButton ${isActive ? "active" : ""}`}
            aria-pressed={isActive}
          >
            {filter.filterLabel}   {/* show readable label */}
          </button>
        );
      })}
    </div>
  );
}
