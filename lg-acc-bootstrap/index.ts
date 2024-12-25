// Account generator for bootstrap.

import {configDotenv} from "dotenv";
import postgres from "postgres";
import {hash} from "argon2";
import {input, password, confirm} from "@inquirer/prompts";

configDotenv();

const username = await input({
  default: "admin",
  required: true,
  message: "What is the username for the new account?"
});
const pw = await password({
  message: "What is the password for the new account?",
  mask: true,
})
const pwc = await password({
  message: "Please confirm your password",
  mask: true,
})
if(pw != pwc) {
  console.log("You typed your password wrong. Terminating.");
  process.exit(1);
}
const isAdmin = await confirm({
  message: "Shall this account have administrator privileges?"
})
export const sql = postgres(process.env.DATABASE_URL!, {ssl: 'require'});
await sql`INSERT INTO lg_accounts (name, argon2, admin) VALUES (${username}, ${await hash(pw)}, ${isAdmin})`;
console.log("Success.")
process.exit(0);