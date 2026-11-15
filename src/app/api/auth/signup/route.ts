import { AuthError, createSession, registerUser, sessionCookie } from "../../../../lib/database.ts";

export async function POST(request: Request) {
  try {
    const body = await request.json() as { email?: string; password?: string; name?: string };
    if (typeof body.email !== "string" || typeof body.password !== "string" || typeof body.name !== "string") return Response.json({ error: "Enter your name, email, and password." }, { status: 400 });
    await registerUser(body.email, body.password, body.name);
    const session = await createSession(body.email, body.password);
    return Response.json({ user: session.user }, { status: 201, headers: { "Set-Cookie": sessionCookie(session.token) } });
  } catch (error) {
    const known = error instanceof AuthError;
    return Response.json({ error: known ? error.message : "Account could not be created." }, { status: known ? error.status : 500 });
  }
}
