import Link from "next/link";

import { sanitizeTitle } from "../lib/utils";
import classNames from "classnames";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const pages = [
  "quickstart",
  "message-management",
  "permissions",
  "config",
  "common-issues",
  "changelog-and-migrating",
];

const Menu = ({ pathname }: { pathname: string }) => {
  const linkInactiveClass =
    "hover:text-slate-800 font-thin text-slate-500 dark:text-slate-300 hover:bg-slate-100 flex items-center p-4 md:p-1.5 my-2 transition-colors dark:hover:text-white dark:hover:bg-slate-600 duration-200 justify-start rounded-md";
  const linkActiveClass =
    "hover:text-slate-800 text-slate-600 bg-slate-100 dark:bg-slate-600 dark:text-slate-300 hover:bg-slate-100 flex items-center p-4 md:p-1.5 my-2 transition-colors dark:hover:text-white dark:hover:bg-slate-600 duration-200 justify-start  rounded-md";

  let headLink;
  if (pathname === "/docs") {
    headLink = (
      <Link href="/docs" key="head">
        <a className={linkActiveClass}>
          <span className="mx-4  text-md font-normal">Introduction</span>
        </a>
      </Link>
    );
  } else {
    headLink = (
      <Link href="/docs" key="head">
        <a className={linkInactiveClass}>
          <span className="mx-4 text-md font-normal">Introduction</span>
        </a>
      </Link>
    );
  }
  const currentPage = pathname.replace("/docs/", "").split("/")[0]; // Only one page deep

  const parsedPages = pages.map((page) => {
    let linkClass = linkInactiveClass;
    if (page === currentPage) {
      linkClass = linkActiveClass;
    }
    return (
      <Link href={`/docs/${page}`} key={page}>
        <a className={linkClass}>
          <span className="mx-4  text-md font-normal">
            {sanitizeTitle(page)}
          </span>
        </a>
      </Link>
    );
  });

  let items = [headLink, ...parsedPages];
  const [active, setActive] = useState(false);

  const handleSetActive = (activeStatus: boolean | undefined) => {
    if (!activeStatus) activeStatus = !active;
    setActive(activeStatus);
    const toggle = document.getElementById("toggle-dark");
    toggle?.classList.toggle("absolute", !activeStatus);
    const toggleDiv = document.getElementById("toggle-dark-div");
    toggleDiv?.classList.toggle("relative", !activeStatus);
  };

  const handleClick = () => {
    handleSetActive(undefined);
  };
  const router = useRouter();
  useEffect(() => {
    const handleRouteChange = () => {
      handleSetActive(false);
    };

    router.events.on("routeChangeComplete", handleRouteChange);

    // If the component is unmounted, unsubscribe
    // from the event with the `off` method:
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  });
  useEffect(() => {
    //aside selector
    const aside = document.getElementById("nav") as HTMLElement,
      //varibles
      startScroll = 0;
    let endScroll = window.innerHeight - aside.offsetHeight - 500,
      currPos = window.scrollY,
      screenHeight = window.innerHeight,
      asideHeight = aside.offsetHeight;
    aside.style.top = startScroll + "px";
    //check height screen and aside on resize
    window.addEventListener("resize", () => {
      screenHeight = window.innerHeight;
      asideHeight = aside.offsetHeight;
    });
    //main function
    document.addEventListener(
      "scroll",
      () => {
        if (active) return;
        endScroll = window.innerHeight - aside.offsetHeight;
        let asideTop = parseInt(aside.style.top.replace("px;", ""));
        if (asideHeight > screenHeight) {
          if (window.scrollY < currPos) {
            //scroll up
            if (asideTop < startScroll) {
              aside.style.top = asideTop + currPos - window.scrollY + "px";
            } else if (asideTop >= startScroll && asideTop != startScroll) {
              aside.style.top = startScroll + "px";
            }
          } else {
            //scroll down
            if (asideTop > endScroll) {
              aside.style.top = asideTop + currPos - window.scrollY + "px";
            } else if (asideTop < endScroll && asideTop != endScroll) {
              aside.style.top = endScroll + "px";
            }
          }
        } else {
          aside.style.top = startScroll + "px";
        }
        currPos = window.scrollY;
      },
      {
        capture: true,
        passive: true,
      },
    );
  });
  return (
    <div
      className={classNames(
        "md:sticky md:top-0" ? !active : "",
        " bg-white dark:bg-slate-800",
      )}
      id="nav"
    >
      {/* open/close buttons */}
      {/* Open menu */}
      <button
        className={classNames(
          active ? "hidden" : "",
          "md:hidden p-4 py-7 fixed text-slate text-slate-800 dark:text-indigo-50",
        )}
        id="open-menu"
        aria-label="Open navigation menu"
        onClick={handleClick}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          display="block"
          id="TextAlignJustified"
        >
          <path d="M3 6h18M3 12h18M3 18h18"></path>
        </svg>
      </button>

      <div
        className={classNames(
          active ? "" : "hidden",
          "fixed md:relative bg-white dark:bg-slate-800 md:flex flex-col sm:flex-row sm:justify-around ",
        )}
      >
        <div className="w-64 h-screen border-r-2 border-slate-200 dark:border-slate-100">
          <nav className="pr-3 pl-4">
            <div className="flex justify-around pt-3">
              <Link href="/">
                <a className="transition duration-300 ease-in-out text-2xl  tracking-tight font-semibold  text-blue-700 dark:text-blue-100 hover:text-blue-800 py-2 dark:hover:text-white">
                  MessageManager
                </a>
              </Link>
              <button
                className={classNames(
                  active ? "" : "hidden",
                  "pt-1 text-slate-800 dark:text-indigo-50",
                )}
                id="close-menu"
                aria-label="Close navigation menu"
                onClick={handleClick}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  display="block"
                  id="Cross"
                >
                  <path d="M20 20L4 4m16 0L4 20"></path>
                </svg>
              </button>
            </div>
            {items}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Menu;
