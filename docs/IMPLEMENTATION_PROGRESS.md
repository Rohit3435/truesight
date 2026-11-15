# Implementation Progress

## Phase 1 — Repository audit

**Status:** Complete.

- Confirmed clean working tree and `feature/truesight-functional-upgrade` branch.
- Confirmed `origin` points to `Rohit3435/truesight`.
- Inspected app routes, scan and results flow, AI wrapper, dependencies, configuration, and tracked files.
- Documented the existing frontend architecture, simulated functionality, hardcoded output, missing backend/auth/data layers, security concerns, and a staged implementation roadmap in [PROJECT_AUDIT.md](PROJECT_AUDIT.md).
- No tests were run for this read-only audit.
- Audit commit: `58bca58` (`docs: add project architecture audit`), pushed successfully to `origin/feature/truesight-functional-upgrade`.

## Phase 2 — Secure foundation (in progress)

- Removed the unused legacy Gemini wrapper, including its source-embedded credential, fabricated fallback scores, sensitive identity/mental-health prompts, and sample data.
- Added typed Instagram and LinkedIn username/profile URL normalization in `src/lib/profile-input.ts`. This validates syntax and canonicalizes URLs; it does not imply profile availability or start collection.
- The provider credential still needs revocation/rotation by the account owner. Removing it from the current source does not remove it from prior Git history; history rewriting is prohibited by the project instructions.
- Added Node built-in tests for valid and invalid Instagram/LinkedIn URLs, usernames, blank input, and unsupported hosts. `node --experimental-strip-types --test tests/profile-input.test.mjs` passed (6/6).
- `git diff --check` completed. TypeScript, ESLint, and production build checks could not run because project dependencies are not installed; PowerShell also blocked the `npx.ps1` shim.
- Foundation commit: `7018432` (`feat: add safe profile input normalization`), pushed successfully to `origin/feature/truesight-functional-upgrade`. Test and progress updates are being committed separately.

## Phase 4 — Evidence-first agent foundation (in progress)

- Added typed investigation/evidence/report contracts and explicit Instagram/LinkedIn collectors that report unavailable without authorized access; neither attempts scraping or access-control bypass.
- Added conditional profile, caption, and LinkedIn professional evidence agents, evidence-reference verification, and concurrent orchestration with per-agent failure isolation. These are deterministic extraction modules, not LLM agents; model-dependent analysis remains unavailable until an approved provider is configured.
- Added the multi-agent architecture guide and tests for skipped agents, source traceability, unsupported claim removal, and isolated failure.
- `npm.cmd test` passed (12/12) after the optional classifier agent was added. `git diff --check` passed.
- Commit: `1c9664c` (`feat: add evidence-first investigation orchestration`), pushed successfully to `origin/feature/truesight-functional-upgrade`.
- Installed the locked dependencies with `npm ci` for validation. Fixed the existing Next.js 14 ESLint preset reference, typed the shared Framer Motion variants, and wrapped the login/signup `useSearchParams` consumers in Suspense so routes can prerender.
- `npm run lint` passed, `tsc --noEmit --incremental false` passed, and `npm run build` passed with the permitted font network access. The build reported stale Browserslist data; no update was applied.

## AI and OSINT stack evaluation (in progress)

- Added a server-side Gemini multimodal structured-output adapter, explicit Groq/Ollama text adapters, a provider factory with no silent failover, and a Hugging Face classifier/agent guarded by explicit external-provider consent.
- Added `.env.example`, integration decisions and boundaries in `docs/INTEGRATIONS.md`, and mocked provider tests. These provider APIs have not been live-tested because no account credentials/local Ollama service are configured.
- VirusTotal, URLScan, Sherlock, ExifTool, and LangGraph are documented with their integration boundaries and remain deferred. Public OSINT checks that risk disclosing submitted data or breaching use limits remain disabled pending product privacy and license configuration.
- The expanded test suite passed (22/22), and lint/TypeScript checks passed. Provider adapter commits `44e8c1b` and `bff5223` are pushed to the development branch.
- Added Playwright Test as a dev dependency, a Chromium configuration, and two browser smoke tests. `npm run test:e2e -- --workers=1` passed (2/2) after waiting for the dev server's initial route compilation. Test output is ignored by Git.
- Connected the selected model adapter to an evidence-observation agent that requires explicit external-provider consent, limits text volume, validates exact quotes against cited evidence, and marks output for review. Commit `e5cd7dc` is pushed.
- Added a VirusTotal lookup-only adapter that refuses public-tier configuration, plus a consent-gated URLScan adapter that submits only private scans of HTTPS public DNS targets. Both have mocked tests only; neither has live credentials. These changes are pending commit.
- `npm test` passed (22/22), `npm run lint` passed, TypeScript passed, and the production build passed. Playwright passed (2/2). The build still reports stale Browserslist data; it does not affect build success.
- OSINT adapter commit `1d38c01` is pushed to the development branch.

## Evidence submission and truthful reporting milestone

- Replaced the simulated scan flow with `POST /api/investigations`, accepting user-provided text and an optional validated image. The API does not fetch profile URLs, rejects malformed identifiers and unsupported uploads, and keeps report state transient rather than persisting it.
- Rebuilt `/scan`, `/results`, and `/scanning`: image upload is optional; no sample findings, fake risk scores, simulated timers, or fabricated profile identity remain in the active review flow. Reports show evidence sources, executed/skipped agent states, traceable observations, and collection limitations.
- Added consent-gated image analysis. It runs only with a configured image-capable provider and explicit opt-in. Without credentials, image model analysis is clearly skipped. Text checks remain limited deterministic extraction; no claim of sentiment, identity, safety, or risk scoring is made.
- Replaced homepage and use-case copy that promised unsupported profile scraping, identity verification, safety metrics, fake testimonials, school case-study results, fixed subscription quotas, or sample reports. Removed obsolete `.new`, `.fixed`, and `.bak` UI snapshots containing fabricated scores and profile details.
- Verification: `npm.cmd test` passed (25/25), `npm.cmd run lint` passed, `tsc --noEmit --incremental false` passed, `npm.cmd run test:e2e -- --workers=1` passed (3/3), and `npm.cmd run build` passed. The build notes stale Browserslist data only.
- Limit: results are stored in browser session storage for the current tab; there is no authentication, durable history, or live authorized profile collection. Keep this as a local prototype until those boundaries are addressed.

The embedded Gemini credential identified by the audit should be treated as compromised and rotated by its owner.

## Functional upgrade — current implementation

The completed work below supersedes the prototype limitations recorded in earlier milestones.

### Completed

- Added [ROOT_CAUSE_ANALYSIS.md](ROOT_CAUSE_ANALYSIS.md) documenting the traced UI → API → collector → agent → results path and the exact `hr__rohit` behavior before implementation.
- Added signup/login/logout/me API routes. Passwords are salted scrypt hashes; sessions are opaque random IDs stored by digest in an HttpOnly SameSite cookie, expire after 14 days, and can be revoked on logout. Protected investigation APIs validate session ownership.
- Added local persistent single-instance account, session, and report storage in `.data/truesight.json`; excluded it from Git. Added user-scoped investigation history and ID-based report retrieval after refresh.
- Added automatic, evidence-only, and combined investigation modes. Automatic collection is attempted with no pasted material; combined mode preserves the collection attempt when optional evidence is empty; evidence-only mode validates that evidence exists.
- Replaced the always-unavailable Instagram placeholder with an authorized Meta Graph API Business Discovery adapter. It captures bounded profile fields and captions when configured and eligible, otherwise preserves the specific provider failure. LinkedIn now explains why its standard member OAuth is not arbitrary public target lookup and offers evidence-based continuation.
- Fixed report metadata so unavailable collection is never relabeled as successful user-provided collection. Reports preserve evidence source labels, collection errors, real agent statuses, and no-evidence failure state. Agent skips now include the missing prerequisite/consent reason.
- Added branded investigation history, source-aware report collection outcome messaging, setup docs, data-flow and agent docs, and standalone Docker deployment files for one instance with a persistent disk.
- Added visible URL extraction/security status, username OSINT skipped status when no approved provider exists, and explicit evidence-verification, orchestration, and report-generation steps. URL reputation adapters are not falsely represented as run.
- Added exact `hr__rohit`/`About person` coverage, automatic username/URL cases, missing credentials, mocked Graph API success and inaccessible-target failures, auth API/session/logout, evidence validation, URL extraction, and report refresh coverage.

### Verification

- `npm test`: **38 passed, 0 failed**.
- `npm run lint`: passed.
- `npx tsc --noEmit --incremental false`: passed.
- `npm run test:e2e -- --workers=1`: **3 passed** (signup-backed scan, report display, refresh retrieval).
- `npm run build`: passed with Next standalone output. The only build notice is outdated Browserslist data.
- Local smoke check: `http://localhost:3000` returned HTTP 200; unauthenticated investigation history returned HTTP 401.
- `git diff --check`: passed.

### Remaining blockers and limits

- No Meta API credentials were configured, so live Instagram Business Discovery and profile eligibility were not verified. Configure `INSTAGRAM_ACCESS_TOKEN` and `INSTAGRAM_BUSINESS_ACCOUNT_ID` with approved Meta permissions.
- No AI credentials were configured; live model calls are unverified. Add the selected server-side AI provider key to `.env` and opt in on the form.
- LinkedIn does not provide unrestricted arbitrary public profile access through standard member OAuth. No specific approved partner/member-consent target-data integration was configured; supply authorized evidence for targets unavailable through approved access.
- Current persistence is durable for local/single-container, single-instance use only. The included container requires a persistent `/app/.data` volume. Multi-instance deployment requires replacing the JSON store with a managed database. Email ownership verification, password reset, distributed rate limiting, and live external URL reputation workflows remain unimplemented.
- Deployment files are prepared, but no hosted environment, credentials, or deployment verification were supplied. No deployment is claimed.

### Git status

- Branch: `feature/truesight-functional-upgrade`.
- Commit: pending final review and commit.
- Push: pending commit.
