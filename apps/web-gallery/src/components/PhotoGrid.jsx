import React from 'react';
import PhotoCard from './PhotoCard';
import './PhotoGrid.css';

function PhotoGrid({ images, onImageClick, selectedCategory }) {
  const filteredImages = selectedCategory === 'All'
    ? images
    : images.filter(img => img.category === selectedCategory);

  return (
    <div className="photo-grid">
      {filteredImages.length === 0 ? (
        <p className="no-images">No images found</p>
      ) : (
        filteredImages.map(image => (
          <PhotoCard 
            key={image.id} 
            image={image} 
            onClick={onImageClick}
          />
        ))
      )}
    </div>
  );
}

export default PhotoGrid;
