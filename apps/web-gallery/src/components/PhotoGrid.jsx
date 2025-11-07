import React, { useMemo } from 'react';
import PhotoCard from './PhotoCard';
import './PhotoGrid.css';

function PhotoGrid({ images, onImageClick, selectedCategory }) {
  const filteredImages = useMemo(() => {
    return selectedCategory === 'All'
      ? images
      : images.filter(img => img.category === selectedCategory);
  }, [images, selectedCategory]);

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
