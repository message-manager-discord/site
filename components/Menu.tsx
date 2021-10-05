import { DocsDirectoryNames } from "../lib/api";
import Link from "next/link";

import { sanitizeTitle } from "../lib/utils";
import classNames from "classnames";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

// TODO fix this later
const pages = [
  {
    dirname: "features",
    filenames: ["commands", "logging", "messages", "slash_commands"],
  },
  {
    dirname: "self-hosting",
    filenames: ["installing", "maintaining", "migration"],
  },
  { dirname: "setup", filenames: ["config", "index", "permissions"] },
];

const Menu = ({ pathname }: { pathname: string }) => {
  const linkInactiveClass =
    "hover:text-gray-800 font-thin text-gray-500 dark:text-gray-300 hover:bg-gray-100 flex items-center p-2 md:p-1.5 my-1 transition-colors dark:hover:text-white dark:hover:bg-gray-600 duration-200 justify-start rounded-md";
  const linkActiveClass =
    "hover:text-gray-800 text-gray-600 bg-gray-100 dark:bg-gray-600 dark:text-gray-300 hover:bg-gray-100 flex items-center p-2 md:p-1.5 my-1 transition-colors dark:hover:text-white dark:hover:bg-gray-600 duration-200 justify-start  rounded-md";
  const sectionHeadClass =
    "text-gray-400 dark:text-gray-300 ml-2 pl-2 pt-1 w-full border-b-2 pb-2 border-gray-100 mb-4 text-md font-normal";
  const sectionHeadActiveClass =
    "text-gray-400 dark:text-gray-300 ml-2 w-full border-b-2 p-2 border-gray-100 mb-4 text-md font-normal bg-gray-50 dark:bg-gray-600";
  let headLink;
  if (pathname === "/docs") {
    headLink = (
      <Link href="/docs" key="head">
        <a className={linkActiveClass}>
          <span className="mx-4 text-md font-normal">Introduction</span>
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
  const currentPages = pathname.replace("/docs/", "").split("/");

  const parsedPages = pages.map((page) => {
    let sectionHead;
    sectionHead = (
      <div className={sectionHeadClass}>{sanitizeTitle(page.dirname)}</div>
    );
    return (
      <div key={page.dirname}>
        {sectionHead}
        {page.filenames.map((pageFile) => (
          <Link href={`/docs/${page.dirname}/${pageFile}`} key={pageFile}>
            <a
              className={
                currentPages[1] === pageFile
                  ? linkActiveClass
                  : linkInactiveClass
              }
            >
              <span className="mx-4 text-md font-normal">
                {sanitizeTitle(pageFile)}
              </span>
            </a>
          </Link>
        ))}
      </div>
    );
  });
  let items = [headLink, ...parsedPages];
  const [active, setActive] = useState(false);

  const handleClick = () => {
    setActive(!active);
    const toggle = document.getElementById("toggle-dark");
    toggle?.classList.toggle("absolute", active);
    const toggleDiv = document.getElementById("toggle-dark-div");
    toggleDiv?.classList.toggle("relative", active);
  };
  const router = useRouter();
  useEffect(() => {
    const handleRouteChange = () => {
      setActive(false);
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
        " bg-white dark:bg-gray-800",
      )}
      id="nav"
    >
      {/* open/close buttons */}
      {/* Open menu */}
      <button
        className={classNames(
          active ? "hidden" : "",
          "md:hidden p-4 py-7 fixed text-gray text-gray-800 dark:text-indigo-50",
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
          "fixed md:relative bg-white dark:bg-gray-800 md:flex flex-col sm:flex-row sm:justify-around ",
        )}
      >
        <div className="w-64 h-screen border-r-2">
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
                  "pt-1 text-gray-800 dark:text-indigo-50",
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
