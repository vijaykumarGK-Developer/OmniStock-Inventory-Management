# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| 1.0.x   | ✅ Yes    |

## Reporting a Vulnerability

If you discover a security vulnerability, please **do not open a public issue**.

Instead, email the project maintainer directly or open a draft security advisory on GitHub:

1. Go to https://github.com/vijaykumarGK-Developer/OmniStock-Inventory-Management/security/advisories
2. Click **"New draft security advisory"**
3. Fill in the details

You can expect an acknowledgment within 48 hours and a resolution timeline within 7 days.

## Security Notes

- JWT secrets are randomly generated at server startup via `crypto.randomBytes(32)`
- Passwords are hashed with bcryptjs (12 rounds) — never stored in plain text
- CORS is restricted to the frontend origin in production
- SQLite database file (`*.db`) is excluded from version control via `.gitignore`
- Environment variables (`.env`) are never committed to the repository
