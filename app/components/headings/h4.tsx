// Heading class for consistency of style across usage
import classNames from "classnames";
// skipcq: JS-E1010
import { getText } from "./utils";

// skipcq: JS-D1001
export default function H4({
  className,
  ...props
}: JSX.IntrinsicElements["h4"]) {
  const anchor = getText(props.children);
  const classes = classNames(
    "mt-2 text-lg leading-loose tracking-tight text-slate-800 dark:text-white",
    className
  );
  return <h4 className={classes} {...props} id={anchor} />;
}
