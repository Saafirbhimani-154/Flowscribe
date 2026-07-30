# Contributing to Flowscribe

First off, thank you for considering contributing to Flowscribe! It's people like you that make Flowscribe such a great tool for developers and designers.

## 1. Getting Started

### Prerequisites
- **Node.js** (v20+ recommended)
- **pnpm** (We use pnpm workspaces for managing our monorepo)
- **Docker & Docker Compose** (For running local PostgreSQL, Redis, and pgAdmin)

### Local Development Setup
1. **Fork and Clone:** Fork this repository and clone it to your local machine.
2. **Install Dependencies:**
   Run `pnpm install` in the root directory to install dependencies across the `frontend`, `backend`, and `middleware` workspaces.
3. **Environment Setup:**
   Copy the example environment files and fill them with your local credentials:
   - `cp .env.example .env.local`
   - `cp backend/.env.example backend/.env.local`
4. **Start the Infrastructure (Docker):**
   Run the following command to spin up the local database and redis instances:
   ```bash
   docker-compose -f docker-compose.local.yml up -d
   ```
5. **Start the Development Servers:**
   Run the frontend and backend development servers. (Currently managed per workspace, refer to `Commands.md` for specific execution scripts).

## 2. Branching Strategy

- **`main`:** Our primary production branch. Do not commit directly to `main`.
- **Feature Branches:** Create a new branch for every feature or bug fix.
  - Naming convention: `feature/your-feature-name` or `bugfix/your-bug-name`

## 3. Pull Request Guidelines

1. **Commit Messages:** Write clear, concise commit messages. If your commit fixes an issue, include the issue number (e.g., `Fixes #123`).
2. **CI Pipeline:** All Pull Requests must pass the `build` status checks.
   - The CI pipeline runs `pnpm --filter frontend run build` and `pnpm --filter backend exec tsc --noEmit`.
   - Ensure you have resolved any TypeScript compilation errors before requesting a review.
3. **Approvals:** Pull requests require at least one approval from a CODEOWNER before they can be merged.

## 4. Code Style & Architecture

- **TypeScript:** We strictly use TypeScript. Avoid `any` where possible and leverage interfaces/types.
- **Styling:** The frontend uses TailwindCSS and vanilla CSS (`App.css`). Stick to the defined design system (`docs/design.md`) focusing on Dark Mode First with Glassmorphism.
- **Backend Architecture:** Express.js + Prisma ORM.

## 5. Getting Help

If you're stuck or have a question about the architecture, feel free to open a Discussion on GitHub or reach out to the core maintainers.

Happy coding!
