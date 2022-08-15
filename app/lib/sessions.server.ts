import { createCookieSessionStorage } from "@remix-run/cloudflare";

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage({
    cookie: {
      name: "__HOST-session",

      path: "/",

      maxAge: 60 * 60 * 24 * 7, // 1 week
      secure: true,
      httpOnly: true,
      sameSite: "lax",
    },
  });

export { getSession, commitSession, destroySession };
