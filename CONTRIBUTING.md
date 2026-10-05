# Contributing to PlanTrust

This document is the working agreement for the team: how branches, pull requests, contracts, mocking, and weekly integration actually happen. It exists so integration is a habit, not a single stressful event near the deadline.

## 1. Core principle: contract-first, loosely coupled

Modules communicate with each other **only through defined APIs** — never by one module reading another module's database tables directly. This is what allows a module to change its internal implementation later without breaking the other four. If Module 4 needs Module 2 to release escrow funds, it calls Module 2's release endpoint; it never writes to Module 2's `escrow_ledger` table itself.

## 2. Repository and branching structure

- **Two repositories:**
  - **`planttrust-frontend`** (this repo) — all backend modules (`module-1-user-management/`, `module-2-marketplace/`, etc.), plus `shared/` for common backend code (XRPL client, auth middleware, DB connection).
  - **`planttrust-frontend`** — the Next.js frontend app, with one route per module.
- **`main`** — always stable and demo-ready. Protected: PR + review required, no direct pushes. Only updated from `develop` after a checkpoint's integration test has passed.
- **`develop`** — the shared weekly integration baseline. Protected: PR + at least one review required.
- **`feature/<module>/<short-ticket-name>`** — one branch per GitHub issue, branched from `develop`, merged back into `develop` via PR.

## 3. Opening a pull request

1. Branch from the latest `develop`.
2. Keep the PR scoped to one GitHub issue/ticket where possible.
3. Target `develop`, not `main`.
4. Tag the module owner most likely to be affected as reviewer (CODEOWNERS will often do this automatically).
5. Don't merge your own PR without at least one review.

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
├── planttrust-frontend/     # This repo (backend)
└── planttrust-frontend/    # Frontend repo
```

Then use Docker Compose (`docker-compose up` from the backend repo root) to bring up the entire system — all five backend modules plus the frontend — on any member's machine. Without this, "it works on my machine" failures only surface at the weekly integration meeting instead of before it.

## 7. Weekly integration ritual

This is the fixed weekly process tied to the checkpoint schedule:

1. **Freeze and pull** — Each member finishes their week's tickets, pushes to their feature branch, and opens a PR against `develop`. No new feature work starts until integration is done.
2. **Merge in dependency order** — Module 1 first (others depend on it), then Modules 2 and 4 in parallel, then Module 3, then Module 5 last (it consumes everyone else's output).
3. **Pair on conflicts live** — Whoever owns each side of a merge conflict resolves it together on a short call, rather than one person guessing the other's intent.
4. **Run that week's smoke test** — Actually execute the checkpoint's target feature end-to-end against the merged `develop` branch.
5. **Demo to the team** — Whoever's module was central to that week's integration walks the others through it live.
6. **Log tickets and flag blockers** — Update the GitHub issue tracker; flag anything under ~50% complete immediately, don't wait.
7. **Re-baseline** — Once verified, `develop` is the new starting point for next week's tickets.

## 8. Worked example: Checkpoints 1–2

### Checkpoint 1 (Weeks 1–2)

- **Module 1** builds the real registration/login API and schema — no upstream dependency.
- **Module 2** designs its Escrow Ledger schema and writes funding-flow logic against a hardcoded fake Investor ID (M1's real auth isn't ready yet).
- **Module 3** and **Module 4** build their schemas and start standalone pieces (MCP skeleton; nothing needs another module yet).
- **Module 5** builds its audit schema and a stub `/api/audit/anchor` that just logs to a table — no real XRPL call yet — so the other four have something real to call.
- **Integration meeting:** confirm the five schemas don't conflict on shared fields (project IDs, user IDs), and demo M1's login end-to-end.

### Checkpoint 2 (Weeks 3–4)

- **Module 1** finishes OCR + HITL + cert issuance, calls M5's now-real `/api/audit/anchor` (M5 upgrades its stub to a real XRPL Testnet hash call).
- **Module 2** swaps its hardcoded fake Investor ID for a real call to M1's now-working auth API — this is the mock being retired exactly as described in Section 5.
- **Module 3** builds its scam-typology matcher fully standalone, still with no cross-module dependency.
- **Module 4** builds its EXIF extraction pipeline standalone.
- **Integration meeting:** demo that issuing a certificate in M1 produces a real, verifiable hash anchored on XRPL — the first genuine cross-module feature.

The same pattern repeats for Checkpoints 3–7: the upstream module builds the real version, the downstream module retires its mock, and the checkpoint's target feature is what gets demoed.

## 9. Automated integration checks (CI)

A GitHub Actions workflow runs on every PR into `develop`: it brings up docker-compose, runs each module's test suite, and runs the smoke test for that checkpoint's target feature. See `.github/workflows/ci.yml`.

## 10. Commit messages

Keep them specific enough that "who did what" is legible from `git log` alone — this is part of how individual contribution gets evidenced to the panel. Prefer `module-2: implement escrow COMMITTED state transition` over `fix stuff`.
