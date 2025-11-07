# Web Gallery

React web application for the PhotoGallery demo.

## Features

- Browse photo gallery with image cards
- Filter photos by category (Nature, Urban)
- View full-size images in a modal
- Responsive design for mobile and desktop

## Environment Variables

Create a `.env` file from `.env.example`:

```bash
cp .env.example .env
```

Configure the API URL (optional):
- `VITE_API_URL` - URL of the API server (default: empty string for same-origin requests)
  - For local dev with separate servers: `http://localhost:8080`
  - For production Docker: leave empty (served from same origin)

## Local Development

```bash
npm install
npm run dev
```

App runs on `http://localhost:3000`

When using Docker, the backend serves the built frontend, so both API and frontend are available on the same port.

## Build

```bash
npm run build
```

Outputs to `dist/` directory.

## Docker

The application is built using a multi-stage Dockerfile at the project root that combines frontend and backend:

```bash
# From project root
docker build -t photogallery-app .
docker run -p 8080:8080 photogallery-app
```

Access the complete application (frontend + API) at `http://localhost:8080`
