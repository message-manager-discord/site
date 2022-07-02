import classNames from "classnames";
import Link from "next/link";

type InternalAnchorProps = JSX.IntrinsicElements["a"] & {
  href: string;
};

export default function InternalAnchor({
  className,
  href,
  ...props
}: InternalAnchorProps) {
  const classes = classNames(
    "border-b-2 border-slate-400 dark:border-slate-300 transition duration-300 ease-in-out hover:text-blue-500 dark:hover:text-blue-300",
    className,
  );
  return (
    <Link href={href}>
      <a className={classes} {...props} />
    </Link>
  );
}
