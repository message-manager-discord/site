import { Link, NavLink } from "@remix-run/react";
import classNames from "classnames";
import { useState } from "react";
import Cross from "./icons/cross";
import Hamburger from "./icons/hamburger";

export default function Navbar() {
  const [active, setActive] = useState(false);

  const handleClick = () => {
    setActive(!active);
  };
  const itemClasses =
    "transition duration-300 ease-in-out text-lg font-medium text-slate-600 hover:text-blue-500 dark:text-slate-200 dark:hover:text-white md:px-4";
  return (
    <nav
      className="w-screen px-6 mb-3 md:px-10 py-2 flex flex-col md:flex-row md:items-center bg-blue-100 dark:bg-indigo-600"
      role="navigation"
    >
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
            "md:hidden text-slate-800 dark:text-indigo-50"
          )}
          id="open-menu"
          aria-label="Open navigation menu"
          onClick={handleClick}
        >
          <Hamburger width="24" height="24" />
        </button>

        {/*  Close menu */}
        <button
          className={classNames(
            active ? "" : "hidden",
            "text-slate-800 dark:text-indigo-50"
          )}
          id="close-menu"
          aria-label="Close navigation menu"
          onClick={handleClick}
        >
          <Cross width="24" height="24" />
        </button>
      </section>

      {/*  Our list of items */}
      <ul
        id="menu-items"
        className={classNames(
          active ? "" : "hidden",
          "md:flex w-full flex-col md:flex-row md:pl-6"
        )}
      >
        <li className="py-2">
          <NavLink to="/" className={itemClasses}>
            Home
          </NavLink>
        </li>
        <li className="py-2">
          <NavLink to="/docs" className={itemClasses}>
            Docs
          </NavLink>
        </li>
        <li className="py-2">
          <Link to="/invite" className={itemClasses}>
            Invite
          </Link>
        </li>
        <li className="py-2">
          <Link to="/support" className={itemClasses}>
            Support
          </Link>
        </li>
      </ul>
    </nav>
  );
}
