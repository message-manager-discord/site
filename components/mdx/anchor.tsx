import classNames from "classnames";

type AnchorProps = JSX.IntrinsicElements["a"];

export default function Anchor({ className, href, ...props }: AnchorProps) {
  const classes = classNames(
    "border-b-2 border-slate-400 dark:border-slate-300 transition duration-300 ease-in-out hover:text-blue-500 dark:hover:text-blue-300",
    className,
  );

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