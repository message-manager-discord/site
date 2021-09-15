import classNames from "classnames";
export default function HorizontalRule({
  className,
  ...props
}: JSX.IntrinsicElements["hr"]) {
  const classes = classNames("mr-2", className);
  return <hr className={classes} {...props} />;
}
