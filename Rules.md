# Flowscribe Rules & Guidelines

- **Architecture:** Maintain the Domain-Driven structure in the backend (`src/app/api/`) and Feature-Sliced Design in the frontend (`src/features/`).
- **Validation:** All incoming API requests must be validated using Zod.
- **Environment:** Distinguish clearly between `.env.local` and `.env.production`.
- **Database:** All schema changes must be done via Prisma migrations.

## Memory & Documentation Logging
- **Memory Day Protocol:** The AI must update `docs/memory-day/DD-MM-YYYY.md` after every major prompting session to maintain a continuous, updated memory state.
- **Self-Tracking (Gemini):** The primary AI (Gemini 3.1 Pro Low) must log its own actions, updates, and architectural decisions in `docs/gemini.md` regularly to keep a trail of operations.

## Subagent Tracking Architecture
- **Agent Dispatching:** If the primary AI dispatches specialized subagents, it must meticulously document them in `docs/agents.md`.
- **Format Required:** Every dispatched agent must have:
  - Agent Name
  - AI Model Used (e.g., Claude, Gemini, ChatGPT)
  - Assigned Task (What it had to do)
  - Result (What it did)

## Skills Integration
- The AI may download or extract specific functional skills (e.g., SEO, WordPress) from the `AI docs/skills` repository if it determines a new capability is required.
- **Rule:** Do not delete experimental or temporary skills once tested; keeping them documented is acceptable as they provide isolated capabilities when summoned.
