FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json ./

# Install dependencies
RUN npm install

# Copy source code and build
COPY . .
RUN npm run build

# Production server using Nginx
FROM nginx:alpine

# Copy built assets from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port (Vite default or custom)
EXPOSE 7000

# Copy custom nginx config if needed, otherwise use default
# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
