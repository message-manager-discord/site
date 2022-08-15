import { json } from "@remix-run/cloudflare";
import type {
  MetaFunction,
  LinksFunction,
  LoaderFunction,
} from "@remix-run/cloudflare";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import { withSentry } from "@sentry/remix";

// skipcq: JS-E1010
import styles from "./styles/app.css";
// skipcq: JS-E1010
import Footer from "./components/footer";
// skipcq: JS-E1010
import Navbar from "./components/navbar";

// No idea why deepsource is doing this, but it is

import { getUser } from "./lib/user.server";
import type { GetUserResponse } from "./lib/user.server";

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];

export const meta: MetaFunction = ({ location }) => ({
  charset: "utf-8",
  title: "Message Manager",
  viewport: "width=device-width,initial-scale=1",
  description:
    "Message Manager is a utility discord bot, making the management of important messages easier.",
  "og:title": "Message Manager Bot",
  "og:site_name": "Message Manager Bot",
  "og:description":
    "Message Manager is a utility discord bot, making the management of important messages easier.",
  "og:type": "website",
  "og:image": "/img/avatar.png",
  "og:url": `https://message.anothercat.me/${location.pathname}`,
});

export const loader: LoaderFunction = async ({ request }) => {
  return json<GetUserResponse>(await getUser({ request }));
};

function Document({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <div className="flex min-h-screen flex-col items-center bg-white dark:bg-slate-800">
          {children}
          <ScrollRestoration />
          <Scripts />
          <LiveReload />
        </div>
      </body>
    </html>
  );
}

function App() {
  const user = useLoaderData<GetUserResponse>();

  return (
    <Document>
      <Navbar user={user} />
      <div className="grow w-full flex flex-col">
        <Outlet />
      </div>
      <Footer />
    </Document>
  );
}
// Export error boundary function
export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <Document>
      <h1>Something went wrong</h1>
      <pre>{error.message}</pre>
    </Document>
  );
}
export default withSentry(App, {
  errorBoundaryOptions: {
    fallback: ErrorBoundary,
  },
});
