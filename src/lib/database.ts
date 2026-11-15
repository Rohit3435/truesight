import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomBytes, randomUUID, scrypt as scryptCallback, timingSafeEqual, createHash } from "node:crypto";
import { promisify } from "node:util";
import type { InvestigationReport } from "./investigation/types.ts";

const scrypt = promisify(scryptCallback);
const DB_DIR = path.join(process.cwd(), ".data");
const DB_FILE = path.join(DB_DIR, "truesight.json");
const COOKIE_NAME = "truesight_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 14;

interface User { id: string; email: string; name: string; passwordHash: string; createdAt: string }
interface Session { idHash: string; userId: string; expiresAt: number }
interface StoredInvestigation { userId: string; report: InvestigationReport }
interface DatabaseState { users: User[]; sessions: Session[]; investigations: StoredInvestigation[] }

let writeQueue: Promise<unknown> = Promise.resolve();

async function readState(): Promise<DatabaseState> {
  try { return JSON.parse(await readFile(DB_FILE, "utf8")) as DatabaseState; }
  catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    return { users: [], sessions: [], investigations: [] };
  }
}

/** The local JSON store gives the single-instance development server durable state without a service dependency. */
async function updateState<T>(operation: (state: DatabaseState) => T | Promise<T>): Promise<T> {
  const task = writeQueue.then(async () => {
    await mkdir(DB_DIR, { recursive: true });
    const state = await readState();
    const result = await operation(state);
    const temporary = `${DB_FILE}.${randomUUID()}.tmp`;
    await writeFile(temporary, JSON.stringify(state), { mode: 0o600 });
    await rename(temporary, DB_FILE);
    return result;
  });
  writeQueue = task.catch(() => undefined);
  return task;
}

export class AuthError extends Error {
  readonly status: number;
  constructor(message: string, status = 400) { super(message); this.status = status; this.name = "AuthError"; }
}

export async function registerUser(emailValue: string, password: string, nameValue: string) {
  const email = emailValue.trim().toLowerCase();
  const name = nameValue.trim().slice(0, 100);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new AuthError("Enter a valid email address.");
  if (password.length < 10 || password.length > 128) throw new AuthError("Password must be between 10 and 128 characters.");
  if (!/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) throw new AuthError("Password must include lowercase, uppercase, and numeric characters.");
  if (!name) throw new AuthError("Enter your name.");
  const salt = randomBytes(16).toString("hex");
  const derived = await scrypt(password, salt, 64) as Buffer;
  const passwordHash = `scrypt$${salt}$${derived.toString("hex")}`;
  const user = await updateState((state) => {
    if (state.users.some((item) => item.email === email)) throw new AuthError("An account with this email already exists.", 409);
    const created: User = { id: randomUUID(), email, name, passwordHash, createdAt: new Date().toISOString() };
    state.users.push(created);
    return { id: created.id, email: created.email, name: created.name };
  });
  return user;
}

export async function createSession(emailValue: string, password: string): Promise<{ token: string; user: { id: string; email: string; name: string } }> {
  const email = emailValue.trim().toLowerCase();
  const state = await readState();
  const user = state.users.find((item) => item.email === email);
  if (!user) throw new AuthError("Email or password is incorrect.", 401);
  const [, salt, expectedHex] = user.passwordHash.split("$");
  const actual = await scrypt(password, salt, 64) as Buffer;
  const expected = Buffer.from(expectedHex, "hex");
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) throw new AuthError("Email or password is incorrect.", 401);
  const token = randomBytes(32).toString("base64url");
  const idHash = createHash("sha256").update(token).digest("hex");
  await updateState((data) => {
    data.sessions = data.sessions.filter((session) => session.expiresAt > Date.now());
    data.sessions.push({ idHash, userId: user.id, expiresAt: Date.now() + SESSION_TTL_MS });
  });
  return { token, user: { id: user.id, email: user.email, name: user.name } };
}

export async function getSessionUser(token?: string | null) {
  if (!token) return null;
  const idHash = createHash("sha256").update(token).digest("hex");
  const state = await readState();
  const session = state.sessions.find((item) => item.idHash === idHash && item.expiresAt > Date.now());
  const user = session && state.users.find((item) => item.id === session.userId);
  return user ? { id: user.id, email: user.email, name: user.name } : null;
}

export async function removeSession(token?: string | null) {
  if (!token) return;
  const idHash = createHash("sha256").update(token).digest("hex");
  await updateState((state) => { state.sessions = state.sessions.filter((session) => session.idHash !== idHash); });
}

export function sessionCookie(token: string, maxAge = SESSION_TTL_MS / 1000) {
  return `${COOKIE_NAME}=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${maxAge}${process.env.NODE_ENV === "production" ? "; Secure" : ""}`;
}

export function sessionToken(request: Request): string | null {
  const cookie = request.headers.get("cookie") ?? "";
  const entry = cookie.split(";").map((part) => part.trim()).find((part) => part.startsWith(`${COOKIE_NAME}=`));
  return entry ? decodeURIComponent(entry.slice(COOKIE_NAME.length + 1)) : null;
}

export async function saveInvestigation(userId: string, report: InvestigationReport) {
  await updateState((state) => {
    state.investigations = state.investigations.filter((item) => item.report.investigationId !== report.investigationId);
    state.investigations.push({ userId, report });
  });
}

export async function getInvestigation(userId: string, id: string) {
  const item = (await readState()).investigations.find((entry) => entry.userId === userId && entry.report.investigationId === id);
  return item?.report ?? null;
}

export async function listInvestigations(userId: string) {
  return (await readState()).investigations.filter((entry) => entry.userId === userId).map((entry) => entry.report).sort((a, b) => b.generatedAt.localeCompare(a.generatedAt));
}

export const sessionCookieName = COOKIE_NAME;
