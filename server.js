// skipcq: JS-C1003
import * as build from "@remix-run/dev/server-build";
import { createPagesFunctionHandler } from "@remix-run/cloudflare-pages";

const handleRequest = createPagesFunctionHandler({
  build,
  mode: process.env.NODE_ENV,
  getLoadContext: (context) => context.env,
});

// Handles the requests sent to the cloudflare workers
export function onRequest(context) {
  return handleRequest(context);
}
