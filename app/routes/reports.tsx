import { NavLink, Outlet } from "@remix-run/react";
import ErrorBoundary from "~/components/ErrorBoundary";
import CatchBoundary from "~/components/CatchBoundary";
import H2 from "~/components/headings/h2";
import classNames from "classnames";
import { json } from "@remix-run/cloudflare";
import type { LoaderFunction } from "@remix-run/cloudflare";
import { requireUser } from "~/lib/user.server";
import type { User } from "@sentry/remix";
import { disable } from "~/lib/disable";

export const loader: LoaderFunction = async ({ request, context }) => {
  await disable();
  const user = await requireUser({ request, context });
  return json<User>(user);
};

export default function Reports() {
  return (
    <div className="container grow mx-auto px-8 flex flex-col">
      <div className="flex flex-row justify-between items-center px-2">
        <H2 className="text-center">Reports</H2>
        <NavLink
          to="/reports/new"
          className={(props: { isActive: boolean }) => {
            return classNames(
              "text-white bg-blue-700 font-medium rounded-full text-sm px-5 py-2.5 text-center dark:bg-blue-600 transition duration-300 ease-in-out",
              {
                "underline pointer-events-none bg-slate-500 dark:bg-slate-400":
                  props.isActive,
                "hover:bg-blue-800 dark:hover:bg-blue-700": !props.isActive,
              }
            );
          }}
        >
          New Report
        </NavLink>
      </div>
      <Outlet />
    </div>
  );
}
export { ErrorBoundary, CatchBoundary };
