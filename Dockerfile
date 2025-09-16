# Multi-stage build for frontend and backend
FROM node:18-alpine AS frontend-builder

# Build frontend
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ .
RUN npm run build

# Build backend
FROM node:18-alpine AS backend-builder
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci
COPY backend/ .
RUN npm run build

# Production stage
FROM node:18-alpine
WORKDIR /app

# Copy frontend build
COPY --from=frontend-builder /app/frontend/.next ./frontend/.next
COPY --from=frontend-builder /app/frontend/package*.json ./frontend/
COPY --from=frontend-builder /app/frontend/public ./frontend/public

# Copy backend build
COPY --from=backend-builder /app/backend/dist ./backend/dist
COPY --from=backend-builder /app/backend/package*.json ./backend/
COPY --from=backend-builder /app/backend/src/views ./backend/src/views
COPY --from=backend-builder /app/backend/src/db/schema.sql ./backend/src/db/

# Install production dependencies for both
WORKDIR /app/frontend
RUN npm ci --only=production

WORKDIR /app/backend
RUN npm ci --only=production

# Expose ports
EXPOSE 3000 5003

# Start both applications
CMD ["sh", "-c", "cd /app/backend && npm start & cd /app/frontend && npm start"]