// Heading class for consistency of style across usage
import classNames from "classnames";
// skipcq: JS-E1010
import { getText } from "./utils";

// skipcq: JS-D1001
export default function H1({
  className,
  ...props
}: JSX.IntrinsicElements["h1"]) {
  const anchor = getText(props.children);
  const classes = classNames(
    "text-4xl font-medium tracking-wide text-indigo-600 dark:text-indigo-100",
    className
  );
  return <h1 className={classes} {...props} id={anchor} />;
}
