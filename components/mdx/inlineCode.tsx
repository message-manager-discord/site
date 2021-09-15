export default function InlineCode(props: JSX.IntrinsicElements["code"]) {
  return (
    <code
      className="text-gray-500 dark:text-gray-200 bg-gray-100 dark:bg-code-dark px-2 py-px rounded-md"
      {...props}
    />
  );
}
