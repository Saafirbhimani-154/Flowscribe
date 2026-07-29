FROM node:20-alpine AS builder

WORKDIR /app

# Copy package config
COPY package.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build Next.js
RUN npm run build

# Production image
FROM node:20-alpine AS runner

WORKDIR /app

# Copy production artifacts
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
# public folder is needed if Next.js serves static assets
COPY --from=builder /app/public ./public 

# Expose port (Next.js default or mapped)
EXPOSE 6000

# Start command
CMD ["npm", "start"]
