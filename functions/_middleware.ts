import sentryPlugin from "@cloudflare/pages-plugin-sentry";

// Uses the sentry plugin to log server side (workers) errors to sentry
// This is done via a cloudflare plugin instead of directly as knowing when to log errors is easier this way (it doesn't happen in development with plugins)
export const onRequest: PagesFunction<{
  SENTRY_DSN: string;
}> = (context) => {
  return sentryPlugin({ dsn: context.env.SENTRY_DSN })(context);
};
