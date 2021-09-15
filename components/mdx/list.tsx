import classNames from "classnames";

export function ListItem(props: JSX.IntrinsicElements["li"]) {
  return <li className="mb-4 ml-4 mt-2" {...props} />;
}

const listClasses =
  "text-gray-500 dark:text-gray-200 text-base mb-4 list-inside leading-loose";

export function UnorderedList(props: JSX.IntrinsicElements["ul"]) {
  const classes = classNames(listClasses, "list-disc");
  return <ul className={classes} {...props} />;
}

export function OrderedList(props: JSX.IntrinsicElements["ol"]) {
  const classes = classNames(listClasses, "list-decimal");
  return <ol className={classes} {...props} />;
}
