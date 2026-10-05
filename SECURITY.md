# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in PlanTrust, please report it responsibly:

1. **Do NOT** open a public GitHub issue.
2. Email the team lead directly with a description of the vulnerability.
3. Include steps to reproduce if possible.

We will acknowledge receipt within 48 hours and provide a fix timeline.

## Supported Versions

| Version | Supported |
|---|---|
| `main` branch (latest) | ✅ Yes |
| `develop` branch | ✅ Yes |
| Older commits | ❌ No |

## Security Best Practices for Contributors

- Never commit `.env` files or secrets to the repository.
- Use environment variables for all sensitive configuration.
- Keep dependencies up to date (`npm audit` regularly).
- Use parameterized queries for all database operations (never string concatenation).
- Validate and sanitize all user input on the backend.
