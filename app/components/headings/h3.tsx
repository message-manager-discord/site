import classNames from "classnames";
import { getText } from "./utils";

export default function H3({
  className,
  ...props
}: JSX.IntrinsicElements["h3"]) {
  const anchor = getText(props.children);
  const classes = classNames(
    "mt-2 text-xl leading-loose tracking-tight text-slate-800 dark:text-white",
    className
  );
  return <h3 className={classes} {...props} id={anchor} />;
}
