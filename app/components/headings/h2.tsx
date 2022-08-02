import classNames from "classnames";
import { getText } from "./utils";

export default function H2({
  className,
  ...props
}: JSX.IntrinsicElements["h2"]) {
  const anchor = getText(props.children);
  const classes = classNames(
    "my-4 text-2xl text-slate-800 dark:text-indigo-50",
    className
  );
  return <h2 className={classes} {...props} id={anchor} />;
}
