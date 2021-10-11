import useSWR from "swr";
import fetch from "unfetch";
import { RESTGetAPICurrentUserResult } from "discord-api-types/v9";

export interface StoredUserData extends RESTGetAPICurrentUserResult {
  staff: boolean;
}

class CustomResponseError extends Error {
  status: number;
  constructor(status: number) {
    super();
    this.status = status;
  }
}

const fetcher = (url: string) =>
  fetch(url, { credentials: "include" }).then((r) => {
    if (r.ok && r.headers?.get("Content-Type") === "application/json") {
      return r.json() as Promise<StoredUserData>;
    } else {
      throw new CustomResponseError(r.status);
    }
  });

const fakeFetcher = async () => {
  // sleep 500
  await new Promise((res) => setTimeout(res, 500));

  return {
    staff: true,
    id: "684964314234618044",
    username: "anothercat",
    avatar: "a103e410f4e37e2eb091244fc45ad333",
    discriminator: "4247",
    public_flags: 256,
    flags: 256,
    banner: null,
    banner_color: "#aea5f2",
    accent_color: 11445746,
    locale: "en-GB",
    mfa_enabled: true,
  };

  // not authorized
  const error = new Error("Not authorized!");
  //error.status = 403;
  throw error;
};

export default function useUser() {
  const { data, mutate, error } = useSWR(
    `${process.env.NEXT_PUBLIC_AUTH_URL}/api/user`,
    fetcher,
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false, // The API returns an error when not logged in,
    },
  );

  const loading = !data && !error;

  const loggedOut = error && (error.status === 403 || error.status === 401);

  return {
    loading,
    loggedOut,
    user: data,
    mutate,
  };
}
