// Entry point for the client bundle
// Sentry is registered here so that it can catch errors in the client
import { RemixBrowser, useLocation, useMatches } from "@remix-run/react";
import { hydrate } from "react-dom";

import {
  init as SentryInit,
  BrowserTracing,
  remixRouterInstrumentation,
} from "@sentry/remix";
import { useEffect } from "react";

hydrate(<RemixBrowser />, document);
SentryInit({
  dsn: "https://f8067990d1364c54bdb55f50277f8d36@o917214.ingest.sentry.io/5990676",
  tracesSampleRate: 1,
  integrations: [
    new BrowserTracing({
      routingInstrumentation: remixRouterInstrumentation(
        useEffect,
        useLocation,
        useMatches
      ),
    }),
  ],
  enabled:
    document.location.hostname.includes("message.anothercat.me") ||
    document.location.hostname.includes("message-manager-site.pages.dev") ||
    document.location.hostname.includes("localhost"),
  // ...
});
