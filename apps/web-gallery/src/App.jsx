import { useState, useEffect } from 'react';
import './App.css';
import { fetchImages } from './services/api';
import PhotoGrid from './components/PhotoGrid';
import PhotoModal from './components/PhotoModal';
import FilterBar from './components/FilterBar';

function App() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    try {
      setLoading(true);
      const data = await fetchImages();
      setImages(data);
      setError(null);
    } catch (err) {
      setError('Failed to load images. Please make sure the API server is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['All', ...new Set(images.map(img => img.category))];

  return (
    <div className="app">
      <header className="app-header">
        <h1>📸 PhotoGallery Demo</h1>
        <p>A monorepo microservice demo with React & Node.js</p>
      </header>

      {error && (
        <div className="error-banner">
          {error}
        </div>
      )}

      {loading ? (
        <div className="loading">Loading images...</div>
      ) : (
        <>
          <FilterBar 
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
          <PhotoGrid 
            images={images}
            selectedCategory={selectedCategory}
            onImageClick={setSelectedImage}
          />
        </>
      )}

      {selectedImage && (
        <PhotoModal 
          image={selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </div>
  );
}

export default App;

