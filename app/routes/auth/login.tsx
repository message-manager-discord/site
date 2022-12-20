import { redirect } from "@remix-run/cloudflare";
import type { LoaderFunction } from "@remix-run/cloudflare";

export const loader: LoaderFunction = async ({ request }) => {
  // First get user to see if they are logged in - if logged in then redirect to ?redirect_url
  // If not then call the api /auth/authorize to get a redirect url and then redirect to that url
  const redirectUrl =
    new URLSearchParams(request.url.split("?")[1]).get("redirect_url") ?? "/";

  const authorizeResponse = (await (
    await fetch(
      `http://localhost:4000/auth/authorize${
        redirectUrl ? `?redirect_url=${redirectUrl}` : ""
      }`
    )
  ).json()) as { redirectUrl: string };

  return redirect(authorizeResponse.redirectUrl);
};
