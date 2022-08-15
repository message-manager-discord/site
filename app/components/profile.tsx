import { Link, useLocation } from "@remix-run/react";
import classNames from "classnames";
import { useCallback, useState } from "react";

import type { GetUserResponse } from "~/lib/user.server";
import Down from "./icons/down";
import Left from "./icons/left";
import Up from "./icons/up";

export interface ProfileLinkData {
  label: string;
  to: string;
}

export default function Profile({
  user,
  mobile,
}: {
  user: GetUserResponse;
  mobile?: boolean;
}) {
  const [active, setActive] = useState(false);

  const location = useLocation();

  const handleClick = useCallback(() => {
    setActive(!active);
  }, [active]);
  if (!user.loggedIn) {
    return (
      <div className="flex flex-row lg:px-4">
        <Link
          to={`/auth/login?redirect_url=${encodeURIComponent(
            location.pathname
          )}`}
          className="flex-grow"
        >
          <span className="pt-1 transition duration-300 ease-in-out text-lg font-medium lg:px-4 text-slate-600 hover:text-blue-500 dark:text-slate-200 dark:hover:text-white whitespace-nowrap">
            Log in
          </span>
        </Link>
      </div>
    );
  } else {
    let items: ProfileLinkData[] = [
      {
        label: "Reports",
        to: "reports",
      },
      {
        label: "Logout",
        to: `/auth/logout?redirect_url=${encodeURIComponent(
          `${location.pathname}?from_logout=true`
        )}`,
      },
    ];
    if (user.staff) {
      const staffProfileData: ProfileLinkData = {
        label: "Admin",
        to: "/admin",
      };
      items = [staffProfileData].concat(items);
    }
    if (!mobile) {
      const loggedInUser = user;
      return (
        <div className="relative inline-block text-left">
          <div>
            <button
              type="button"
              onClick={handleClick}
              className={`mt-1 flex items-center justify-center w-full rounded-md px-4 transition duration-300 ease-in-out text-normal font-medium lg:px-4 text-slate-600 hover:text-blue-500 dark:text-slate-200 dark:hover:text-white`}
              id="options-menu"
            >
              <div className="flex flex-row">
                <img
                  src={`https://cdn.discordapp.com/avatars/${loggedInUser.id}/${loggedInUser.avatar}.png?height=32&width=32`}
                  alt="User avatar"
                  width="32"
                  height="32"
                  className="rounded-full"
                />

                <span className="py-1 px-1">{`${user.username}#${user.discriminator}`}</span>
              </div>

              {active ? (
                <Up className="h-5 w-5" />
              ) : (
                <Down className="h-5 w-5" />
              )}
            </button>
          </div>

          {active && (
            <div className="origin-top-right absolute right-0 mt-5 w-52 rounded-md shadow-lg bg-blue-50 dark:bg-slate-700 ring-1 ring-black dark:ring-slate-500 ring-opacity-5">
              <div
                className={`flex-col divide-y-2 divide-slate-500 ${
                  false ? "divide-y divide-slate-100" : ""
                }`}
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="options-menu"
              >
                {items.map((item, index) => {
                  let roundedClass = "";
                  if (index === 0) {
                    roundedClass = "rounded-t-md";
                  } else if (index === items.length - 1) {
                    roundedClass = "rounded-b-md";
                  }
                  return (
                    <Link
                      key={item.label}
                      to={item.to}
                      className={classNames(
                        "block px-4 py-2 text-md text-slate-700 hover:text-slate-600 hover:bg-blue-100 dark:text-slate-200 dark:hover:text-white dark:hover:bg-slate-600",
                        roundedClass
                      )}
                      role="menuitem"
                    >
                      <span className="flex flex-col">
                        <span>{item.label}</span>
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      );
    } else {
      return (
        <div className="text-slate-600 dark:text-slate-200">
          <div className="flex flex-row">
            <img
              src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?height=32&width=32`}
              alt="User avatar"
              width="32"
              height="32"
              className="rounded-full"
            />

            <span className="py-1 px-1">{`${user.username}#${user.discriminator}`}</span>
          </div>
          {items.map((item) => {
            return (
              <div className="flex pt-1 ml-1.5" key={item.label}>
                <div>
                  <Left className="h-5 w-5 mt-0.5" />
                </div>
                <Link
                  to={item.to}
                  className="px-2.5 transition duration-300 ease-in-out text-md  lg:px-4 text-slate-600 hover:text-blue-500 dark:text-slate-200 dark:hover:text-white"
                >
                  <span className="flex flex-col">
                    <span>{item.label}</span>
                  </span>
                </Link>
              </div>
            );
          })}
        </div>
      );
    }
  }
}
