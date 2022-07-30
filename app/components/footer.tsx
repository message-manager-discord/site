import { Link } from "@remix-run/react";

export default function Footer() {
  const itemClasses =
    "text-slate-500 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors duration-200 border-b pb-1 border-slate-400 sm:border-b-0";
  return (
    <footer className="bg-white dark:bg-slate-800 w-full pb-6 mt-2">
      <div className="max-w-screen-xl mx-auto px-4">
        <ul className="max-w-screen-md mx-auto text-lg font-light flex flex-wrap flex-col text-center sm:flex-row sm:text-left justify-between px-6  ">
          <li className="my-2">
            <Link to="/support" className={itemClasses}>
              Support Server
            </Link>
          </li>
          <li className="my-2">
            <Link to="/privacy" className={itemClasses}>
              Privacy Policy
            </Link>
          </li>
          <li className="my-2">
            <Link to="/terms" className={itemClasses}>
              Terms of Use
            </Link>
          </li>
          <li className="my-2">
            <Link to="/docs" className={itemClasses}>
              Docs
            </Link>
          </li>
          <li className="my-2">
            <a href="/source" className={itemClasses}>
              Source
            </a>
          </li>
        </ul>
        <div className="text-center text-slate-500 dark:text-slate-200 pt-2 sm:pt-4 font-light flex items-center justify-center">
          © 2020-2022 AnotherCat; AGPL v3
        </div>
      </div>
    </footer>
  );
}
