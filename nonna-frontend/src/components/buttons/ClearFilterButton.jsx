import React from 'react';

export default function ClearFilterButton({ clearFilter, selectedFilters }) {
  return (
    <div className="clearButtons">
      <button
        className="clearButton"
        // example of event handler
        onClick={clearFilter}
        disabled={selectedFilters.length === 0}
      >
        Clear All Filters
      </button>
    </div>
  );
}
