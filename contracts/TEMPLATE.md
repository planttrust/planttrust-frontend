# Contract Template

Copy this file as `contracts/module-<n>-<name>.md` for each endpoint or event your module exposes to others. Get sign-off from any module that will call it before you start building.

---

## Endpoint / Event name

`POST /api/example/action`

**Provider module:** Module X
**Called by:** Module Y, Frontend, etc.
**Purpose:** One sentence on what this does and why another module needs it.

### Request

```json
{
  "field": "type — description"
}
```

### Response

```json
{
  "field": "type — description"
}
```

### Error Responses

| Status | Body | When |
|---|---|---|
| `400` | `{ "error": "description" }` | Invalid input |
| `401` | `{ "error": "unauthorized" }` | Missing/invalid JWT |
| `500` | `{ "error": "internal" }` | Server error |

### Notes

- Any validation rules, error cases, or state preconditions the caller needs to know about.
- Link to the related GitHub issue(s).

---

## Example (filled in)

## POST /api/audit/anchor

**Provider module:** Module 5 (Blockchain Auditing)
**Called by:** Module 1, Module 2, Module 3, Module 4
**Purpose:** Hash and anchor any event on XRPL Testnet for audit purposes.

### Request

```json
{
  "sourceModule": "string — e.g. 'module-1'",
  "eventType": "string — e.g. 'certificate_issued'",
  "dataHash": "string — SHA-256 hash of the event payload"
}
```

### Response

```json
{
  "anchorId": "string — internal reference",
  "txHash": "string — XRPL transaction hash",
  "status": "string — 'pending' | 'confirmed'"
}
```

### Notes

- Until the real XRPL call is implemented, this endpoint returns a stubbed response and logs the request.
- Related issues: Module 5 issue #6, #7.
