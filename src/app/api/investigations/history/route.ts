import { getSessionUser, listInvestigations, sessionToken } from "../../../../lib/database.ts";

export async function GET(request: Request) {
  const user = await getSessionUser(sessionToken(request));
  if (!user) return Response.json({ error: "Sign in required." }, { status: 401 });
  return Response.json({ investigations: await listInvestigations(user.id) });
}
