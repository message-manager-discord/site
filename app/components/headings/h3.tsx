import classNames from "classnames";
// skipcq: JS-E1010
import { getText } from "./utils";

// skipcq: JS-D1001
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
