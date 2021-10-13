import classNames from "classnames";
import Link from "next/link";
import { useState } from "react";
import CloseMenu from "./icons/closeMenu";
import OpenMenu from "./icons/openMenu";
import UserMenu from "./Profile";

export default function Nav() {
  const [active, setActive] = useState(false);

  const handleClick = () => {
    setActive(!active);
  };

  return (
    <nav
      className="w-screen px-6 mb-3 md:px-10 py-2 flex md:items-center justify-between bg-blue-100 dark:bg-indigo-600"
      role="navigation"
    >
      <div className="flex flex-col md:flex-row md:items-center w-full md:w-auto">
        {/* Our logo and button */}
        <section className="w-full md:w-max flex justify-between">
          {/* Logo */}
          <span className="font-semibold tracking-tight text-xl text-blue-700 dark:text-blue-100 py-2">
            MessageManager
          </span>

          {/* open/close buttons */}
          {/* Open menu */}
          <button
            className={classNames(
              active ? "hidden" : "",
              "md:hidden text-gray-800 dark:text-indigo-50",
            )}
            id="open-menu"
            aria-label="Open navigation menu"
            onClick={handleClick}
          >
            <OpenMenu />
          </button>

          {/*  Close menu */}
          <button
            className={classNames(
              active ? "" : "hidden",
              "md:hidden text-gray-800 dark:text-indigo-50",
            )}
            id="close-menu"
            aria-label="Close navigation menu"
            onClick={handleClick}
          >
            <CloseMenu />
          </button>
        </section>

        {/*  Our list of items */}
        <ul
          id="menu-items"
          className={classNames(
            active ? "" : "hidden",
            "md:flex w-full flex-col md:flex-row md:pl-6",
          )}
        >
          <li className="py-1 md:py-2">
            <Link href="/">
              <a className="transition duration-300 ease-in-out text-lg font-medium md:px-4 text-gray-600 hover:text-blue-500 dark:text-gray-200 dark:hover:text-white">
                Home
              </a>
            </Link>
          </li>
          <li className="py-1 md:py-2">
            <Link href="/docs">
              <a className="transition duration-300 ease-in-out text-lg font-medium md:px-4 text-gray-600 hover:text-blue-500 dark:text-gray-200 dark:hover:text-white">
                Docs
              </a>
            </Link>
          </li>
          <li className="py-1 md:py-2">
            <Link href="/invite">
              <a className="transition duration-300 ease-in-out text-lg font-medium md:px-4 text-gray-600 hover:text-blue-500 dark:text-gray-200 dark:hover:text-white">
                Invite
              </a>
            </Link>
          </li>
          <li className="py-1 md:py-2">
            <a
              className="transition duration-300 ease-in-out text-lg font-medium md:px-4 text-gray-600 hover:text-blue-500 dark:text-gray-200 dark:hover:text-white"
              href="https://discord.gg/xFZu29t"
            >
              Support
            </a>
          </li>
          <li className="py-1 md:py-2 md:hidden border-t-2 border-gray-500">
            <UserMenu mobile />
          </li>
        </ul>
      </div>
      <div className="hidden md:block">
        <UserMenu />
      </div>
    </nav>
  );
}
