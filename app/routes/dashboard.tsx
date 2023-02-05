import { json } from "@remix-run/cloudflare";
import type { LoaderFunction } from "@remix-run/cloudflare";
import { requireUser } from "~/lib/user.server";
import type { User } from "~/lib/user.server";
import H1 from "~/components/headings/h1";
import { Fragment } from "react";
import H4 from "~/components/headings/h4";

export const loader: LoaderFunction = async ({ request, context }) => {
  const user = await requireUser({ request, context });
  return json<User>(user);
};

export default function Dashboard() {
  return (
    <Fragment>
      <H1 className="text-center">Dashboard</H1>
      <H4 className="text-center italic">Coming soon</H4>
    </Fragment>
  );
}
