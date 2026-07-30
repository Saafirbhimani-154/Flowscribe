# Flowscribe

**From Messy Process Sketches to Validated System Design.**

## The Problem
Teams building real-world operational systems almost always start the same way: a hand-sketched flow across pages of notes, full of branches, exceptions, and edge cases, with no formal system design behind it. Without proper upfront modeling, these flows go straight into development, and the gaps only surface mid-build.

## The Solution
Flowscribe takes photos of a hand-drawn process flow and turns them into a validated, formally-modeled system blueprint. 
It generates the standard system-design diagram set (Activity, State Machine, Use Case, and Data Flow Diagrams), while auditing the original flow for logical gaps, contradictions, and missing edge cases.

## Tech Stack (3-Tier Architecture)
- **Frontend:** React + Vite + TypeScript + TailwindCSS + beautiful Skeleton Loaders for UX (Port 7000)
- **Middleware:** Next.js + TypeScript BFF (Port 6000)
- **Backend:** Node.js + Express + TypeScript (Port 5000)
- **Database / ORM:** PostgreSQL (Docker) + Prisma
- **Caching/Queueing:** Redis + BullMQ (for handling multiple users calling the LLM)
- **Real-Time UX:** Socket.io for streaming backend progress to the frontend
- **Authentication:** Standard Email/Password stored via HTTP-only Session Cookies (w/ unique Slug IDs).
- **Data Persistence:** Persistent raw image storage via Google Drive (auto-pruned at 30GB).
- **AI Engine:** OpenRouter for dynamic model routing (GPT/Claude/Gemini) to process multimodal inputs.
- **Features:** Strict image limits (max 5 images), Speech-to-Text (STT) for voice prompting, interactive Chatbot UI, and a one-click "Convert to README" export.
- **Tooling:** pnpm workspaces, Docker Compose (for local dev/deploy)

### Folder Architecture
```text
Flowscribe/
├── frontend/             # React + Vite (Port 7000)
│   ├── src/
│   │   ├── components/   # Reusable UI elements
│   │   ├── pages/        # Dashboard, Login, Landing Page
│   │   └── lib/          # Utilities & API clients
│   └── package.json
├── middleware/           # Next.js BFF (Port 6000)
│   ├── src/
│   └── package.json
├── backend/              # Node + Express (Port 5000)
│   ├── src/
│   │   ├── routes/       # API Endpoints
│   │   ├── controllers/  # Core logic
│   │   └── services/     # Integrations (OpenRouter, Google Drive)
│   ├── prisma/           # PostgreSQL Schema & Migrations
│   └── package.json
├── docs/                 # Documentation (PRD, BRD, Agent Scripts)
├── docker-compose.local.yml
├── pnpm-workspace.yaml
└── README.md
```

## Documentation
The core architecture and business logic have been fully defined by autonomous agents:
- **[Product Requirements Document (PRD)](./docs/PRD.md):** The complete product specification and feature set.
- **[Business Requirements Document (BRD)](./docs/business-rules.md):** The core business logic, operational constraints, and daily rate limits.

---

## How to Start (Local Development)

This project is configured as a highly-decoupled monorepo using `pnpm` workspaces. You have two ways to start the project locally:

### Option 1: Docker Compose (Recommended)
This method spins up the frontend, middleware, backend, and PostgreSQL database automatically in isolated containers.

1. **Install dependencies across the monorepo:**
   ```bash
   pnpm install
   ```
2. **Copy the Environment Variables:**
   Create `.env.local` at the root and `./backend/.env.local` using the provided `.env.example` templates.
3. **Spin up the stack:**
   ```bash
   docker-compose -f docker-compose.local.yml up -d --build
   ```
   *(Note: The backend container will automatically execute Prisma migrations on startup via the `run_migrations.ts` script).*

### Option 2: Native Node.js (Concurrent)
If you prefer to run the Node servers natively on your machine (you still need the Postgres database running):

1. Start just the database:
   ```bash
   docker-compose -f docker-compose.local.yml up -d db
   ```
2. Run the concurrent dev script from the root (starts Vite, Next.js, and Express simultaneously):
   ```bash
   pnpm run dev
   ```

---
See [Commands.md](./Commands.md) for a full cheat sheet of useful terminal commands for this project.
