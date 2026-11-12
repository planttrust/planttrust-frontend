# Contributing to PlanTrust

This document is the working agreement for the team: how branches, pull requests, contracts, mocking, and weekly integration actually happen. It exists so integration is a habit, not a single stressful event near the deadline.

## 1. Core principle: contract-first, loosely coupled

Modules communicate with each other **only through defined APIs** — never by one module reading another module's database tables directly. This is what allows a module to change its internal implementation later without breaking the other four. If Module 4 needs Module 2 to release escrow funds, it calls Module 2's release endpoint; it never writes to Module 2's `escrow_ledger` table itself.

## 2. Repository and branching structure

- **Two repositories:**
  - **`planttrust-backend`** — all backend modules (`src/module-1-user-management/`, `src/module-2-marketplace/`, etc.), unified Express server on port 3000, database schema, jobs, and XRPL client.
  - **`planttrust-frontend`** (this repo) — the Next.js frontend app with shared design system, contracts, and modular route pages.
- **`main`** — always stable and demo-ready. Protected: PR + review required, no direct pushes. Only updated from `develop` after a checkpoint's integration test has passed.
- **`develop`** — the shared weekly integration baseline. Protected: PR + at least one review required.
- **`feature/m<module>/s<sprint>-<short-name>`** — one branch per module piece in a sprint (e.g. `feature/m4/s1-project-registration`), branched from `develop`, created and owned by that module's owner.
- **`infra/<short-name>`** — shared infrastructure (architecture, CI, schema, shared utilities, releases), owned by the team leader.
- **`fix/<short-name>`** — bug fixes.

## 3. Opening a pull request

1. Branch from the latest `develop`.
2. Keep the PR scoped to one GitHub issue/ticket where possible.
3. Target `develop`, not `main`.
4. Tag the module owner most likely to be affected as reviewer (CODEOWNERS will often do this automatically).
5. Don't merge your own PR without at least one review.
6. **Each module owner opens the PRs for their own module**, and fills in *Sprint*, *System feature* and *ClickUp tasks* in the template. Infrastructure PRs are opened by the team leader.
7. Teammates review each other's PRs. If anyone else writes a substantial part of a change, credit them with a `Co-authored-by: Name <email>` trailer.

## 4. Define interfaces before writing code (API contracts)

Before implementation starts on any module, its owner writes a short interface spec listing every endpoint the module exposes to the others: method, path, request body, and response body. These specs live in `contracts/` and are reviewed by any module that depends on them before code is written.

**Example:** Module 2's owner commits `contracts/module-2-marketplace.md` describing `POST /api/escrow/fund` before writing the escrow logic, so Module 4's owner (who calls it for profit distribution) can start against a known shape immediately.

### The actual contracts between the five modules

| Caller | Provider | Endpoint | Purpose |
|---|---|---|---|
| Frontend / M2 | Module 1 | `GET /api/certificates/:id/verify` | Public lookup confirming a company's certificate is genuinely anchored on-chain |
| M1, M2, M3, M4 | Module 5 | `POST /api/audit/anchor` | Hash and anchor an event on XRPL Testnet |
| M2 (Fund Project) | Module 5 | `POST /api/audit/mint` | Trigger NFT minting with Investor ID, Project ID, Stake Amount, Escrow ref |
| M4 (report approved) | Module 2 | `POST /api/escrow/release` | Release escrow funds after a progress report passes geofence + AI checks |
| M2 / Frontend | Module 5 | `GET /api/audit/verify/:hash` | Confirm a given hash is actually anchored on XRPL Testnet |
| Frontend (dashboard) | Module 5 | `GET /api/trust-index/:companyId` | Fetch the aggregated Trust Index score for display |

Module 5 is the provider in almost every row — it is the shared "anchor to blockchain" service every other module calls, which is why its contract needs to be finalized first, in week 1.

## 5. Mocking modules that aren't finished yet

A module should **never sit idle** waiting for another module to finish. If Module 5 needs Module 1's certificate-issuance event before it exists, Module 5's owner builds against a small mock service (hardcoded JSON responses, or a mock server like Postman) that mimics the agreed contract from Section 4. When the real endpoint is ready, the mock is swapped for the real call with no other code changes.

### Who mocks whom, and until when

| Module | Depends on | What it needs | Mock until |
|---|---|---|---|
| Module 2 | Module 1 | A valid, verified Investor/Company ID | M1's real auth API lands (CP 1, ~week 2) — use a hardcoded test user ID |
| Module 4 | Module 1 | A verified Company session for project registration | M1's auth API lands (~week 2) |
| Module 4 | Module 2 | A working `/api/escrow/release` endpoint | M2's LOCKED→RELEASED endpoint lands (CP 5, ~week 9) — mock returns fixed success |
| M1, M2, M3, M4 | Module 5 | A working `/api/audit/anchor` endpoint | M5's stub logging function lands (CP 1, ~week 2); real XRPL anchoring stays mocked until CP 2 |
| Module 5 | Modules 1–4 | Real events to hash and aggregate | Builds against fake sample payloads until each module's real event exists |
| Module 3 | Module 4 | Real contract/project data to flag risk on | M4's project registration is live (~week 5–6); M3 unit-tests standalone before then |

### The rule for deciding what to mock, in one line

> If your module needs something from another module that isn't built yet, open a short issue describing the exact request/response shape you need (matching the contract format), get a quick thumbs-up from that module's owner that it matches what they intend to build, then build against a hardcoded or stubbed version of it. When the real endpoint lands, you only change the URL you're calling — nothing else — because the shape was agreed in advance.

## 6. One shared environment everyone can run locally

Clone both repos side-by-side:

```
parent-dir/
├── planttrust-backend/     # Backend repo
└── planttrust-frontend/    # This repo (frontend)
```

Then use Docker Compose (`docker-compose up` from the backend repo root) to bring up the entire system — all five backend modules plus the frontend — on any member's machine. Without this, "it works on my machine" failures only surface at the weekly integration meeting instead of before it.

## 7. Sprint workflow: build in your module, combine into one system feature

The project runs in **five 2-week sprints** (16 Nov 2026 – 24 Jan 2027). Each sprint has **one system feature** as its goal. All five owners build **their own module's piece** of it in parallel, and at the end of the sprint the pieces are joined so the system can do one new thing end to end.

| Sprint | Dates | System feature |
|---|---|---|
| 1 | 16–29 Nov | A company joins and lists a project |
| 2 | 30 Nov – 13 Dec | An investor funds a verified project |
| 3 | 14–27 Dec | Progress is verified and money is released |
| 4 | 28 Dec – 10 Jan | Everything is proven on-chain |
| 5 | 11–24 Jan | Polish and full end-to-end demo |

Which ClickUp tasks belong to each sprint is tracked with tags `sprint-1` … `sprint-5`; the full breakdown is in the team plan on Drive.

1. **Day 1: contracts** — Owners agree the API shapes between their pieces in `contracts/`.
2. **Days 2–11: build** — Each owner builds their piece on `feature/m<N>/s<sprint>-...` and opens their own PR into `develop`. Mock anything another module hasn't built yet (Section 5).
3. **Days 12–13: integrate** — Merge the five PRs into `develop` in dependency order (M1 first, M5 last), swap mocks for real calls, resolve conflicts together.
4. **Day 14: demo** — Run the sprint's system feature end to end. The team leader merges `develop` → `main`; ClickUp tasks move to *complete*.

**Definition of done (per piece):** backend endpoint with tests, frontend screen wired to it, contract doc updated, merged into `develop` and working in the combined demo.

## 8. Mocks within a sprint

Pieces in the same sprint are built in parallel, so a piece will often need an endpoint that another owner is building at the same time. Use the rule in Section 5: agree the shape on Day 1, build against a stub, and switch to the real call during integration.

## 9. Automated integration checks (CI)

A GitHub Actions workflow runs on every PR into `develop`: it brings up docker-compose, runs each module's test suite, and runs the smoke test for that checkpoint's target feature. See `.github/workflows/ci.yml`.

## 10. Commit messages

Keep them specific enough that "who did what" is legible from `git log` alone — this is part of how individual contribution gets evidenced to the panel. Prefer `module-2: implement escrow COMMITTED state transition` over `fix stuff`.
