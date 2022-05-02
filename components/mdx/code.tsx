// @ts-nocheck

import React from "react";
import Highlight, { defaultProps } from "prism-react-renderer";
import classNames from "classnames";

export default function Code({
  children,
  className,
}: JSX.IntrinsicElements["code"]) {
  const language = className && className.replace(/language-/, "");

  return (
    <div>
      <div className="flex items-end justify-end text-slate-500 dark:text-slate-200 px-4">
        <span>{language}</span>
      </div>
      <Highlight
        {...defaultProps}
        code={children}
        language={language}
        theme={undefined}
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
