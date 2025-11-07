# Frontend build stage
FROM node:18 AS frontend-build
WORKDIR /app/apps/web-gallery
COPY ./apps/web-gallery/package*.json ./
RUN npm install
COPY ./apps/web-gallery .
RUN npm run build

# Backend build stage
FROM node:18 AS backend-build
WORKDIR /app/apps/api-server
COPY ./apps/api-server/package*.json ./
RUN npm ci --omit=dev
COPY ./apps/api-server .

# Final stage
FROM node:18-alpine
WORKDIR /app

# Copy backend files
COPY --from=backend-build /app/apps/api-server ./

# Copy frontend build to public folder
COPY --from=frontend-build /app/apps/web-gallery/dist ./public

# Expose port
EXPOSE 8080

# Start the server
CMD ["node", "src/index.js"]
