# Stage 1: Build React + Vite app
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package requirements
COPY package*.json ./

# Install dependencies using clean install
RUN npm ci

# Copy the rest of the source code
COPY . .

# Build the production bundle
RUN npm run build

# Stage 2: Serve using Nginx
FROM nginx:alpine

# Copy built frontend assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx server configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose HTTP port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
