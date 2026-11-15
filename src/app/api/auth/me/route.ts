import { getSessionUser, sessionToken } from "../../../../lib/database.ts";

export async function GET(request: Request) {
  const user = await getSessionUser(sessionToken(request));
  return user ? Response.json({ user }) : Response.json({ error: "Sign in required." }, { status: 401 });
}
