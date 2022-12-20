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

export { loginSession };
