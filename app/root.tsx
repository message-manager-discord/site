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
import BaseCatchBoundary from "~/components/CatchBoundary";
import acceptLanguage from "accept-language-parser";

// skipcq: JS-E1010
import styles from "./styles/app.css";
// skipcq: JS-E1010
import Footer from "./components/footer";
// skipcq: JS-E1010
import Navbar from "./components/navbar";

// No idea why deepsource is doing this, but it is

import { getUser } from "./lib/user.server";
import type { GetUserResponse } from "./lib/user.server";
import { LocaleProvider } from "./hooks/useLocale";
import { UserProvider } from "./hooks/useUser";

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

interface LoaderData {
  user: GetUserResponse;
  locale: string;
}

export const loader: LoaderFunction = async ({ request }) => {
  let locale: string | undefined = undefined;
  const languages = acceptLanguage.parse(
    request.headers.get("Accept-Language") as string
  );

  // If somehow the header is empty, return a default locale
  if (languages?.length < 1) locale = "en-us";
  // If there is no region for this locale, just return the code
  else if (!languages[0].region) locale = languages[0].code;
  else locale = `${languages[0].code}-${languages[0].region.toLowerCase()}`;
  return json<LoaderData>({
    user: await getUser({ request }),
    locale,
  });
};

function Document({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <div className="flex min-h-screen flex-col items-center bg-white dark:bg-slate-800 text-slate-800 dark:text-indigo-50">
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
  const data = useLoaderData<LoaderData>();
  return (
    <Document>
      <LocaleProvider locale={data.locale}>
        <UserProvider user={data.user}>
          <Navbar user={data.user} />
          <div className="grow w-full flex flex-col">
            <Outlet />
          </div>
          <Footer />
        </UserProvider>
      </LocaleProvider>
    </Document>
  );
}
// Export error boundary function
export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <Document>
      <div className="bg-red-100 text-red-500 flex min-h-screen flex-col items-center w-full justify-around">
        <div className="flex flex-col items-center justify-between">
          <p className="text-5xl font-bold p-2">500</p>

          <p className="text-xl font-bold p-2">
            This seems unexpected :( We're already working on it
          </p>

          <p className="p-2">{error.message}</p>
        </div>
      </div>
    </Document>
  );
}

export function CatchBoundary() {
  <Document>
    <BaseCatchBoundary />
  </Document>;
}
export default withSentry(App, {
  errorBoundaryOptions: {
    fallback: ErrorBoundary,
  },
});
