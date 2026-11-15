# LinkedIn data flow

The scan route accepts a LinkedIn public identifier or a URL in `/in/{identifier}` form and normalizes it to HTTPS. Automatic and combined modes invoke the LinkedIn collector. The collector records that arbitrary target lookup is unavailable: standard LinkedIn member OAuth APIs expose the consenting member's own authorized data and do not grant a general public-profile search by URL. A token alone is therefore not treated as permission to collect the submitted target.

No LinkedIn page scraping, login-wall access, or browser automation is used. For an authorized investigation, provide profile text, professional details, screenshots, or an account export through evidence or combined mode. Those records are labeled as user provided; their accuracy is not independently asserted. A future LinkedIn integration requires a specific approved product/API permission that covers target data, plus documented consent and field scope.
