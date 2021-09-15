import classNames from "classnames";

type HintType = "warn" | "info";

interface HintProps {
  type: HintType;
  children: React.ReactNode;
}

function getHintHeadStyle(type: HintType) {
  let name;
  if (type === "info") {
    name = "Info";
  } else if (type === "warn") {
    name = "Warn";
  }

  return {
    classes: classNames(
      "text-xs font-light inline-block py-1 px-2 uppercase rounded-full text-white",
      {
        "bg-red-400": type === "warn",
        "bg-blue-400": type === "info",
      },
    ),
    name,
  };
}

export default function Hint({ type, children }: HintProps) {
  const { classes, name } = getHintHeadStyle(type);
  return (
    <aside className="dark:bg-gray-700 rounded-lg shadow block p-4 mx-auto my-2">
      <div className="pb-2">
        <span className={classes}>{name}</span>
      </div>
      <div className="text-gray-500 dark:text-gray-200 ">{children}</div>
    </aside>
  );
}
