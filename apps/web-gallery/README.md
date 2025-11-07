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

Configure the API URL:
- `VITE_API_URL` - URL of the API server (default: http://localhost:3001)

## Local Development

```bash
npm install
npm run dev
```

App runs on `http://localhost:3000`

## Build

```bash
npm run build
```

## Docker

Build and run the container:

```bash
docker build -t photogallery-web .
docker run -p 80:80 photogallery-web
```

Access at `http://localhost`

