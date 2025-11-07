const express = require('express');
const cors = require('cors');
const path = require('path');
const imageData = require('../data/images.json');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'PhotoGallery API' });
});

// API endpoints
// Get all images
app.get('/api/images', (req, res) => {
  res.json(imageData);
});

// Get single image by ID
app.get('/api/images/:id', (req, res) => {
  const image = imageData.images.find(img => img.id === parseInt(req.params.id));
  if (image) {
    res.json(image);
  } else {
    res.status(404).json({ error: 'Image not found' });
  }
});

// Get images by category
app.get('/api/images/category/:category', (req, res) => {
  const filtered = imageData.images.filter(img => 
    img.category.toLowerCase() === req.params.category.toLowerCase()
  );
  res.json({ images: filtered });
});

// Serve static files from the public directory (frontend build)
app.use(express.static(path.join(__dirname, '../public')));

// Serve index.html for all other routes (SPA support)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(PORT, () => {
  console.log(`PhotoGallery API server running on port ${PORT}`);
});
