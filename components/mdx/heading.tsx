import classNames from "classnames";

export function H1({ className, ...props }: JSX.IntrinsicElements["h1"]) {
  const classes = classNames(
    "text-4xl font-medium tracking-wide text-indigo-600 dark:text-indigo-100",
    className,
  );
  return <h1 className={classes} {...props} />;
}

export function H2({ className, ...props }: JSX.IntrinsicElements["h2"]) {
  const classes = classNames(
    "my-4 text-2xl text-gray-800 dark:text-indigo-50",
    className,
  );
  return <h2 className={classes} {...props} />;
}

export function H3({ className, ...props }: JSX.IntrinsicElements["h3"]) {
  const classes = classNames(
    "mt-2 text-xl leading-loose tracking-tight text-gray-800 dark:text-white",
    className,
  );
  return <h3 className={classes} {...props} />;
}

export function H4({ className, ...props }: JSX.IntrinsicElements["h4"]) {
  const classes = classNames(
    "mt-2 text-lg leading-loose tracking-tight text-gray-800 dark:text-white",
    className,
  );
  return <h4 className={classes} {...props} />;
}
export function H5({ className, ...props }: JSX.IntrinsicElements["h5"]) {
  const classes = classNames(
    "mt-2 text-base leading-loose tracking-tight text-gray-800 dark:text-white",
    className,
  );
  return <h5 className={classes} {...props} />;
}

export function H6({ className, ...props }: JSX.IntrinsicElements["h6"]) {
  const classes = classNames(
    "mt-2 text-base leading-loose tracking-tight text-gray-800 dark:text-white",
    className,
  );
  return <h6 className={classes} {...props} />;
}
