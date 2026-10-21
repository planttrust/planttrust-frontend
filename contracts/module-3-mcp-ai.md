# Module 3 — MCP-Driven Explainable AI & Chatbot: API Contract

## POST /api/mcp/query

**Provider module:** Module 3
**Called by:** Frontend (Chatbot interface)
**Purpose:** Send a natural-language query to the MCP server, which routes it to the appropriate scoped query tool and returns an explained result.

### Request

```json
{
  "sessionId": "string — UUID (chatbot session)",
  "query": "string — user's natural-language question",
  "context": {
    "userId": "string — optional, for personalised responses",
    "projectId": "string — optional, to scope the query to a specific project"
  }
}
```

### Response — Success (200)

```json
{
  "sessionId": "string",
  "response": "string — natural-language answer",
  "sources": [
    {
      "tool": "string — which MCP tool was used (e.g. 'escrow_status', 'trust_index')",
      "module": "string — which module's API was queried",
      "data": "object — raw data returned by the tool"
    }
  ],
  "reasoning": "string — human-readable explanation of how the answer was derived",
  "confidence": "number — 0-1"
}
```

### Error Responses

| Status | Body | When |
|---|---|---|
| `400` | `{ "error": "Query is empty" }` | No query text provided |
| `401` | `{ "error": "unauthorized" }` | Missing/invalid JWT |
| `503` | `{ "error": "LLM service unavailable" }` | LLM backend is down |

---

## POST /api/chatbot/session

**Provider module:** Module 3
**Called by:** Frontend
**Purpose:** Create a new chatbot conversation session.

### Request

```json
{
  "userId": "string — UUID"
}
```

### Response — Success (201)

```json
{
  "sessionId": "string — UUID",
  "createdAt": "string — ISO 8601"
}
```

---

## GET /api/chatbot/session/:sessionId/history

**Provider module:** Module 3
**Called by:** Frontend
**Purpose:** Retrieve conversation history for a chatbot session.

### Response — Success (200)

```json
{
  "sessionId": "string",
  "messages": [
    {
      "role": "string — 'user' | 'assistant'",
      "content": "string",
      "timestamp": "string — ISO 8601",
      "sources": "array | null — MCP tool sources if assistant message"
    }
  ]
}
```

---

## POST /api/scam/check

**Provider module:** Module 3
**Called by:** Module 2 (on escrow release), Module 5 (Trust Index input)
**Purpose:** Run scam-typology matching and CBSL compliance check against a project or investment pattern.

### Request

```json
{
  "projectId": "string — UUID",
  "checkType": "string — 'typology' | 'compliance' | 'both'",
  "investmentData": {
    "fundingVelocity": "number — optional, investments per day",
    "concentrationRatio": "number — optional, % from single investor",
    "contractClauses": ["string — optional, clause texts to check"]
  }
}
```

### Response — Success (200)

```json
{
  "projectId": "string",
  "flags": [
    {
      "flagId": "string — UUID",
      "type": "string — 'scam_typology' | 'compliance_violation'",
      "severity": "string — 'low' | 'medium' | 'high' | 'critical'",
      "description": "string — human-readable explanation",
      "matchedPattern": "string — which typology or rule matched",
      "confidence": "number — 0-1",
      "anchorId": "string — Module 5 anchor reference (flag was hashed)"
    }
  ],
  "overallRisk": "string — 'clear' | 'flagged' | 'blocked'",
  "reasoning": "string — cross-validation explanation"
}
```

### Notes

- Every flag raised is automatically hashed via Module 5's anchor API for the immutable audit trail.
- The `reasoning` field provides the explainability trace required by the MCP architecture.

---

## GET /api/scam/audit-log

**Provider module:** Module 3
**Called by:** Frontend (Admin view), Module 5 (regulatory dashboard)
**Purpose:** Queryable, chronological view of every anchored risk flag with proof-of-inclusion.

### Query Parameters

| Param | Type | Description |
|---|---|---|
| `projectId` | string | Optional filter by project |
| `severity` | string | Optional filter: `'low'` | `'medium'` | `'high'` | `'critical'` |
| `from` | string | ISO 8601 start date |
| `to` | string | ISO 8601 end date |
| `page` | number | Pagination (default 1) |

### Response — Success (200)

```json
{
  "flags": [
    {
      "flagId": "string",
      "projectId": "string",
      "type": "string",
      "severity": "string",
      "description": "string",
      "anchorId": "string",
      "txHash": "string — XRPL tx hash",
      "verified": "boolean — proof-of-inclusion confirmed",
      "createdAt": "string — ISO 8601"
    }
  ],
  "total": "number",
  "page": "number"
}
```
