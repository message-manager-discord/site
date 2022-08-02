import classNames from "classnames";
import { getText } from "./utils";

export default function H6({
  className,
  ...props
}: JSX.IntrinsicElements["h6"]) {
  const anchor = getText(props.children);
  const classes = classNames(
    "mt-2 text-sm leading-loose tracking-tight text-slate-800 dark:text-white",
    className
  );
  return <h6 className={classes} {...props} id={anchor} />;
}
