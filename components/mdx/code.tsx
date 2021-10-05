// @ts-nocheck

import React from "react";
import Highlight, { defaultProps } from "prism-react-renderer";
import darkTheme from "prism-react-renderer/themes/palenight";
import lightTheme from "prism-react-renderer/themes/duotoneLight";
import classNames from "classnames";
import { useTheme } from "next-themes";

export default function Code({
  children,
  className,
}: JSX.IntrinsicElements["code"]) {
  const language = className && className.replace(/language-/, "");
  const { resolvedTheme } = useTheme();
  console.log(resolvedTheme);
  let theme;
  if (resolvedTheme === "light") {
    theme = lightTheme;
  } else if (resolvedTheme === "dark") {
    theme = darkTheme;
  }
  return (
    <div>
      <div className="flex items-end justify-end text-gray-500 dark:text-gray-200 px-4">
        <span>{language}</span>
      </div>
      <Highlight
        {...defaultProps}
        code={children}
        language={language}
        theme={theme}
      >
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre
            className={classNames(
              className,
              "break-words whitespace-pre-wrap rounded-lg shadow-md",
            )}
            style={{ ...style, padding: "20px" }}
          >
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line, key: i })}>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token, key })} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </div>
  );
}
