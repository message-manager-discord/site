export default function Paragraph(props: JSX.IntrinsicElements["p"]) {
  return (
    <p
      className="text-gray-500 dark:text-gray-200 mb-4 mt-4 text-base leading-6"
      {...props}
    />
  );
}
