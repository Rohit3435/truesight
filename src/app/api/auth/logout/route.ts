import { removeSession, sessionCookie, sessionToken } from "../../../../lib/database.ts";

export async function POST(request: Request) {
  await removeSession(sessionToken(request));
  return Response.json({ ok: true }, { headers: { "Set-Cookie": sessionCookie("", 0) } });
}
