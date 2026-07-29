# Flowscribe - Terminal Commands Cheat Sheet

This document contains the most frequently used commands for developing, testing, and deploying Flowscribe.

## Package Management (pnpm workspaces)

**Install all dependencies across the monorepo:**
```bash
pnpm install
```

**Add a package to a specific workspace (e.g., frontend):**
```bash
pnpm --filter frontend add <package-name>
```

**Run a script in a specific workspace:**
```bash
pnpm --filter backend run build
```

## Local Development (Docker)

**Start the entire local environment (detached mode):**
```bash
docker-compose -f docker-compose.local.yml up -d --build
```

**Stop the local environment:**
```bash
docker-compose -f docker-compose.local.yml down
```

**View logs for all services in real-time:**
```bash
docker-compose -f docker-compose.local.yml logs -f
```

**View logs for a specific service (e.g., backend):**
```bash
docker-compose -f docker-compose.local.yml logs -f backend
```

## Local Development (Native Node.js)

**Start all 3 Node servers concurrently (Requires Postgres to be running):**
```bash
pnpm run dev
```

## Database (Prisma)

*(Note: These commands should be run inside the `backend` directory, or using `--filter backend`)*

**Generate Prisma Client (after modifying `schema.prisma`):**
```bash
pnpm --filter backend exec prisma generate --schema=./src/database/schema.prisma
```

**Create a new migration and apply it to the database:**
```bash
pnpm --filter backend exec prisma migrate dev --name <migration-name> --schema=./src/database/schema.prisma
```

**Open Prisma Studio (Local Database GUI):**
```bash
pnpm --filter backend exec prisma studio --schema=./src/database/schema.prisma
```

## Production Deployment

**Start the production environment:**
```bash
docker-compose -f docker-compose.deploy.yml up -d --build
```
