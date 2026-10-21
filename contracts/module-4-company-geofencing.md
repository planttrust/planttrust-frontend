# Module 4 — Company Portal & Proof-of-Reality (Geofencing): API Contract

## POST /api/projects/register

**Provider module:** Module 4
**Called by:** Frontend (Company dashboard)
**Purpose:** Register a new project with polygon boundary coordinates.

### Request

```json
{
  "companyId": "string — UUID (from Module 1 auth, must be verified)",
  "projectName": "string",
  "description": "string",
  "region": "string",
  "targetAmount": "number",
  "polygon": [
    { "lat": "number", "lng": "number" }
  ]
}
```

### Response — Success (201)

```json
{
  "projectId": "string — UUID",
  "companyId": "string",
  "projectName": "string",
  "status": "string — 'registered'",
  "polygonVertices": "number — count of polygon points",
  "createdAt": "string — ISO 8601"
}
```

### Error Responses

| Status | Body | When |
|---|---|---|
| `400` | `{ "error": "Polygon must have at least 3 vertices" }` | Insufficient polygon points |
| `401` | `{ "error": "unauthorized" }` | Missing/invalid JWT or non-company role |
| `403` | `{ "error": "Company not verified" }` | Company hasn't passed Module 1's HITL review |

---

## POST /api/reports/submit

**Provider module:** Module 4
**Called by:** Frontend (Progress report submission)
**Purpose:** Submit a progress report with geo-tagged evidence photos from the field.

### Request

Multipart form data:
- `projectId` — string, UUID
- `milestone` — string, e.g. `'land_clearing'`, `'foundation'`, `'planting_complete'`
- `notes` — string, text description of progress
- `evidence[]` — file array, geo-tagged photos/videos from in-app camera

### Response — Success (201)

```json
{
  "reportId": "string — UUID",
  "projectId": "string",
  "milestone": "string",
  "status": "string — 'pending_validation'",
  "evidenceCount": "number",
  "submittedAt": "string — ISO 8601"
}
```

### Notes

- After submission, the EXIF extraction pipeline runs automatically on each evidence file.
- Geofence validation (point-in-polygon) runs on the extracted GPS coordinates.
- dHash duplicate-detection and anti-spoofing checks run on the images.

---

## GET /api/reports/:reportId/validation

**Provider module:** Module 4
**Called by:** Frontend (Company dashboard, Admin view)
**Purpose:** Get the validation results for a submitted progress report.

### Response — Success (200)

```json
{
  "reportId": "string",
  "projectId": "string",
  "milestone": "string",
  "status": "string — 'pending_validation' | 'passed' | 'failed' | 'flagged'",
  "validationResults": {
    "geofence": {
      "passed": "boolean",
      "evidenceLocations": [
        {
          "fileId": "string",
          "lat": "number",
          "lng": "number",
          "insidePolygon": "boolean",
          "distanceFromBoundary": "number — metres, if outside"
        }
      ]
    },
    "duplicateDetection": {
      "passed": "boolean",
      "flaggedFiles": [
        {
          "fileId": "string",
          "matchedWith": "string — fileId of the duplicate",
          "similarity": "number — 0-1 dHash similarity"
        }
      ]
    },
    "antiSpoofing": {
      "passed": "boolean",
      "flaggedFiles": [
        {
          "fileId": "string",
          "reason": "string — 'screenshot_detected' | 'gps_spoofing' | 'image_manipulation'",
          "confidence": "number — 0-1"
        }
      ]
    }
  }
}
```

---

## POST /api/reports/:reportId/approve

**Provider module:** Module 4
**Called by:** Frontend (Admin action)
**Purpose:** Approve a validated progress report, triggering escrow release via Module 2 and blockchain hashing via Module 5.

### Request

```json
{
  "approvedBy": "string — admin userId",
  "releaseAmount": "number — amount to release from escrow",
  "notes": "string — optional approval notes"
}
```

### Response — Success (200)

```json
{
  "reportId": "string",
  "status": "string — 'approved'",
  "escrowReleaseResult": {
    "escrowId": "string",
    "newState": "string — 'RELEASED'",
    "releaseAmount": "number"
  },
  "anchorId": "string — Module 5 anchor reference for this approval event",
  "approvedAt": "string — ISO 8601"
}
```

### Error Responses

| Status | Body | When |
|---|---|---|
| `400` | `{ "error": "Report validation not passed" }` | Cannot approve a report that failed validation |
| `400` | `{ "error": "Report already approved" }` | Duplicate approval attempt |
| `502` | `{ "error": "Escrow release failed" }` | Module 2's release endpoint returned an error |

### Notes

- This is the key cross-module trigger: approval → calls Module 2's `POST /api/escrow/release` → Module 2 hashes the release event via Module 5.
- The approval itself is also hashed via Module 5 for the Milestone Timeline.

---

## GET /api/projects/:projectId/timeline

**Provider module:** Module 4
**Called by:** Frontend (Investor-facing Milestone Timeline)
**Purpose:** Return the verified chronological milestone history with inclusion-proof badges.

### Response — Success (200)

```json
{
  "projectId": "string",
  "projectName": "string",
  "milestones": [
    {
      "reportId": "string",
      "milestone": "string",
      "status": "string — 'approved'",
      "approvedAt": "string — ISO 8601",
      "anchorId": "string",
      "txHash": "string — XRPL tx hash",
      "verified": "boolean — proof-of-inclusion confirmed",
      "explorerUrl": "string — XRPL Testnet explorer link"
    }
  ]
}
```

### Notes

- Each milestone badge shows its on-chain Merkle proof so investors can independently verify.
- Calls Module 5's `GET /api/audit/verify/:anchorId` for each milestone's proof.
