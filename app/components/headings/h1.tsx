import classNames from "classnames";
import { getText } from "./utils";

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