// types/mdx.d.ts
declare module "*.mdx" {
  let MDXComponent: (props: any) => JSX.Element;
  let metadata: { title: string; description: string };
  export default MDXComponent;
  export { metadata };
}
