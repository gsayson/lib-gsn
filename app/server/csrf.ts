import { CSRF } from "remix-utils/csrf/server";
import { createCookie } from "react-router"; // or cloudflare/deno

export const csrfCookie = createCookie("csrf", {
  path: "/",
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  secrets: [process.env.CSRF_SECRET!],
});

export const csrf = new CSRF({
  cookie: csrfCookie,
  formDataKey: "csrf",
  secret: process.env.CSRF_SECRET!,
});