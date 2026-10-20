import * as env from "$app/env/private";
import { createIngestEndpoint, type SubmissionPayload } from "@reddoorla/maintenance/forms";
import type { RequestHandler } from "./$types";

// POST-only ingest endpoint; never prerendered.
export const prerender = false;

const str = (v: unknown): string | undefined => (typeof v === "string" ? v : undefined);

// `subject` is a non-standard key, so it folds into extraFields and renders in
// the notification email. The client sends formType: "contact".
export const POST: RequestHandler = createIngestEndpoint({
  getConfig: () => ({ url: env.FORMS_INGEST_URL, token: env.FORMS_INGEST_TOKEN }),
  buildPayload: (body): SubmissionPayload => ({
    formType: "contact",
    name: str(body.name),
    email: str(body.email),
    message: str(body.message),
    subject: str(body.subject),
    sourceUrl: str(body.sourceUrl),
    // The fleet form-e2e probe's marker. Central ingest drops a payload with
    // top-level `testMode: true` (no row, no email); /health declares it.
    ...(body.testMode === "true" ? { testMode: true } : {}),
  }),
});
