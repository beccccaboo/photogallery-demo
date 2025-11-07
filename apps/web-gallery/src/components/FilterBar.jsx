import React from 'react';
import './FilterBar.css';

function FilterBar({ categories, selectedCategory, onCategoryChange }) {
  return (
    <div className="filter-bar">
      <h2>Filter by Category</h2>
      <div className="category-buttons">
        {categories.map(category => (
          <button
            key={category}
            className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => onCategoryChange(category)}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}

export default FilterBar;
