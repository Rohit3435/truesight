# TrueSight

TrueSight is a Next.js application for authorized, evidence-based review of Instagram and LinkedIn profile material. Automatic collection is attempted only through an explicitly configured authorized provider. Reports keep collected data separate from user-submitted material and explain access limitations.

## Run locally

```powershell
npm ci
Copy-Item .env.example .env
npm run dev
```

Open <http://localhost:3000>, create an account, then select automatic, evidence-only, or combined investigation. Local accounts, sessions, and reports are stored in the ignored `.data/truesight.json` file. Passwords are stored as scrypt hashes; report APIs require a valid session and return only the current user's investigations.

## Providers and platform access

Model analysis is optional. Configure one provider in `.env` and allow external processing on the form to use it. Instagram Business Discovery requires an eligible Meta professional account, approved permissions, `INSTAGRAM_ACCESS_TOKEN`, and `INSTAGRAM_BUSINESS_ACCOUNT_ID`. Standard LinkedIn OAuth does not permit arbitrary public-profile lookup; provide authorized evidence when target collection is unavailable. See [environment setup](docs/ENVIRONMENT_SETUP.md) and the platform data-flow guides.

## Checks

```powershell
npm test
npm run lint
npx tsc --noEmit --incremental false
npm run test:e2e -- --workers=1
npm run build
```

## Deployment

`Dockerfile` builds a standalone Node 22 image. `docker compose up --build` runs one instance with a persistent volume at `/app/.data`. The JSON store requires a single instance and durable disk; it is not appropriate for multi-instance/serverless deployment. See [deployment and environment setup](docs/ENVIRONMENT_SETUP.md).
