# Module 2 — Investor Marketplace & Investment Lifecycle: API Contract

## GET /api/listings

**Provider module:** Module 2
**Called by:** Frontend (Marketplace dashboard)
**Purpose:** List verified projects available for investment, with risk-based ranking.

### Query Parameters

| Param | Type | Description |
|---|---|---|
| `region` | string | Optional filter by region |
| `minTrustScore` | number | Optional minimum Trust Index score (0-100) |
| `sortBy` | string | `'trustScore'` | `'returnRate'` | `'newest'` |
| `page` | number | Pagination (default 1) |
| `limit` | number | Items per page (default 20, max 50) |

### Response — Success (200)

```json
{
  "listings": [
    {
      "listingId": "string — UUID",
      "projectId": "string",
      "companyId": "string",
      "companyName": "string",
      "projectName": "string",
      "description": "string",
      "targetAmount": "number",
      "fundedAmount": "number",
      "trustScore": "number — 0-100, from Module 5",
      "riskLevel": "string — 'low' | 'medium' | 'high'",
      "status": "string — 'open' | 'fully_funded' | 'closed'"
    }
  ],
  "total": "number",
  "page": "number",
  "totalPages": "number"
}
```

---

## POST /api/escrow/fund

**Provider module:** Module 2
**Called by:** Frontend (Funding flow)
**Purpose:** Investor commits funds to a project. Creates an escrow record in CREATED state and transitions to FUNDED.

### Request

```json
{
  "investorId": "string — UUID (from Module 1 auth)",
  "projectId": "string — UUID",
  "amount": "number — investment amount",
  "currency": "string — 'XRP' (default)"
}
```

### Response — Success (201)

```json
{
  "escrowId": "string — UUID",
  "investorId": "string",
  "projectId": "string",
  "amount": "number",
  "state": "string — 'FUNDED'",
  "anchorId": "string — Module 5 anchor reference for this event",
  "nftTokenId": "string | null — XRPL NFT token ID, null until minting confirms",
  "createdAt": "string — ISO 8601"
}
```

### Error Responses

| Status | Body | When |
|---|---|---|
| `400` | `{ "error": "Project is fully funded" }` | No remaining capacity |
| `400` | `{ "error": "Amount exceeds remaining capacity" }` | Amount too large |
| `401` | `{ "error": "unauthorized" }` | Missing/invalid JWT or non-investor role |
| `404` | `{ "error": "Project not found" }` | Invalid project ID |

### Notes

- This endpoint triggers two blockchain operations: ownership-record hashing via Module 5's anchor API, and NFT minting via Module 5's mint endpoint.
- State machine: CREATED → FUNDED → LOCKED → RELEASED → SETTLED. No state can be skipped (bypass-prevention).

---

## POST /api/escrow/release

**Provider module:** Module 2
**Called by:** Module 4 (after report approval passes geofence + AI checks)
**Purpose:** Release locked escrow funds to the company after a verified progress report.

### Request

```json
{
  "escrowId": "string — UUID",
  "reportId": "string — UUID (the approved progress report from Module 4)",
  "releaseAmount": "number — partial or full release amount",
  "approvedBy": "string — the admin/system that approved the report"
}
```

### Response — Success (200)

```json
{
  "escrowId": "string",
  "previousState": "string — 'LOCKED'",
  "newState": "string — 'RELEASED'",
  "releaseAmount": "number",
  "remainingBalance": "number",
  "anchorId": "string — Module 5 anchor reference for this release event",
  "releasedAt": "string — ISO 8601"
}
```

### Error Responses

| Status | Body | When |
|---|---|---|
| `400` | `{ "error": "Escrow not in LOCKED state" }` | Can only release from LOCKED |
| `400` | `{ "error": "Release amount exceeds locked balance" }` | Amount too large |
| `404` | `{ "error": "Escrow not found" }` | Invalid escrow ID |

---

## POST /api/transfers/p2p

**Provider module:** Module 2
**Called by:** Frontend (P2P transfer flow)
**Purpose:** Transfer an investor's stake to another investor (atomic transaction).

### Request

```json
{
  "sellerId": "string — UUID (current investor)",
  "buyerId": "string — UUID (receiving investor)",
  "escrowId": "string — UUID",
  "transferAmount": "number"
}
```

### Response — Success (200)

```json
{
  "transferId": "string — UUID",
  "escrowId": "string",
  "sellerId": "string",
  "buyerId": "string",
  "transferAmount": "number",
  "sellerNftBurned": "boolean",
  "buyerNftMinted": "string — new NFT token ID for buyer",
  "anchorId": "string — Module 5 anchor reference",
  "transferredAt": "string — ISO 8601"
}
```

### Error Responses

| Status | Body | When |
|---|---|---|
| `400` | `{ "error": "Seller does not own this escrow position" }` | Seller mismatch |
| `400` | `{ "error": "Insufficient balance to transfer" }` | Amount exceeds position |
| `404` | `{ "error": "Buyer not found" }` | Invalid buyer ID |

### Notes

- P2P transfers are atomic: the old NFT is burned and a new one is minted for the buyer in the same transaction batch.
- Both the burn and mint events are hashed via Module 5.

---

## GET /api/escrow/:escrowId/history

**Provider module:** Module 2
**Called by:** Frontend, Module 3 (chatbot context)
**Purpose:** Return the full state-transition history of an escrow record.

### Response — Success (200)

```json
{
  "escrowId": "string",
  "currentState": "string",
  "history": [
    {
      "fromState": "string",
      "toState": "string",
      "triggeredBy": "string — userId or system",
      "anchorId": "string — Module 5 reference",
      "timestamp": "string — ISO 8601"
    }
  ]
}
```
