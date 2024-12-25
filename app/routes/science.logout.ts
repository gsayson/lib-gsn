import type {Route} from "../../.react-router/types/app/routes/+types/science.logout";
import {destroySession, getSession} from "~/server/session";
import {redirect} from "react-router";

export async function action({request}: Route.ActionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  return redirect("/auth", {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
}