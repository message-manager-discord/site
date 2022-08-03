import type { MetaFunction, LinksFunction } from "@remix-run/cloudflare";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { withSentry } from "@sentry/remix";

// skipcq: JS-E1010
import styles from "./styles/app.css";
// skipcq: JS-E1010
import Footer from "./components/footer";
// skipcq: JS-E1010
import Navbar from "./components/navbar";
// No idea why deepsource is doing this, but it is

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

function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <div className="flex min-h-screen flex-col items-center bg-white dark:bg-slate-800">
          <Navbar />
          <div className="grow w-full">
            <Outlet />
          </div>
          <Footer />
          <ScrollRestoration />
          <Scripts />
          <LiveReload />
        </div>
      </body>
    </html>
  );
}

export default withSentry(App);
