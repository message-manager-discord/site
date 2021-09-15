// @ts-nocheck

import React from "react";
import Highlight, { defaultProps } from "prism-react-renderer";
import VsDark from "prism-react-renderer/themes/vsDark";
import classNames from "classnames";

export default function Code({
  children,
  className,
}: JSX.IntrinsicElements["code"]) {
  const language = className && className.replace(/language-/, "");
  return (
    <Highlight {...defaultProps} code={children} language={language}>
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre
          className={classNames(className, "break-words whitespace-pre-wrap")}
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
  );
}
