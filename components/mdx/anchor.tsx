import classNames from "classnames";
import Link from "next/link";

type AnchorProps = JSX.IntrinsicElements["a"] & {
  internal?: boolean;
  href: string;
};

export default function Anchor({
  className,
  internal,
  href,
  ...props
}: AnchorProps) {
  const classes = classNames(
    "border-b-2 border-gray-400 dark:border-gray-300 transition duration-300 ease-in-out hover:text-blue-500 dark:hover:text-blue-300",
    className,
  );
  if (internal) {
    return (
      <Link href={href}>
        <a className={classes} {...props} />
      </Link>
    );
  } else {
    return (
      <a
        className={classes}
        href={href}
        target="_blank"
        rel="noreferrer"
        {...props}
      />
    );
  }
}
