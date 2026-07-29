# PR Check Pipeline (Currently Disabled)

This document explains the CI (Continuous Integration) pipeline for Flowscribe. 

## Current Status
**DISABLED.** To optimize for rapid hackathon iteration, the automated GitHub Actions pipeline has been paused. The execution file was renamed from `pr-check.yml` to `pr-check.yml.disabled` to prevent it from running on every commit.

## What Does It Do?
When enabled, this pipeline runs automatically whenever someone opens a Pull Request to the `main` branch. It ensures code quality by checking:
1. **Frontend:** Runs Vite build and TypeScript compiler (`tsc`) to catch UI errors.
2. **Middleware:** Runs Next.js build to catch BFF/API routing errors.
3. **Backend:** Runs TypeScript compiler to catch core engine errors.

## How to Re-Enable
When the hackathon is over and you want to enforce strict checks for production:
1. Navigate to `.github/workflows/`
2. Rename `pr-check.yml.disabled` back to `pr-check.yml`
3. Commit the change. GitHub Actions will automatically resume checking all future PRs.
