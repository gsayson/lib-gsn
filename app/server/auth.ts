import {sql} from "~/server/data-sources";
import type {User} from "~/server/session";
import {verify} from "argon2";

export async function validateCredentials(username: string, password: string): Promise<User | null> {
  const data = (await sql`SELECT * FROM lg_accounts WHERE name = ${username}`)[0] as {
    // true User structure as stored in db
    uid: number,
    name: string,
    argon2: string,
    admin: boolean
  } | null;
  if(!data) return null; // no user exists
  return await verify(data.argon2, password) ? {
    uid: data.uid,
    name: data.name,
    admin: data.admin
  } : null;
}