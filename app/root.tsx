import {
  data,
  isRouteErrorResponse,
  Links, type LoaderFunctionArgs,
  Meta, type NavigateOptions,
  Outlet,
  Scripts,
  ScrollRestoration,
  useHref, useLoaderData,
  useNavigate,
} from "react-router";

import type { Route } from "./+types/root";
import stylesheet from "./app.css?url";
import React from "react";
import {HeroUIProvider} from "@heroui/react";
import {LGNavbar} from "~/components/pages";
import {csrf} from "~/server/csrf";
import {AuthenticityTokenProvider} from "remix-utils/csrf/react";

declare module "@react-types/shared" {
  // noinspection JSUnusedGlobalSymbols
  interface RouterConfig {
    routerOptions: NavigateOptions;
  }
}

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Manrope:wght@200..800&display=swap",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&display=swap",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&display=swap"
  },
  { rel: "stylesheet", href: stylesheet },
];

export async function loader({ request }: LoaderFunctionArgs) {
  let [token, cookieHeader] = await csrf.commitToken();
  // return json({ token }, { headers: { "set-cookie": cookieHeader } });
  return data({ token }, {
    headers: [["Set-Cookie", cookieHeader!]],
  })
}

export function Layout({ children }: { children: React.ReactNode }) {
  // noinspection HtmlRequiredTitleElement
  return (
    <html lang="en" className={"text-foreground bg-background"}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <LGNavbar/>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  let { token } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  return (
    <AuthenticityTokenProvider token={token}>
      <HeroUIProvider navigate={(to, routerOptions) => navigate(to, routerOptions)} useHref={useHref}>
        <Outlet/>
      </HeroUIProvider>
    </AuthenticityTokenProvider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
