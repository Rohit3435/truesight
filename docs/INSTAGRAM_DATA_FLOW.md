# Instagram data flow

The scan route normalizes a username or one-segment Instagram profile URL. In automatic or combined mode, `InstagramCollector` attempts Meta Graph API Business Discovery using the server-only `INSTAGRAM_ACCESS_TOKEN` and `INSTAGRAM_BUSINESS_ACCOUNT_ID`. It requests the eligible target's username, name, biography, website, follower count, and up to 12 media captions, when Meta grants that scope. The token is sent as a bearer header and never returned in the report.

Each returned field/post becomes an `official_api` evidence record with its collection timestamp and source label. A missing token/account ID, HTTP/API rejection, timeout, or empty response is preserved as a collection limitation; it does not become a successful profile fetch. Evidence supplied by the user is separately labeled `user_provided`. The agent pipeline receives both sources only in combined mode.

Meta Business Discovery requires an eligible connected professional account and approved app permissions. It does not permit arbitrary private/login-restricted profile access and may not support a given target. Configure credentials in the ignored `.env` file based on `.env.example`. If access is unavailable, the report tells the user why and permits authorized text, screenshots, or exports as fallback evidence.
