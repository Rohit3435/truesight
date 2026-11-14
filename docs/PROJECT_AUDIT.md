# TrueSight Project Audit

**Audit date:** 2026-11-15  
**Repository:** `Rohit3435/truesight`  
**Branch checked:** `feature/truesight-functional-upgrade`

## Executive summary

TrueSight is currently a Next.js 14 frontend prototype with a polished purple and pink visual theme and several marketing pages. Its scan flow and results are not connected to a backend: the scan form stores browser state, the scanning page advances with timers, and the results page builds a fixed report with invented values. There are no API routes, database, authentication implementation, data collection integrations, upload service, or agent orchestration in the tracked application.

The current project is a useful UI foundation, but it does not yet perform Instagram or LinkedIn investigations. The existing presentation also makes claims about identity, trust, emotional state, and safety that are unsupported by collected evidence. Those claims and scores must not be represented as real findings in a functional workflow.

## Repository and Git state

- The working tree was clean at audit start.
- The checked-out branch is `feature/truesight-functional-upgrade`.
- `origin` points to `https://github.com/Rohit3435/truesight.git` for fetch and push.
- The branch currently points to the same initial project commit as local `master` and `origin/master`; the requested development branch is available locally, but no separate development history was present at audit time.
- Existing backup and alternate UI files are tracked (`*.bak`, `*.fixed`, and `*.new`). They are not application routes, but their presence makes the intended canonical version unclear and increases maintenance risk. Preserve them until their purpose and history are understood.

## Existing architecture

### Frontend

- Next.js App Router, React 18, TypeScript, Tailwind CSS, Framer Motion, Lucide icons, and small Radix/shadcn-style UI components.
- Routes include the home, login, signup redirect, scan, scanning, results, pricing, use cases, and how-it-works pages.
- The visual identity is a purple/pink gradient theme with reusable button, card, badge, input, and theme-provider components. This can be retained while connecting real workflow states.
- Pages are predominantly client components. The scan/results workflow uses `sessionStorage` and direct DOM queries, with no server boundary for investigation data.

### Backend, data, and integrations

- No `src/app/api` routes or other backend service modules were found.
- No database configuration, schema, migrations, or persistence layer was found.
- No authentication provider, session handling, or protected route implementation was found. The login form redirects to the scan page without checking credentials; signup redirects to the login page.
- `src/lib/gemini-api.ts` contains a Gemini wrapper, but scan/results do not call it. It embeds a credential in source, builds prompts for sensitive identity and mental-health judgments, returns fabricated fallback scores on failures, and includes sample social data. Do not use those behaviors for investigation findings. The credential must be revoked/rotated and replaced with server-side configuration before using this integration.
- No Instagram, LinkedIn, threat-intelligence, image-analysis, or username lookup integration was found.
- No upload endpoint or server-side validation/storage exists. The current scan form requires a profile photo and stores its data URL in browser session storage.

### Build and deployment configuration

- `package.json` provides `dev`, `build`, `start`, and `lint` scripts. There is no test script or test framework configured.
- Both `next.config.js` and `next.config.ts` exist with empty configuration; their coexistence is redundant and should be checked against the installed Next.js version before deployment work.
- `.gitignore` excludes `.env*`, `.next`, build output, and dependencies. No `.env.example`, deployment workflow, health endpoint, migration instructions, or production operations guide exists.
- `README.md` is still the generic create-next-app README.

## Existing user-facing behavior

- The scan form accepts a name and optional link/platform fields, requires consent and a browser-stored photo, then creates a questionnaire score. A random positive bias is applied to that score.
- Submission waits on a 1.5-second timeout, writes data to `sessionStorage`, and navigates to `/scanning`; there is no request to a service.
- The scanning page increments a percentage, changes step labels on fixed timers, shows static log entries, and navigates to results after 30 seconds. It does not reflect collection or analysis work.
- The results page initializes profile data and categories from hardcoded examples, including fixed overall, identity, communication, emotional intelligence, human verification, and trust scores; fabricated evidence snippets; and hardcoded LinkedIn education/skills/project data. It also adds random score adjustments.
- The login/signup and social sign-in controls are presentation-only. There is no user identity or per-user access control.
- Several marketing/how-it-works pages promise capabilities such as safety scores and profile authenticity checks that are not implemented. Treat these as product copy, not evidence of working behavior.

## Problems and risks identified

1. **No end-to-end investigation:** no supported Instagram/LinkedIn input normalization, collection, evidence model, orchestration, storage, or report API.
2. **Misleading output:** hardcoded and random values are displayed as investigation results; the current score concepts include sensitive or unsupported personal judgments.
3. **No real progress:** timers and static logs give a false impression of backend execution.
4. **Credential exposure:** a Gemini API key is embedded in a tracked source file. Treat it as compromised, revoke/rotate it, and remove it from source/history handling before building on the integration. Do not reproduce the key in docs, logs, or commits.
5. **Unsafe AI design:** current prompts request mental-health and identity/fraud judgments, and error fallbacks fabricate numeric results instead of reporting unavailable analysis.
6. **No access control or durable records:** browser-only state is neither secure nor reliable for authenticated investigations or report retrieval.
7. **No evidence provenance:** displayed snippets and sources are sample content; findings cannot be traced to collected material.
8. **No upload security:** browser-only image handling has no size/type checks or server-side storage controls.
9. **Prototype residue:** backup/alternate files are committed, and generic project documentation does not explain the actual UI or workflow.

## Recommended target architecture

Keep the existing Next.js UI and add a typed server-side investigation boundary. Normalize and validate platform-specific identifiers before creating an investigation. Store investigation state and provenance-bearing evidence in a persistence layer with ownership checks. Use only permitted collection paths; when a platform does not permit automated access, clearly mark collection unavailable and accept explicitly user-provided evidence.

Use a lightweight typed orchestrator rather than adding a graph framework by default. It should call only agents whose required evidence is present, isolate failures, record status/errors, and pass structured evidence references to an evidence-verification step before report generation. Keep AI provider credentials server-side and use a configurable provider abstraction. Findings should describe observable evidence and limitations; omit arbitrary overall trust, authenticity, criminality, or mental-health scores.

The suitable persistence, authentication, queue, and deployment choices remain open pending a closer compatibility review during implementation. Avoid adding a database or long-running worker until the chosen execution and hosting constraints are confirmed.

## Technology assessment

- **Retain:** Next.js App Router, React, TypeScript, Tailwind, existing UI components and styling.
- **API boundary:** Next.js route handlers are a reasonable first option for validation and short requests; long-running collection/analysis may require a separate worker after actual task duration and host limits are assessed.
- **Agent orchestration:** start with small typed modules and explicit orchestration; introduce LangGraph only if the workflow needs durable graph state, branching, or resumability that the simpler implementation cannot provide.
- **AI:** make provider/model configurable on the server; return explicit unavailable/error states instead of synthetic outputs. A provider is not yet selected because there is no valid environment configuration or product requirement proving which account/provider is available.
- **Persistence/authentication:** not configured. Select only after checking deployment target, ownership requirements, migration workflow, and available credentials; no account-dependent integration should be assumed.
- **Testing:** add focused unit/integration tests alongside the first backend modules and define scripts then. No tests were run as part of this read-only audit.

## Implementation roadmap

1. **Audit baseline (complete):** record existing architecture, behavior, gaps, and risks before implementation.
2. **Secure foundation:** remove the exposed credential from application source, document required rotation, establish safe environment configuration, and introduce shared typed models and Instagram/LinkedIn input normalization.
3. **Evidence-first collection:** add platform-specific collection adapters that report source/method/availability and never bypass restrictions; support validated user-provided evidence when automated collection is unavailable.
4. **Persistence and access control:** choose and configure storage/auth compatible with deployment; enforce per-user investigation and report ownership.
5. **Analysis modules and orchestration:** implement independently typed agents, conditional execution, failure isolation, evidence verification, and structured reports without unsupported scores or sensitive inferences.
6. **UI integration:** connect the existing scan, progress, and results visual design to real backend state, source attribution, limitations, and failure states.
7. **Quality and deployment:** add tests, run lint/type/build checks at milestones, prepare environment/migration/health/deployment documentation, and verify deployment only when credentials and approval are available.

## Audit scope and limitations

This audit is based on tracked files, package configuration, Git state, and targeted source inspection. No application behavior was executed, no external API credentials were tested, and no deployment or network collection was attempted. The descriptions above distinguish code that exists from marketing copy and simulated UI behavior.
