import React from 'react';
import './PhotoCard.css';

function PhotoCard({ image, onClick }) {
  return (
    <div className="photo-card" onClick={() => onClick(image)}>
      <div className="photo-card-image-container">
        <img 
          src={image.thumbnail} 
          alt={image.title}
          loading="lazy"
        />
      </div>
      <div className="photo-card-info">
        <h3>{image.title}</h3>
        <p className="category">{image.category}</p>
        <p className="photographer">by {image.photographer}</p>
      </div>
    </div>
  );
}

export default PhotoCard;
