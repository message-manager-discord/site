export default function InlineCode(props: JSX.IntrinsicElements["code"]) {
  return (
    <code
      className="text-slate-600 dark:text-slate-200 bg-slate-100 dark:bg-code-dark px-2 py-px rounded-md"
      {...props}
    />
  );
}
