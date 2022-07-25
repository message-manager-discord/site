import classNames from "classnames";
import React, { isValidElement } from "react";

function getText(node: React.ReactNode): string {
  if (typeof node === "string") {
    return node.toLowerCase().replaceAll(" ", "-");
  }

  if (typeof node === "number") {
    return node.toLocaleString();
  }

  if (isValidElement(node)) {
    return getText(node.props.children);
  }

  if (Array.isArray(node)) {
    return node.map((element) => getText(element)).join("");
  }
  return "";
}

export function H1({ className, ...props }: JSX.IntrinsicElements["h1"]) {
  const anchor = getText(props.children);
  const classes = classNames(
    "text-4xl font-medium tracking-wide text-indigo-600 dark:text-indigo-100",
    className
  );
  return <h1 className={classes} {...props} id={anchor} />;
}

export function H2({ className, ...props }: JSX.IntrinsicElements["h2"]) {
  const anchor = getText(props.children);
  const classes = classNames(
    "my-4 text-2xl text-slate-800 dark:text-indigo-50",
    className
  );
  return <h2 className={classes} {...props} id={anchor} />;
}

export function H3({ className, ...props }: JSX.IntrinsicElements["h3"]) {
  const anchor = getText(props.children);
  const classes = classNames(
    "mt-2 text-xl leading-loose tracking-tight text-slate-800 dark:text-white",
    className
  );
  return <h3 className={classes} {...props} id={anchor} />;
}

export function H4({ className, ...props }: JSX.IntrinsicElements["h4"]) {
  const anchor = getText(props.children);
  const classes = classNames(
    "mt-2 text-lg leading-loose tracking-tight text-slate-800 dark:text-white",
    className
  );
  return <h4 className={classes} {...props} id={anchor} />;
}
export function H5({ className, ...props }: JSX.IntrinsicElements["h5"]) {
  const anchor = getText(props.children);
  const classes = classNames(
    "mt-2 text-base leading-loose tracking-tight text-slate-800 dark:text-white",
    className
  );
  return <h5 className={classes} {...props} id={anchor} />;
}

export function H6({ className, ...props }: JSX.IntrinsicElements["h6"]) {
  const anchor = getText(props.children);
  const classes = classNames(
    "mt-2 text-sm leading-loose tracking-tight text-slate-800 dark:text-white",
    className
  );
  return <h6 className={classes} {...props} id={anchor} />;
}
