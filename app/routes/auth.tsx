import {Alert, Button, Form, Input} from "@heroui/react";
import {type FormEvent, useState} from "react";
import {EyeOpenIcon, EyeClosedIcon} from "@radix-ui/react-icons";
import {AuthenticityTokenInput} from "remix-utils/csrf/react";
import type {Route} from "../../.react-router/types/app/routes/+types/portal";
import {
  commitSession, createSession,
  generateSessionToken,
  getSession,
  NULL_SVR,
  redirectionWithCookie, SESSION_TOKEN_KEY,
  validateSessionObject,
} from "~/server/session";
import {data, redirect, useLoaderData} from "react-router";
import {validateCredentials} from "~/server/auth";

export function meta() {
  return [
    { title: "LibGSN" },
    { name: "description", content: "Gerard Sayson's repository of notes." },
  ];
}

export async function loader({request}: Route.LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  // check if we're already authenticated
  if(NULL_SVR !== (await validateSessionObject(session))) {
    return redirect("/portal");
  }
  return data({ error: session.get("error") }, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

export async function action({request}: Route.ActionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const form = await request.formData();
  const username = form.get("username") as string | null;
  const password = form.get("password") as string | null;
  if(!username || !password) {
    session.flash("error", "Missing username or password");
    return redirectionWithCookie("/auth", session);
  }
  const user = await validateCredentials(
    username,
    password
  );
  if(user == null) {
    session.flash("error", "Invalid username/password");
    return redirectionWithCookie("/auth", session);
  }
  // auth is success
  // generate sessionId
  const token = generateSessionToken();
  await createSession(token, user.uid)
  session.set(SESSION_TOKEN_KEY, token);
  return redirectionWithCookie("/portal", session);
}

export default function Authentication() {
  const {error} = useLoaderData<typeof loader>() as {error: any}; // it cannot be the other type, else we wouldn't be here
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);
  return (
    <main className="flex items-center justify-center pt-16 pb-4 gap-16 min-h-0">
      <section className="w-full px-4 max-w-md">
        <h1 className="text-4xl mb-4 font-bold">Portal login</h1>
        <Form className="gap-4" validationBehavior="native" method="post">
          <Input
            isRequired
            label="Username"
            labelPlacement="outside"
            name="username"
            placeholder="Enter your username"
            variant="bordered"
          />
          <Input
            isRequired
            endContent={
              <button type="button" onClick={toggleVisibility}>
                {isVisible ? (
                  <EyeOpenIcon/>
                ) : (
                  <EyeClosedIcon/>
                )}
              </button>
            }
            label="Password"
            labelPlacement="outside"
            name="password"
            placeholder="Enter your password"
            type={isVisible ? "text" : "password"}
            variant="bordered"
          />
          <Alert
            description={"If you would like to publish notes, contact Gerard for further details"}
            title={"You cannot register for an account here"}
          />
          <AuthenticityTokenInput/>
          {error && <p className="text-sm text-danger">{error}</p>}
          <Button className="w-full font-bold" color="primary" type="submit">
            Log in
          </Button>
        </Form>
      </section>
    </main>
  );
}