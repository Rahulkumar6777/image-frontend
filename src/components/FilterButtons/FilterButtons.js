// src/components/FilterButtons/FilterButtons.js
import React from 'react';
import './FilterButtons.css'

function FilterButtons({ categories, activeCategory, onFilterSelect }) {
  return (
    <div className="filter-buttons">
      <button
        className={`filter-button ${activeCategory === '' ? 'active' : ''}`}
        onClick={() => onFilterSelect('')}
      >
        All
      </button>
      {categories.map((category) => (
        <button
          key={category}
          className={`filter-button ${activeCategory === category ? 'active' : ''}`}
          onClick={() => onFilterSelect(category)}
        >
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </button>
      ))}
    </div>
  );
}

export default FilterButtons;
