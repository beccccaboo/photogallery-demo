# API Server

Express.js API server for the PhotoGallery app that serves image metadata.

## API Endpoints

- `GET /health` - Health check endpoint
- `GET /api/images` - Get all images
- `GET /api/images/:id` - Get a specific image by ID
- `GET /api/images/category/:category` - Get images by category

## Local Development

```bash
npm install
npm run dev
```

Server runs on `http://localhost:3001`

## Docker

Build and run the container:

```bash
docker build -t photogallery-api .
docker run -p 3001:3001 photogallery-api
```
