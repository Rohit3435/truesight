# Report generation and access

The investigation endpoint normalizes input, attempts the selected platform collection path, merges only the evidence allowed by the selected mode, runs applicable agents, and assembles an `InvestigationReport`. Collection method, outcome, provider attempt/response, missing configuration, data collected/unavailable, next action, evidence source labels, timestamps, agent statuses, status history, and evidence-linked findings are retained. An automatic run with no evidence is `blocked` with a concrete limitation and zero findings, never a fabricated success.

Reports are persisted by user ID in `.data/truesight.json`. `/api/investigations/history` lists only the current user's reports, and `/api/investigations/{id}` retrieves a report only when it belongs to that user. The browser results page uses the investigation ID in its URL and retrieves the saved report after refresh. Images are used for the request and model analysis but their base64 payload is not placed in the report store.

The scanning endpoint currently runs synchronously and returns after collection and analysis; it does not provide streaming or background job progress. The legacy `/scanning` page does not report fake activity. This project does not yet implement external URL reputation polling or exportable reports.
