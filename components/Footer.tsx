import classNames from "classnames";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Link from "next/link";

const ThemeCheckBox = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const { resolvedTheme, setTheme } = useTheme();
  const checked = resolvedTheme === "dark";
  if (!mounted) {
    return (
      <input
        type="checkbox"
        name="toggle"
        id="toggle-dark"
        aria-label="Dark mode toggle"
        className="hidden checked:bg-gray-800 outline-none focus:outline-none right-4 checked:right-0 duration-200 ease-in absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
      />
    );
  }
  return (
    <input
      type="checkbox"
      name="toggle"
      id="toggle-dark"
      aria-label="Dark mode toggle"
      className="checked:bg-gray-800 outline-none focus:outline-none right-4 checked:right-0 duration-200 ease-in absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
      onClick={() => {
        setTheme(resolvedTheme === "light" ? "dark" : "light");
      }}
      defaultChecked={checked}
    />
  );
};

const ThemeChanger = () => {
  return (
    <li id="toggle-dark-li">
      <div className="my-2 mb-3">
        <div className="relative inline-block w-10 mr-2 align-middle select-none">
          <ThemeCheckBox />

          <label
            aria-hidden="true"
            htmlFor="Dark Mode"
            className="block overflow-hidden h-6 rounded-full bg-gray-300 hover:bg-gray-400 dark:bg-gray-300 dark:hover:bg-white transition-colors duration-200 ease-in cursor-pointer"
          ></label>
        </div>
        <span
          className="text-lg text-gray-500 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors duration-200 pb-1"
          aria-hidden="true"
        >
          Dark Mode
        </span>
      </div>
    </li>
  );
};

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-800 w-full pb-6 mt-2">
      <div className="max-w-screen-xl mx-auto px-4">
        <ul className="max-w-screen-md mx-auto text-lg font-light flex flex-wrap flex-col text-center sm:flex-row sm:text-left justify-between px-6">
          <li className="my-2">
            <a
              className="text-gray-500 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors duration-200 border-b pb-1 border-gray-400 sm:border-b-0"
              href="https://discord.gg/xFZu29t"
            >
              Support Server
            </a>
          </li>
          <li className="my-2">
            <Link href="/privacy" scroll={true}>
            <a
              className="text-gray-500 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors duration-200 border-b pb-1 border-gray-400 sm:border-b-0"
            >
              Privacy Policy
            </a>
            </Link>
          </li>
          <li className="my-2">
            <Link href="/docs">
              <a className="text-gray-500 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors duration-200 border-b pb-1 border-gray-400 sm:border-b-0">
                Docs
              </a>
            </Link>
          </li>
          <li className="my-2">
            <a
              className="text-gray-500 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors duration-200 border-b pb-1 border-gray-400 sm:border-b-0"
              href="https://github.com/message-manager-discord/site"
            >
              Source
            </a>
          </li>
          <ThemeChanger />
        </ul>
        <div className="text-center text-gray-500 dark:text-gray-200 pt-2 sm:pt-4 font-light flex items-center justify-center">
          © 2020-2021 AnotherCat; AGPL v3
        </div>
      </div>
    </footer>
  );
}
