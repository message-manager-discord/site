// Component to display alongside the docs for navigation (or hidden on mobile)
import classNames from "classnames";
import { useCallback, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
// skipcq: JS-E1010
import Cross from "./icons/cross";
// skipcq: JS-E1010
import RightChevron from "./icons/right";

const pageNames = [
  "changelog-and-migrating",
  "common-issues",
  "config",
  "message-management",
  "permissions",
  "quickstart",
];

// Capitalize the first letter of each word
const capitalize = (sentence: string) =>
  sentence.replace(/(^\w{1})|(\s+\w{1})/g, (letter) => letter.toUpperCase());

// Make the title better for display
const sanitizeTitle = (title: string) =>
  capitalize(title.replace("_", " ").replace(`-`, " ").replace(`-`, " "));

export default function Menu() {
  const [active, setActive] = useState(false);

  // Set the active state - this is used to show the menu on mobile
  const setActiveTo = useCallback((to: boolean) => {
    setActive(to);
    const toggle = document.getElementById("toggle-dark");
    toggle?.classList.toggle("absolute", !to);
    const toggleDiv = document.getElementById("toggle-dark-div");
    toggleDiv?.classList.toggle("relative", !to);
  }, []);

  useEffect(() => {
    // Ensure that the menu is closed and close it when page changes
    // As the component may not be reloaded on page change (remix does some magic)
    const handlePopState = () => {
      setActiveTo(false);
    };
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [setActiveTo]);

  const handleClick = useCallback(() => {
    setActiveTo(!active);
  }, [setActiveTo, active]);

  const linkSharedClasses =
    "hover:text-slate-800 dark:text-slate-300 flex items-center p-1.5 my-2 transition-colors dark:hover:text-white duration-200 justify-start rounded-md";
  const linkInactiveClasses =
    "text-slate-500 font-thin hover:bg-slate-100 dark:hover:bg-slate-600";
  const linkActiveClasses = "text-slate-600 bg-slate-100 dark:bg-slate-600";

  // Return different classes based on if the link is active or not (provide to NavLink)
  const linkClassesFunction: (props: {
    isActive: boolean;
  }) => string | undefined = useCallback(
    (props): string | undefined =>
      classNames(linkSharedClasses, {
        [linkActiveClasses]: props.isActive,
        [linkInactiveClasses]: !props.isActive,
      }),
    []
  );
  // Links for all the pages
  const pageLinks = [
    <NavLink to={`/docs`} key="index" className={linkClassesFunction} end>
      <span className="mx-4 text-md font-normal">Introduction</span>
    </NavLink>,
  ].concat(
    pageNames.map((page) => {
      return (
        <NavLink
          to={`/docs/${page}`}
          key={page}
          className={linkClassesFunction}
        >
          <span className="mx-4  text-md font-normal">
            {sanitizeTitle(page)}
          </span>
        </NavLink>
      );
    })
  );

  return (
    <div
      className={classNames("", !active ? "md:sticky md:top-0" : "")}
      id="nav"
    >
      {/* open/close buttons */}
      {/* Open menu */}
      <button
        className={classNames(
          active ? "hidden" : "",
          "md:hidden p-4 py-7 fixed text-slate text-slate-600 dark:text-indigo-50"
        )}
        id="open-menu"
        aria-label="Open navigation menu"
        onClick={handleClick}
        type="button"
      >
        <RightChevron width="24" height="24" />
      </button>

      <div
        className={classNames(
          active ? "" : "hidden",
          "fixed md:relative  md:flex flex-col sm:flex-row sm:justify-around bg-slate-50 dark:bg-slate-700 rounded-lg shadow-md my-2"
        )}
      >
        <div className="w-64">
          <nav className="pr-3 pl-4">
            <div className="flex items-center justify-around md:justify-start pt-3 px-2 md:px-4 pb-2">
              <span className="text-2xl tracking-tight font-semibold text-blue-700 dark:text-blue-100">
                Documentation
              </span>
              <button
                className={classNames(
                  active ? "" : "hidden",
                  "md:hidden text-slate-800 dark:text-indigo-50"
                )}
                id="close-menu"
                aria-label="Close navigation menu"
                onClick={handleClick}
                type="button"
              >
                <Cross width="24" height="24" />
              </button>
            </div>
            {pageLinks}
          </nav>
        </div>
      </div>
    </div>
  );
}
