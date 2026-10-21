# Module 5 — Blockchain Auditing: Anchor API

## POST /api/audit/anchor

**Provider module:** Module 5 (Blockchain Auditing)
**Called by:** Module 1, Module 2, Module 3, Module 4
**Purpose:** Accept event hashes from any module, batch them into a Merkle tree, and anchor the root on XRPL Testnet.

### Request

```json
{
  "sourceModule": "string — 'module-1' | 'module-2' | 'module-3' | 'module-4'",
  "eventType": "string — e.g. 'certificate_issued', 'escrow_funded', 'scam_flagged', 'report_approved'",
  "dataHash": "string — SHA-256 hex digest of the event payload",
  "metadata": {
    "entityId": "string — optional, ID of the entity this event relates to",
    "timestamp": "string — ISO 8601 timestamp of the original event"
  }
}
```

### Response — Success (201)

```json
{
  "anchorId": "string — UUID, internal reference for this anchor request",
  "batchId": "string — UUID, the Merkle batch this hash was added to",
  "status": "string — 'queued' | 'batched' | 'submitted' | 'confirmed'",
  "txHash": "string | null — XRPL transaction hash, null until status is 'submitted' or 'confirmed'",
  "merkleProof": "string[] | null — proof path, null until batch is built"
}
```

### Error Responses

| Status | Body | When |
|---|---|---|
| `400` | `{ "error": "Invalid dataHash format" }` | Hash is not a valid SHA-256 hex string |
| `400` | `{ "error": "Unknown sourceModule" }` | sourceModule is not one of the 4 valid values |
| `401` | `{ "error": "unauthorized" }` | Missing or invalid service-to-service JWT |
| `500` | `{ "error": "internal" }` | XRPL connection failure or DB error |

---

## GET /api/audit/verify/:anchorId

**Provider module:** Module 5
**Called by:** Module 1 (certificate verification), Module 4 (milestone timeline badges), Admin dashboard
**Purpose:** Given an anchor ID, return the Merkle proof and on-chain transaction confirming inclusion.

### Response — Success (200)

```json
{
  "anchorId": "string",
  "dataHash": "string",
  "merkleRoot": "string",
  "merkleProof": ["string — intermediate hashes"],
  "txHash": "string — XRPL transaction hash",
  "verified": "boolean — true if proof is valid against the on-chain root",
  "explorerUrl": "string — link to XRPL Testnet explorer for this tx"
}
```

### Error Responses

| Status | Body | When |
|---|---|---|
| `404` | `{ "error": "Anchor not found" }` | No anchor with this ID exists |
| `409` | `{ "error": "Batch not yet submitted" }` | Anchor exists but Merkle batch hasn't been sent to XRPL yet |

---

## GET /api/audit/trust-index/:projectId

**Provider module:** Module 5
**Called by:** Module 2 (risk ranking), Module 3 (chatbot context), Admin dashboard
**Purpose:** Return the composite Trust Index score for a project.

### Response — Success (200)

```json
{
  "projectId": "string",
  "trustScore": "number — 0-100 weighted composite",
  "components": {
    "documentVerification": "number — from Module 1 confidence scores",
    "escrowHealth": "number — from Module 2 completion rates",
    "complianceScore": "number — from Module 3 rule engine",
    "geofencePassRate": "number — from Module 4 validation results"
  },
  "lastUpdated": "string — ISO 8601"
}
```

### Notes

- Trust Index is recomputed on a schedule (every 15 minutes) and cached, not computed per-request.
- Related issues: Module 5 issues for Trust Index implementation.
