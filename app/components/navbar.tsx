import { NavLink } from "@remix-run/react";
import classNames from "classnames";
import { useCallback, useState } from "react";
import type { GetUserResponse } from "~/lib/user.server";
// skipcq: JS-E1010
import Cross from "./icons/cross";
// skipcq: JS-E1010
import Hamburger from "./icons/hamburger";
import Profile from "./profile";

export default function Navbar({ user }: { user: GetUserResponse }) {
  const [active, setActive] = useState(false);

  const handleClick = useCallback(() => {
    setActive(!active);
  }, [active]);
  const navLinkClasses =
    "transition duration-300 ease-in-out text-lg font-medium text-slate-600 hover:text-blue-500 dark:text-slate-200 dark:hover:text-white lg:px-3 xl:px-4";

  const navLinkClassesFunction: (props: {
    isActive: boolean;
  }) => string | undefined = useCallback(
    (props): string | undefined =>
      classNames(navLinkClasses, { underline: props.isActive }),
    []
  );

  return (
    <nav
      className="w-screen px-6 mb-3 lg:px-10 py-2 flex flex-col lg:flex-row lg:items-center justify-between bg-blue-100 dark:bg-indigo-600"
      role="navigation"
    >
      <div className="flex flex-col lg:flex-row lg:items-center w-full lg:w-auto">
        {/* Our logo and button */}
        <section className="w-full lg:w-max flex justify-between">
          {/* Logo */}
          <span className="font-semibold tracking-tight text-xl text-blue-700 dark:text-blue-100 py-2">
            MessageManager
          </span>

          {/* open/close buttons */}
          {/* Open menu */}
          <button
            className={classNames(
              active ? "hidden" : "",
              "lg:hidden text-slate-800 dark:text-indigo-50"
            )}
            id="open-menu"
            aria-label="Open navigation menu"
            onClick={handleClick}
            type="button"
          >
            <Hamburger width="24" height="24" />
          </button>

          {/*  Close menu */}
          <button
            className={classNames(
              active ? "" : "hidden",
              "text-slate-800 dark:text-indigo-50 lg:hidden"
            )}
            id="close-menu"
            aria-label="Close navigation menu"
            onClick={handleClick}
            type="button"
          >
            <Cross width="24" height="24" />
          </button>
        </section>

        {/*  Our list of items */}
        <ul
          id="menu-items"
          className={classNames(
            active ? "" : "hidden",
            "lg:flex w-full flex-col lg:flex-row lg:pl-6"
          )}
        >
          <li className="py-2">
            <NavLink to="/" className={navLinkClassesFunction}>
              Home
            </NavLink>
          </li>
          <li className="py-2">
            <NavLink to="/docs" className={navLinkClassesFunction}>
              Docs
            </NavLink>
          </li>
          <li className="py-2">
            <a href="/invite" className={navLinkClasses}>
              Invite
            </a>
          </li>
          <li className="py-2">
            <a href="/support" className={navLinkClasses}>
              Support
            </a>
          </li>
          <li className="py-1 lg:py-2 lg:hidden border-t-2 border-slate-500">
            <Profile mobile user={user} />
          </li>
        </ul>
      </div>
      <div className="hidden lg:block">
        <Profile user={user} />
      </div>
    </nav>
  );
}
