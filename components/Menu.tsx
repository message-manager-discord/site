import { DocsDirectoryNames } from "../lib/api";
import Link from "next/link";

import { sanitizeTitle } from "../lib/utils";

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
    "hover:text-gray-800 font-thin text-gray-500 dark:text-gray-300 hover:bg-gray-100 flex items-center p-2 my-2 transition-colors dark:hover:text-white dark:hover:bg-gray-600 duration-200 justify-start";
  const linkActiveClass =
    "hover:text-gray-800 text-gray-600 bg-gray-50 dark:bg-gray-600 dark:text-gray-300 hover:bg-gray-100 flex items-center p-2 my-4 transition-colors dark:hover:text-white dark:hover:bg-gray-600 duration-200 justify-start";
  const sectionHeadClass =
    "text-gray-400 ml-2 w-full border-b-2 pb-2 border-gray-100 mb-4 text-md font-normal";
  const sectionHeadActiveClass =
    "text-gray-400 ml-2 w-full border-b-2 p-2 border-gray-100 mb-4 text-md font-normal bg-gray-50 dark:bg-gray-600";
  let headLink;
  if (pathname === "/docs") {
    headLink = (
      <Link href="/docs">
        <a className={linkActiveClass}>
          <span className="mx-4 text-md font-normal">Introduction</span>
        </a>
      </Link>
    );
  } else {
    headLink = (
      <Link href="/docs">
        <a className={linkInactiveClass}>
          <span className="mx-4 text-md font-normal">Introduction</span>
        </a>
      </Link>
    );
  }
  const currentPages = pathname.replace("/docs/", "").split("/");

  const parsedPages = pages.map((page) => {
    let sectionHead;
    if (page.filenames.includes("index")) {
      page.filenames = page.filenames.filter((page) => page !== "index");
      sectionHead = (
        <Link href={`/docs/${page.dirname}`}>
          <a>
            <p
              className={
                currentPages[0] === page.dirname && currentPages.length === 1
                  ? sectionHeadActiveClass
                  : sectionHeadClass
              }
            >
              {sanitizeTitle(page.dirname)}
            </p>
          </a>
        </Link>
      );
    } else {
      sectionHead = (
        <p className={sectionHeadClass}>{sanitizeTitle(page.dirname)}</p>
      );
    }
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
  return (
    <div className="sticky bottom-0 bg-white dark:bg-gray-800">
      <div className="flex flex-col sm:flex-row sm:justify-around ">
        <div className="w-64 h-screen border-r-2">
          <nav className="pr-3 pl-4">{items}</nav>
        </div>
      </div>
    </div>
  );
};

export default Menu;
