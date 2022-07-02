export default function Paragraph(props: JSX.IntrinsicElements["p"]) {
  return (
    <p
      className="text-slate-500 dark:text-slate-200 mb-4 mt-4 text-base leading-6"
      {...props}
    />
  );
}
