# Module 1 — User Management & Corporate Registry: API Contract

## POST /api/auth/register

**Provider module:** Module 1
**Called by:** Frontend
**Purpose:** Register a new user (Investor, Company, or Admin).

### Request

```json
{
  "email": "string",
  "password": "string — min 8 chars",
  "role": "string — 'investor' | 'company' | 'admin'",
  "fullName": "string",
  "phone": "string — optional"
}
```

### Response — Success (201)

```json
{
  "userId": "string — UUID",
  "email": "string",
  "role": "string",
  "token": "string — JWT access token",
  "refreshToken": "string — JWT refresh token"
}
```

### Error Responses

| Status | Body | When |
|---|---|---|
| `400` | `{ "error": "Email already registered" }` | Duplicate email |
| `400` | `{ "error": "Invalid role" }` | Role not in allowed values |
| `422` | `{ "error": "Password too short" }` | Password under 8 chars |

---

## POST /api/auth/login

**Provider module:** Module 1
**Called by:** Frontend, all modules (for service-to-service auth)
**Purpose:** Authenticate a user and return a JWT.

### Request

```json
{
  "email": "string",
  "password": "string"
}
```

### Response — Success (200)

```json
{
  "userId": "string — UUID",
  "role": "string",
  "token": "string — JWT access token",
  "refreshToken": "string — JWT refresh token"
}
```

### Error Responses

| Status | Body | When |
|---|---|---|
| `401` | `{ "error": "Invalid credentials" }` | Wrong email or password |

---

## POST /api/documents/upload

**Provider module:** Module 1
**Called by:** Frontend (company onboarding)
**Purpose:** Upload a document for OCR processing and HITL review.

### Request

Multipart form data:
- `file` — the document file (PDF, JPG, PNG)
- `companyId` — string, UUID of the company
- `documentType` — string, e.g. `'registration_cert'`, `'land_deed'`, `'business_license'`

### Response — Success (201)

```json
{
  "documentId": "string — UUID",
  "companyId": "string",
  "documentType": "string",
  "status": "string — 'processing' | 'pending_review'",
  "ocrConfidence": "number | null — 0-1, null until OCR completes"
}
```

---

## GET /api/documents/:documentId/review

**Provider module:** Module 1
**Called by:** Frontend (Admin Review Queue)
**Purpose:** Get a document's OCR results and extracted fields for HITL review.

### Response — Success (200)

```json
{
  "documentId": "string",
  "companyId": "string",
  "documentType": "string",
  "status": "string — 'pending_review' | 'approved' | 'rejected'",
  "ocrText": "string — raw extracted text",
  "extractedFields": {
    "companyName": "string | null",
    "registrationNumber": "string | null",
    "dateOfRegistration": "string | null"
  },
  "ocrConfidence": "number — 0-1",
  "compositeScore": "number — 0-1, OCR confidence × field-format match"
}
```

---

## POST /api/documents/:documentId/decision

**Provider module:** Module 1
**Called by:** Frontend (Admin Review Queue)
**Purpose:** Admin approves or rejects a document after HITL review.

### Request

```json
{
  "decision": "string — 'approved' | 'rejected' | 'request_more_info'",
  "notes": "string — optional reviewer notes"
}
```

### Response — Success (200)

```json
{
  "documentId": "string",
  "status": "string — updated status",
  "reviewedBy": "string — admin userId",
  "reviewedAt": "string — ISO 8601"
}
```

---

## POST /api/certificates/issue

**Provider module:** Module 1
**Called by:** Module 1 internal (triggered after all documents approved)
**Purpose:** Issue a Digital Trust Certificate for a verified company and hash it via Module 5.

### Response — Success (201)

```json
{
  "certificateId": "string — UUID",
  "companyId": "string",
  "issuedAt": "string — ISO 8601",
  "qrCodeUrl": "string — URL to the QR code image",
  "anchorId": "string — Module 5's anchor reference",
  "status": "string — 'issued' | 'pending_anchor'"
}
```

---

## GET /api/certificates/:id/verify

**Provider module:** Module 1
**Called by:** Frontend, Module 2, any external party
**Purpose:** Public lookup confirming a company's certificate is genuinely anchored on-chain.

### Response — Success (200)

```json
{
  "certificateId": "string",
  "companyId": "string",
  "companyName": "string",
  "issuedAt": "string — ISO 8601",
  "verified": "boolean — true if on-chain proof is valid",
  "anchorId": "string",
  "txHash": "string — XRPL transaction hash",
  "explorerUrl": "string — link to XRPL Testnet explorer"
}
```

### Error Responses

| Status | Body | When |
|---|---|---|
| `404` | `{ "error": "Certificate not found" }` | No certificate with this ID |
| `409` | `{ "error": "Anchor pending" }` | Certificate exists but not yet confirmed on-chain |

### Notes

- This is a **public** endpoint — no auth required. Anyone with a certificate ID or QR code can verify.
- This calls Module 5's `GET /api/audit/verify/:anchorId` internally.
