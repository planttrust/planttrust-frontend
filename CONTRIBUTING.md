# Contributing to planttrust-frontend

PlantTrust is built by five people, and each person owns one module. This guide covers setting up, the workflow for every task, and the team rules. The backend repo has the same guide with backend setup steps: [planttrust-backend/CONTRIBUTING.md](https://github.com/planttrust/planttrust-backend/blob/develop/CONTRIBUTING.md).

## Modules and owners

| Module | Owner | Components and API calls | Pages |
|---|---|---|---|
| M1 User Management & Corporate Registry | Nimsara | `src/modules/m1-users/` | `src/app/(m1)/` |
| M2 Investor Marketplace & Escrow | Thilina | `src/modules/m2-marketplace/` | `src/app/(m2)/` |
| M3 MCP AI & Scam Detection | Imesha | `src/modules/m3-mcp-ai/` | `src/app/(m3)/` |
| M4 Company Portal & Geofencing | Yasuri | `src/modules/m4-geofencing/` | `src/app/(m4)/` |
| M5 Blockchain Audit & Trust Index | Mirath | `src/modules/m5-audit/` | `src/app/(m5)/` |

`src/shared/` (the API client, auth context, and shared UI like Button, Field, Card and the layouts) is shared infrastructure. Changes to it go through the team leader.

## How the frontend is organised

- Pages in `src/app/(mX)/` stay thin and render components from `src/modules/mX-*/`. The `(mX)` route groups don't appear in the URL; they only keep each person's pages together.
- Call the backend only through the API client in `src/shared/`. It reads the backend URL from `NEXT_PUBLIC_API_URL`.
- Until a backend route exists, return mock data from your module's API file. When the route is ready, switch to the real call. The backend contract for each module is in `planttrust-backend/contracts/`.
- Follow the Figma designs and use the shared components instead of restyling your own.

## One-time setup

1. Install Git, Node.js 24 LTS, Docker Desktop and VS Code.
2. Accept the GitHub invitation to the `planttrust` organisation, and check you can open the ClickUp folder "PlantTrust Sprints".
3. Start the backend first (see the backend guide), then clone and start the frontend (PowerShell):

```powershell
git clone https://github.com/planttrust/planttrust-frontend
cd planttrust-frontend
Copy-Item .env.example .env.local
npm install
npm run dev
```

4. Check your work with `npm run lint` and `npm run build`. CI runs both.

## Workflow for every task

1. **Pick the task.** Open your sprint task in ClickUp and set it to **in progress**. Its ID is the last part of the URL: `https://app.clickup.com/t/z8q7hbv36c` → `z8q7hbv36c`.
2. **Branch from the latest `develop`**, with the ClickUp ID in the branch name. Use the same branch name as your backend work:

   ```powershell
   git checkout develop
   git pull
   git checkout -b feature/m2/s1-project-listing-CU-z8q7hbv36c
   ```

3. **Work only in your own folders:** `src/modules/mX-*/` and `src/app/(mX)/`.
4. **Commit and push often**, with the ClickUp ID in the message, e.g. `Add Explore projects page CU-z8q7hbv36c`.
5. **Open a pull request into `develop`:**
   - Title: `[S1·M2] Project listing CU-z8q7hbv36c`
   - Body: `Closes #3` (your GitHub issue number in this repo), so the issue closes when the PR merges.
6. **Review and merge.** One teammate approves, CI passes, and then you merge.

The `CU-…` ID makes your branch, commits and PR show up on the ClickUp task. When **both** your backend and frontend issues are closed, the ClickUp task is set to **complete** automatically (`.github/workflows/clickup-sync.yml`). Reopening an issue moves the task back to **in progress**.

## Team rules

- Never edit another person's module. If you need something from it, ask the owner.
- Never push directly to `main` or `develop`. The repository rules block it, and every change needs a PR with one approval.
- Review your teammates' PRs within a day, because everyone is blocked without an approval.
- Handle loading, empty and error states on every screen.
- Never commit `.env.local` files or API keys.

## End of each sprint

1. The backend PRs are merged first, in this order: M1 → M2 / M4 → M3 → M5. Then merge the frontend PRs against the new backend `develop`.
2. Run the combined demo described in the sprint's ClickUp tasks.
3. Merge `develop` → `main` in both repos, and tag both with the same tag (`s1`, `s2`, …).

## Sprint calendar

| | Dates |
|---|---|
| Week 0 (setup) | 18 – 22 Nov |
| Sprint 1 | 23 Nov – 6 Dec |
| Sprint 2 | 7 – 20 Dec |
| Sprint 3 | 21 Dec – 3 Jan |
| Sprint 4 | 4 – 17 Jan |
| Sprint 5 | 18 – 31 Jan (feature freeze 28 Jan) |

Plan and progress: [GitHub project board](https://github.com/orgs/planttrust/projects/1) · ClickUp folder "PlantTrust Sprints (23 Nov – 31 Jan)".
