FROM node:20-alpine AS builder

WORKDIR /app

# Copy package configuration
COPY package.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Generate Prisma Client
# Note: Prisma schema is located in src/database/schema.prisma
RUN npx prisma generate --schema=./src/database/schema.prisma

# Build TypeScript
RUN npm run build

FROM node:20-alpine AS runner

WORKDIR /app

# Only copy production dependencies and build artifacts
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/database ./src/database

EXPOSE 5000

# Start command
CMD ["npm", "start"]
