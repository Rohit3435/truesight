# Environment and local setup

1. Use Node.js 22 or newer and install dependencies with `npm ci`.
2. Copy `.env.example` to `.env`; keep `.env` out of Git.
3. Start the app with `npm run dev` and open `http://localhost:3000`.
4. Sign up with a valid email syntax and a password of at least 10 characters containing lowercase, uppercase, and numeric characters. State is written to the ignored `.data/truesight.json` file.
5. For consented model analysis, configure `AI_PROVIDER` and the matching Gemini, Groq, or loopback Ollama credentials. Without them, model agents are skipped.
6. For Instagram automatic collection, configure `INSTAGRAM_ACCESS_TOKEN` and `INSTAGRAM_BUSINESS_ACCOUNT_ID` from an approved Meta app/account with eligible Business Discovery permissions. Arbitrary profile access is not guaranteed.
7. No general LinkedIn public target lookup is configured or available through standard member OAuth permissions. Use authorized submitted evidence when automatic access is unavailable.

## Deployment

The Docker image builds Next.js in standalone mode. `docker compose up --build` runs one application instance and mounts a persistent named volume for accounts and reports. For a hosted deployment, use a Node 22 container host that supports a persistent disk mounted at `/app/.data`; do not scale this JSON-backed service to multiple instances. Provide `.env` values through the host's secret manager, never the image. Set a long random `SESSION_SECRET` is not currently required because sessions are opaque random IDs stored by digest.

The project does not include live Meta/AI credentials, a LinkedIn approved target-data permission, email verification delivery, or a managed multi-instance database. Those must be configured or implemented before a public multi-instance SaaS launch. Provider adapter unit tests are mocked; they do not verify live account permissions.
