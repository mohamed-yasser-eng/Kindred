# Production Readiness Checklist

This document tracks what is missing before the backend is production-ready and fully ready for frontend/client integration.

## Current Status

- TypeScript compile check passes with `npx tsc --noEmit`.
- The project is not production-ready yet.
- Main blockers are deployment config, automated tests, frontend/client contract, and one remaining dependency audit advisory.

## Critical Gaps

- [x] Add real production scripts in `package.json`.

- [x] Fix OTP expiry field mismatch.

- [x] Fix sign-out blacklist expiry.

- [x] Add refresh-token endpoint.

- [x] Enforce email verification before sign-in.

- [x] Wrap JWT verification in safe error handling.

- [x] Protect socket group access.

## Feature Gaps

- [x] Implement comments module.

- [x] Implement reacts module.

- [x] Implement profile update.

- [x] Implement post update.

- [x] Implement post delete.

- [x] Implement get user posts.

- [x] Decide what to do with GraphQL.
  - Implemented and mounted as a read/query layer at `/graphql`.
  - REST remains responsible for auth, uploads, mutations, comments, reacts, friendships, and post writes.

## GraphQL Feature Ideas

GraphQL should be used as a read/query layer for nested frontend screens, not as a full replacement for the existing REST API. Keep auth, uploads, post creation/update/delete, comments, reacts, and friendship mutations in REST for now.

- [x] Feed query.

- [x] Profile dashboard query.

- [x] Single post details query.

- [x] Conversations metadata query.

## Security And Stability Gaps

- [x] Restrict CORS.

- [x] Add upload hardening.

- [x] Avoid exposing raw internal errors to clients.

- [x] Add rate limiting.

- [x] Add security headers.

- [x] Add request body size limits.

- [x] Add startup environment validation.

- [x] Add `.env.example`.

- [x] Rotate secrets if `.env` was ever committed.
  - Local git history check found no `.env` commits.
  - `.env` is ignored now.



## Database Gaps

- [x] Add timestamps to main schemas.

- [x] Add required constraints where needed.

- [x] Add feed/query indexes.

- [x] Add TTL index for blacklisted tokens.

- [x] Prevent duplicate friendship requests.

- [x] Prevent duplicate direct conversations.

- [x] Improve account deletion cleanup.

## Integration Gaps

- [x] Add API documentation.

- [x] Standardize response shape.

- [x] Add route validators.

- [x] Add socket event validation.

- [x] Add health check endpoint.

- [ ] Add deployment config.
  - Dockerfile.
  - Production environment docs.
  - Process manager config if needed.
  - CI workflow.

- [ ] Add tests.
  - Unit tests.
  - Integration tests.
  - Auth flow tests.
  - Upload flow tests.
  - Socket flow tests.
  - Repository/database behavior tests.

- [ ] Define frontend/client contract.
  - Auth header format.
  - Socket auth payload.
  - Upload field names.
  - Response schemas.
  - Error format.
  - Pagination format.

## Suggested Work Order

1. Add deployment config.
2. Add frontend/client contract.
3. Add automated tests and CI checks.
4. Decide whether to force-upgrade `nodemailer` or explicitly accept the remaining moderate audit advisory.
