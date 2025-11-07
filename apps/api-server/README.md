# API Server

Express.js API server for the PhotoGallery app that serves image metadata and frontend static files.

## Features

- RESTful API for image metadata
- Serves frontend static files (SPA routing support)
- CORS enabled for development

## API Endpoints

- `GET /health` - Health check endpoint
- `GET /api/images` - Get all images
- `GET /api/images/:id` - Get a specific image by ID
- `GET /api/images/category/:category` - Get images by category
- `GET /*` - Serves frontend static files

## Local Development

```bash
npm install
npm run dev
```

Server runs on `http://localhost:8080`

## Production Build

In production (Docker), the server:
1. Serves API endpoints on `/api/*` and `/health`
2. Serves frontend static files from `/public` directory
3. Handles SPA routing (all non-API routes serve index.html)

## Docker

The application is built using a multi-stage Dockerfile at the project root:

```bash
# From project root
docker build -t photogallery-app .
docker run -p 8080:8080 photogallery-app
```

Access at `http://localhost:8080`
