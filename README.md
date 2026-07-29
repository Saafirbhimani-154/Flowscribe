# Flowscribe

**From Messy Process Sketches to Validated System Design.**

## The Problem
Teams building real-world operational systems almost always start the same way: a hand-sketched flow across pages of notes, full of branches, exceptions, and edge cases, with no formal system design behind it. Without proper upfront modeling, these flows go straight into development, and the gaps only surface mid-build.

## The Solution
Flowscribe takes photos of a hand-drawn process flow and turns them into a validated, formally-modeled system blueprint. 
It generates the standard system-design diagram set (Activity, State Machine, Use Case, and Data Flow Diagrams), while auditing the original flow for logical gaps, contradictions, and missing edge cases.

## Tech Stack
- **Frontend:** React + Vite + TypeScript (Deployed on Cloudflare Pages)
- **Backend:** Hono.js + TypeScript (Deployed on Cloudflare Workers)
- **Database / ORM:** Prisma
- **Tooling:** pnpm workspaces, Docker Compose (for local dev), GitHub Actions (CI)

## Local Development
This project is configured as a monorepo using `pnpm` workspaces.

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Start the local environment:**
   Use Docker to spin up the frontend, backend, and Postgres database with hot-reloading:
   ```bash
   docker-compose -f docker-compose.local.yml up --build
   ```
