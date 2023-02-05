// Hint is a component for markdown pages to display a hint
import classNames from "classnames";

type HintType = "warn" | "info";

interface HintProps {
  type: HintType;
  children: React.ReactNode;
}

// Returns tailwindcss classes based on the type of hint
function getHintHeadStyle(type: HintType) {
  let name;
  if (type === "info") {
    name = "Info";
  } else if (type === "warn") {
    name = "Warn";
  }

  return {
    classes: classNames(
      "text-xs font-light inline-block py-1 px-2 uppercase rounded-full text-slate-600 dark:text-slate-200",
      {
        "bg-red-200 dark:bg-red-700": type === "warn",
        "bg-blue-200 dark:bg-blue-700": type === "info",
      }
    ),
    name,
  };
}

export default function Hint({ type, children }: HintProps) {
  const { classes, name } = getHintHeadStyle(type);
  return (
    <aside className="dark:bg-slate-700 rounded-lg shadow block p-4 mx-auto my-2">
      <div className="pb-2">
        <span className={classes}>{name}</span>
      </div>
      <div className="text-slate-500 dark:text-slate-200 ">{children}</div>
    </aside>
  );
}
