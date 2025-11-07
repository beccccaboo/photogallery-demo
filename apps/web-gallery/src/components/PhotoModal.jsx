import React from 'react';
import './PhotoModal.css';

function PhotoModal({ image, onClose }) {
  if (!image) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>&times;</button>
        <img src={image.url} alt={image.title} />
        <div className="modal-info">
          <h2>{image.title}</h2>
          <p className="description">{image.description}</p>
          <div className="metadata">
            <span className="category-badge">{image.category}</span>
            <span className="photographer">Photo by {image.photographer}</span>
            <span className="date">{new Date(image.uploadDate).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PhotoModal;
