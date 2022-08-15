import { redirect } from "@remix-run/cloudflare";
import { getSession } from "./sessions.server";

interface NotLoggedInResponse {
  loggedIn: false;
}

interface User {
  id: string;
  username: string;
  discriminator: string;
  avatar: string | null;
  accent_color?: string | null;
  staff: boolean;
}

interface LoggedInResponse extends User {
  loggedIn: true;
}

type GetUserResponse = LoggedInResponse | NotLoggedInResponse;

async function _getUser({
  request,
}: {
  request: Request;
}): Promise<User | null> {
  // pass the _HOST-session cookie
  const cookie = request.headers.get("Cookie") ?? "";
  const session = await getSession(cookie);
  const token = session.get("token");

  if (!token) {
    // Do something about unauthroized
    return null;
  }

  const user = await fetch("http://localhost:4000/v1/users/@me", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
  });

  if (user.status !== 200) {
    return null;
  }
  return (await user.json()) as User;
}

async function getUser({
  request,
}: {
  request: Request;
}): Promise<GetUserResponse> {
  const user = await _getUser({ request });

  if (!user) {
    return {
      loggedIn: false,
    };
  }

  return {
    ...user,
    loggedIn: true,
  };
}

async function requireUser({ request }: { request: Request }): Promise<User> {
  const user = await _getUser({ request });
  if (user === null) {
    // Throw a new redirect and redirect them to login
    // Also get the current url of the user before redirecting
    const url = new URL(request.url);
    // Check if searchparams include from_logout=true if then use '/' instead of url.pathname
    const fromLogout = url.searchParams.get("from_logout");
    const redirectTo = fromLogout ? "/" : url.pathname;
    console.log(redirectTo);

    throw redirect(
      `/auth/login?redirect_url=${encodeURIComponent(redirectTo)}`
    );
  }
  return user;
}

export { getUser, requireUser };
export type { GetUserResponse, User, LoggedInResponse };
