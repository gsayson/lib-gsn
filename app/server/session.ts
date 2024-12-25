import {encodeBase32LowerCaseNoPadding, encodeHexLowerCase} from "@oslojs/encoding";
import {sha3_256} from "@oslojs/crypto/sha3";
import {sql} from "~/server/data-sources";
import {createCookieSessionStorage, redirect, type Session as RemixSession, type SessionData} from "react-router";

/**
 * The result of validating a session. It is always either the case that both `session` and `user` are not `null`,
 * or both are `null`.
 */
export type SessionValidationResult = { session: Session; user: User } | { session: null; user: null };

export interface Session {
  id: string,
  userId: number,
  expiresAt: Date
}

export const NULL_SVR: SessionValidationResult = {session: null, user: null};

export interface User {
  uid: number,
  name: string,
  admin: boolean,
}

/**
 * Generates a session token. **This is hashed on the server.**
 * @return string - The **raw** token value.
 */
export function generateSessionToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return encodeBase32LowerCaseNoPadding(bytes);
}

function sessionIdFromToken(token: string): string {
  return encodeHexLowerCase(sha3_256(new TextEncoder().encode(token)))
}

/**
 * Creates a session based on the given **raw** token, and the owning user's ID.
 * The session ID is simply a SHA3-256 hash of the raw token.
 * @param token - The raw token value.
 * @param uid - The session holder's user ID.
 */
export async function createSession(token: string, uid: number): Promise<Session> {
  const sessionId = sessionIdFromToken(token);
  const session: Session = {
    id: sessionId,
    userId: uid,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60) // expire in 1 hour, file upload is a sensitive operation
  };
  await sql`INSERT INTO lg_sessions (id, user_id, expires_at) VALUES (${session.id}, ${session.userId}, ${session.expiresAt})`;
  return session;
}

export async function validateSessionToken(token: string): Promise<SessionValidationResult> {
  const sessionId = sessionIdFromToken(token);
  const sessionQuery = await sql`SELECT * FROM lg_sessions INNER JOIN lg_accounts ON lg_sessions.user_id = lg_accounts.uid WHERE id = ${sessionId}`;
  if(sessionQuery.length == 0) {
    // no such session
    return NULL_SVR;
  }
  // from now onwards we take sessionQuery != undefined
  const session = {
    id: sessionQuery[0].id,
    userId: sessionQuery[0].user_id,
    expiresAt: sessionQuery[0].expires_at
  }
  const user = {
    uid: sessionQuery[0].uid,
    name: sessionQuery[0].name,
    admin: sessionQuery[0].admin,
  }
  // check expiry
  if(Date.now() >= session.expiresAt) {
    await invalidateSession(sessionId);
    return NULL_SVR;
  }
  // refresh
  if(Date.now() >= session.expiresAt.getTime() - 1000 * 60 * 30) {
    session.expiresAt = new Date(Date.now() + 1000 * 60 * 60);
    await sql`UPDATE lg_sessions SET expires_at = ${session.expiresAt} WHERE id = ${session.id}`;
  }
  return {session, user};
}

export async function invalidateSession(sessionId: string): Promise<void> {
  await sql`DELETE
            FROM lg_sessions
            WHERE id = ${sessionId}`;
}

// Use a Remix cookie storage so we can store stuff like error messages without checking into the DB.
export const { getSession, commitSession, destroySession } = createCookieSessionStorage({
  cookie: {
    name: "_session",
    secure: true,
    sameSite: "strict",
    httpOnly: true,
    secrets: [process.env.COOKIE_SIGN!]
  }
});

export const SESSION_TOKEN_KEY = "session";

export async function validateSessionObject(session: RemixSession): Promise<SessionValidationResult> {
  const sessionId: string = session.get(SESSION_TOKEN_KEY);
  return sessionId ? await validateSessionToken(sessionId) : NULL_SVR;
}

export async function redirectionWithCookie(path: string, session: RemixSession<SessionData, SessionData>) {
  return redirect(path, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}