import { createCookieSessionStorage } from "@remix-run/cloudflare";

const loginSession = createCookieSessionStorage({
  cookie: {
    name: "__HOST-session",

    path: "/",

    maxAge: 60 * 60 * 24 * 7, // 1 week
    secure: true,
    httpOnly: true,
    sameSite: "lax",
  },
});

const userPreferences = createCookieSessionStorage({
  cookie: {
    name: "preferences",
    path: "/",
    maxAge: 60 * 60 * 24 * 365, // 1 year
    secure: true,
    httpOnly: false,
    sameSite: "lax",
  },
});

export { loginSession, userPreferences };
