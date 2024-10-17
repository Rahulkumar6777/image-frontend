import React from 'react';
import './FilterButtons.css';

function FilterButtons({ categories, activeCategory, onFilterSelect, onCategoryChange }) {
  const handleCategoryClick = (category) => {
    if (onCategoryChange) {
      // Call the new prop to handle category change
      onCategoryChange(category);
    } else {
      // Fallback to the existing filter selection
      onFilterSelect(category);
    }
  };

  return (
    <div className="filter-buttons">
      <button
        className={`filter-button ${activeCategory === '' ? 'active' : ''}`}
        onClick={() => onFilterSelect('')} // Keeps 'All' button functionality
      >
        All
      </button>
      {categories.map((category) => (
        <button
          key={category}
          className={`filter-button ${activeCategory === category ? 'active' : ''}`}
          onClick={() => handleCategoryClick(category)} // Use the new handler here
        >
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </button>
      ))}
    </div>
  );
}

export default FilterButtons;
