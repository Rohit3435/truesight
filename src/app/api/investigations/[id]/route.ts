import { getInvestigation, getSessionUser, sessionToken } from "../../../../lib/database.ts";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const user = await getSessionUser(sessionToken(request));
  if (!user) return Response.json({ error: "Sign in required." }, { status: 401 });
  const report = await getInvestigation(user.id, params.id);
  return report ? Response.json({ report }) : Response.json({ error: "Investigation not found." }, { status: 404 });
}
