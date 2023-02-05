import { redirect } from "@remix-run/cloudflare";
import type { LoaderFunction } from "@remix-run/cloudflare";
import { loginSession } from "~/lib/sessions.server";

export const loader: LoaderFunction = async ({ request, context }) => {
  // Callback for discord oauth redirect
  // Forward the request to the api
  const response = await fetch(
    `${context.API_BASE_URL}/auth/callback?${new URLSearchParams(
      request.url.split("?")[1]
    )}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  // Possible status are: Forbidden, or 200 with setCookie and redirectUrl in json body
  // If 200, we need to grab the cookie from the set cookie header and then redirect to the redirectUrl

  if (response.status === 200) {
    const data = (await response.json()) as {
      redirectUrl: string | undefined;
      token: string;
    };

    const redirectUrl = data.redirectUrl ?? "/";
    const session = await loginSession.getSession(
      request.headers.get("Cookie")
    );
    session.set("token", data.token);
    const cookieHeader = await loginSession.commitSession(session);

    return redirect(redirectUrl, {
      headers: {
        "Set-Cookie": cookieHeader,
      },
    });
  }
  // if forbidden redirect to error page with error message in querystring
  else {
    // get error and message from body

    const data = (await response.json()) as { error: string; message: string };
    return redirect(
      `/auth/error?error=${data.message}&errorName=${data.error}`
    );
  }
};
