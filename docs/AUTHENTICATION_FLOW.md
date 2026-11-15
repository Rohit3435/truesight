# Authentication flow

`/signup` and `/login` render the existing branded form. The form calls `POST /api/auth/signup` or `/api/auth/login`; credentials never enter browser storage. The server validates email syntax and password length/complexity, stores only a salted scrypt password hash, and returns an opaque random session token in an `HttpOnly; SameSite=Lax` cookie. Production cookies also set `Secure`.

The token itself is not stored in the database. A SHA-256 digest and expiration are stored, so the server can revoke sessions on logout. Sessions last 14 days; expired sessions are rejected by protected APIs. `/api/auth/me` supports client page guards. Investigation creation, report retrieval, and history require a valid session, and database lookups always scope reports by the authenticated user ID.

## Persistence boundary

For this repository's local and single-container setup, accounts, sessions, and reports are stored in `.data/truesight.json` and atomically replaced on writes. The file is ignored by Git and created with owner-only permissions where supported. Run a single app process and mount durable storage at `/app/.data` in Docker. This JSON store is not a multi-instance database, has no email ownership verification, and does not encrypt data at rest. A production multi-instance service should replace it with PostgreSQL and add email verification and rate limiting before public launch.
