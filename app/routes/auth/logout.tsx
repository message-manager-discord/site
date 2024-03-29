import { redirect } from "@remix-run/cloudflare";
import type { LoaderFunction } from "@remix-run/cloudflare";
import { loginSession } from "~/lib/sessions.server";

export const loader: LoaderFunction = async ({ request }) => {
  const redirectUrl =
    new URLSearchParams(request.url.split("?")[1]).get("redirect_url") ?? "/";
  const session = await loginSession.getSession(request.headers.get("Cookie"));
  session.unset("token");
  const cookieHeader = await loginSession.commitSession(session);
  return redirect(redirectUrl, {
    headers: {
      "Set-Cookie": cookieHeader,
    },
  });
};
