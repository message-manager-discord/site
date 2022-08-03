import classNames from "classnames";
import { Link } from "@remix-run/react";
import type { RemixLinkProps } from "@remix-run/react/dist/components";

// This is used for the default classnames
export default function Anchor({
  className,
  to,
  children,
  ...props
}: RemixLinkProps) {
  const classes = classNames(
    "border-b-2 border-slate-400 dark:border-slate-300 transition duration-300 ease-in-out hover:text-blue-500 dark:hover:text-blue-300",
    className
  );
  return (
    <Link to={to} {...props} className={classes}>
      {children}
    </Link>
  );
}
