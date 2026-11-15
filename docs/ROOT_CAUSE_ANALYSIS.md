# Root cause analysis

## Audited request path

The scan form posts `FormData` to `POST /api/investigations`. That route validates the platform and profile identifier, creates user supplied evidence, then invokes one platform collector and the agent orchestrator. The result page reads a copy of the returned report from `sessionStorage`.

## Confirmed causes

1. **Automatic collection was not implemented.** `InstagramCollector.collect` and `LinkedInCollector.collect` always returned `status: unavailable`, `method: none`, and a static missing-provider limitation. Neither accepted credentials or made a provider request.
2. **Evidence-only validation blocked automatic mode.** The route returned HTTP 400 when both evidence text and image were empty, before calling either collector. The scan form duplicated this restriction in its submit handler, so a username alone never reached the backend.
3. **The report mislabeled collection results.** After collection returned unavailable, the route discarded the attempted collection's status and method by mapping `method: none` to `user_provided` and setting `collectionStatus` to `evidence_provided`. It also omitted the collector's evidence entirely.
4. **Agents were evidence-gated, not universally skipped.** The orchestrator correctly executes agents with matching inputs and isolates failures. With the form's required evidence, several agents could run; without any evidence, they are legitimately skipped. An unavailable collector could never provide agent inputs.
5. **Authentication was a visual stub.** The login form's submit handler redirected to `/scan`; inputs had no state or names, signup redirected to login, and there were no auth routes, middleware, session store, or protected API checks.
6. **Investigations were not persisted.** The API returned a report directly and the browser stored it in tab-scoped `sessionStorage`. There was no database or ownership model, and refresh/new tab did not provide durable history.
7. **AI was conditional and not live verified.** Gemini/Groq/Ollama adapters existed, but model observations require explicit external-provider consent and configured server credentials. No configured key was present in the inspected environment; deterministic evidence agents can still run without a model.
8. **Progress was not backend-driven.** The scanning route explicitly rendered “No analysis is running”; the scan page waited for the single synchronous request and then navigated directly to results.

## Exact `hr__rohit` failure

The text `About person` is non-empty, so the old route accepted it as user supplied `profile`-kind evidence and called the Instagram collector. That collector returned unavailable. The route then rewrote the report metadata to “evidence provided / user provided,” retained only the manually supplied evidence, and ran whichever evidence agents applied. Since the text contains no meaningful profile fields, the generated observations were absent or generic. The username was normalized correctly, but no profile fetch occurred. With empty text, the frontend rejected submission before making a request.

## Runtime reproduction and follow-up correction

The local `.data/truesight.json` contained a saved `hr__rohit` Instagram report with one user-provided `education` item, zero findings, and an old `completed` status. Its agent outputs showed Profile, Content, Professional, and Toxicity skipped. This matches the old gates: Profile only accepted `profile`, Content and Toxicity only accepted `caption`, and Professional additionally required the platform to be LinkedIn. Therefore an Instagram education/skills item was accepted by the route but eligible for no evidence specialist. The generic route status marked any nonempty evidence completed regardless of findings.

That saved record was evidence-only (`collectionStatus: evidence_provided`, `collectionMethod: user_provided`), so its metadata did not prove that a collection call occurred. `.env` was absent during runtime inspection. A fresh automatic/combined attempt consequently has no Meta token/account ID and must record the provider as not called for missing configuration. An evidence-only request must say collection was not requested, never report that a provider failed or succeeded.

The follow-up fix makes Professional Intelligence execute for professional evidence on either platform and explicitly report when a label such as “skills” contains no specific claim. Content Intelligence runs on all non-image text; toxicity classification runs on analyzable text only when both external consent and a configured classifier exist. No-finding reports now have an overall `blocked` status, and report-generation is skipped when there are no evidence-backed observations. Reports include the provider name, whether it was called, its response, collected/unavailable data, failure reason, and next action. Legacy empty “completed” reports are normalized to `blocked` when read.

The exact browser reproduction posts `hr__rohit` + Instagram + `skills` + `About person` + external-provider consent. It returns a source-linked insufficiency observation, runs the professional and text agents, reports Meta collection as not called because credentials are missing, skips model agents because their credentials are absent, and marks the result `partially_completed`. With username only and no provider credentials, the result has zero findings and is explicitly `blocked`.

## Configuration and persistence findings

- `.env.example` documents AI and optional reputation provider keys. No Instagram, LinkedIn, authentication, or database configuration exists.
- No database client, schema, auth provider, middleware, or login/signup API route exists.
- No environment variable matching the configured AI/platform/database providers was present in the process environment during the audit. This only establishes process environment state, not whether ignored local files or hosted secrets exist.
- `.env` was absent during the later runtime reproduction. Gemini and Hugging Face therefore made no live request. Google's official model documentation currently lists the configured default Gemini ID as stable with structured output support, but the project key/account and a live request remain unverified.
- Instagram and LinkedIn restrict arbitrary profile access. Collection must use a configured, authorized provider and must report provider/API denial, unsupported target scope, or missing credentials without attempting login-wall scraping.

## Implementation implications

The scan request must represent automatic, evidence-only, and combined modes; automatic attempts must occur even with no user evidence. Collector errors and partial evidence must flow into the report without being rewritten. Auth/database integration needs external provider configuration for deployable multi-user persistence; no credentials or database URL are present, so that remains a setup blocker unless an existing service is supplied through environment configuration.
