---
name: secure-endpoint
description: Review and harden JavaScript or TypeScript endpoints that receive user, source, audience, tip, report, or contact data. Use when Codex must identify and fix real endpoint security issues including missing schema validation, unsafe input handling, exposed secrets, PII in logs, missing browser security headers, and absent adversarial tests.
---

# Secure Endpoint

## Workflow

1. Identify the endpoint inputs, trusted boundaries, response shape, logging behavior, and secret/config access.
2. Validate request data with an explicit schema:
   - Require expected fields and reject missing, empty, non-string, oversized, or unexpected malicious payloads.
   - Normalize and sanitize accepted strings before any downstream use.
3. Keep secrets external:
   - Do not hardcode secrets.
   - Do not read high-value secrets directly from endpoint logic.
   - Prefer a configuration boundary, environment injection outside request handling, or Secret Manager in real deployments.
   - Keep `.env` ignored and version only `.env.example` with placeholders.
4. Return security headers for browser-reachable endpoints:
   - `Content-Security-Policy`
   - `Strict-Transport-Security`
   - `X-Frame-Options`
5. Log safely:
   - Use structured logs with event metadata only.
   - Never log PII, contact fields, user text, tokens, passwords, API keys, or secret values.
6. Validate with tests:
   - Add or run unit tests for accepted inputs.
   - Include at least one adversarial test with malicious payloads such as script tags, injection strings, oversized strings, or malformed types.

## Review Checklist

- Inputs are schema-validated before use.
- Accepted text is sanitized or safely encoded for the target context.
- Invalid or malicious payloads return an explicit client error.
- Responses do not echo sensitive user text, contact data, tokens, or secrets.
- Logs do not contain PII or secret material.
- Security headers are present.
- `.env` is ignored, `.env.example` is safe to commit, and application code avoids direct secret access in request handlers.
