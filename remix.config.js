/** @type {import('@remix-run/dev').AppConfig} */

module.exports = {
  serverBuildTarget: "cloudflare-pages",
  server: "./server.js",
  devServerBroadcastDelay: 1000,
  ignoredRouteFiles: ["**/.*"],
  // appDirectory: "app",
  // assetsBuildDirectory: "public/build",
  // serverBuildPath: "functions/[[path]].js",
  // publicPath: "/build/",
  mdx: async (filename) => {
    const [remarkGfm, rehypeAddClasses] = await Promise.all([
      import("remark-gfm").then((mod) => mod.default),
      import("rehype-add-classes").then((addClasses) => addClasses.default),
    ]);

    return {
      remarkPlugins: [remarkGfm],
      rehypePlugins: [
        [
          rehypeAddClasses,
          {
            h1: "text-4xl font-medium tracking-wide text-indigo-600 dark:text-indigo-100",
            h2: "my-4 text-2xl text-slate-800 dark:text-indigo-50",
            h3: "mt-2 text-xl leading-loose tracking-tight text-slate-800 dark:text-white",
            h4: "mt-2 text-lg leading-loose tracking-tight text-slate-800 dark:text-white",
            h5: "mt-2 text-base leading-loose tracking-tight text-slate-800 dark:text-white",
            h6: "mt-2 text-sm leading-loose tracking-tight text-slate-800 dark:text-white",
            a: "border-b-2 border-slate-400 dark:border-slate-300 transition duration-300 ease-in-out hover:text-blue-500 dark:hover:text-blue-300",
            li: "mb-4 ml-4 mt-2",
            ul: "text-slate-500 dark:text-slate-200 text-base mb-4 list-inside leading-loose list-disc",
            ol: "text-slate-500 dark:text-slate-200 text-base mb-4 list-inside leading-loose list-decimal",
            p: "text-slate-500 dark:text-slate-200 mb-4 mt-4 text-base leading-6",
            table:
              "table p-6 my-6 dark:bg-slate-700 shadow rounded-lg overflow-y-auto",
            thead: "",
            tbody: "",
            th: "whitespace-nowrap px-4 py-2 font-normal text-lg text-slate-500 dark:text-slate-200",
            tr: "px-2",
            td: "border-t-2 p-4 dark:border-slate-400 font-normal text-slate-500 dark:text-slate-200",
            code: "text-slate-600 dark:text-slate-200 bg-slate-100 dark:bg-code-dark px-2 py-px rounded-md",
          },
        ],
      ],
    };
  },
};
