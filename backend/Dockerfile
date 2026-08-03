FROM node:20-slim AS builder

WORKDIR /app

# Install openssl for Prisma
RUN apt-get update -y && apt-get install -y openssl

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

FROM node:20-slim AS runner

WORKDIR /app

# Install openssl for Prisma
RUN apt-get update -y && apt-get install -y openssl

# Only copy production dependencies and build artifacts
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/database ./src/database
# FlowsService.loadSkill() resolves skill prompts relative to its own
# compiled location (dist/app/api/flows -> ../../../skills), so the
# runtime skills folder must live at dist/skills, not src/skills.
COPY --from=builder /app/src/skills ./dist/skills

EXPOSE 5000

# Start command
CMD ["npm", "start"]
