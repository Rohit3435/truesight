import { AuthError, createSession, sessionCookie } from "../../../../lib/database.ts";

export async function POST(request: Request) {
  try {
    const body = await request.json() as { email?: string; password?: string };
    if (typeof body.email !== "string" || typeof body.password !== "string") return Response.json({ error: "Enter your email and password." }, { status: 400 });
    const session = await createSession(body.email, body.password);
    return Response.json({ user: session.user }, { headers: { "Set-Cookie": sessionCookie(session.token) } });
  } catch (error) {
    const known = error instanceof AuthError;
    return Response.json({ error: known ? error.message : "Sign in failed." }, { status: known ? error.status : 500 });
  }
}
