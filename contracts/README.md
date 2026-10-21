# API Contracts

This folder holds the interface specifications for every endpoint or event that one module exposes to another. The goal is simple: **agree on the shape before building**, so integration isn't a surprise at the end.

## How to use

1. Before building a call into another module, check this folder for that module's contract.
2. If a contract exists, build against it. If it doesn't, create one using `TEMPLATE.md` and get sign-off from that module's owner.
3. Build against a mock/stub matching the contract shape so you're never blocked waiting for the real implementation.
4. When the real endpoint is ready, swap the URL — nothing else should change because the shape was agreed in advance.

## Cross-Module Contract Summary

| Caller | Provider | Endpoint | Purpose |
|---|---|---|---|
| Frontend / M2 | Module 1 | `GET /api/certificates/:id/verify` | Public lookup confirming certificate is anchored on-chain |
| M1, M2, M3, M4 | Module 5 | `POST /api/audit/anchor` | Hash and anchor an event on XRPL Testnet |
| M2 (Fund Project) | Module 5 | `POST /api/audit/mint` | Trigger NFT minting with Investor ID, Project ID, Stake Amount |
| M4 (report approved) | Module 2 | `POST /api/escrow/release` | Release escrow funds after geofence + AI checks pass |
| M2 / Frontend | Module 5 | `GET /api/audit/verify/:hash` | Confirm a hash is anchored on XRPL Testnet |
| Frontend (dashboard) | Module 5 | `GET /api/trust-index/:companyId` | Fetch aggregated Trust Index score |

## Contract Files

| File | Module | Status |
|---|---|---|
| `module-1-user-management.md` | Module 1 — Auth, Documents, Certificates | ✅ Complete |
| `module-2-marketplace.md` | Module 2 — Listings, Escrow, P2P Transfers | ✅ Complete |
| `module-3-mcp-ai.md` | Module 3 — MCP Query, Chatbot, Scam Check | ✅ Complete |
| `module-4-company-geofencing.md` | Module 4 — Projects, Reports, Timeline | ✅ Complete |
| `module-5-blockchain-audit.md` | Module 5 — Anchor, Verify, Trust Index | ✅ Complete |

## Rules

- Changes to any contract file require sign-off from **both** the provider module's owner **and** at least one consumer module's owner.
- Never break a published contract without a deprecation notice and migration path.
