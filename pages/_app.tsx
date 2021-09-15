import "tailwindcss/tailwind.css";
import type { AppProps } from "next/app";
import { COMPONENTS } from "../components/MDX";
import { MDXProvider, withMDXComponents } from "@mdx-js/react";
import { ThemeProvider } from "next-themes";
import OpenGraph from "../components/OpenGraph";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import Menu from "../components/Menu";
import { getAllDocPages } from "../lib/api";
import { GetStaticProps, NextComponentType, NextPageContext } from "next";
import { useRouter } from "next/router";
import { sanitizeTitle } from "../lib/utils";

withMDXComponents;

type maybeMDXComponent = NextComponentType<NextPageContext, any, {}> & {
  isMDXComponent?: boolean;
};

type CustomAppProps = AppProps & {
  Component: maybeMDXComponent;
};

const MyApp = ({ Component, pageProps }: CustomAppProps) => {
  const router = useRouter();
  let title: string;
  const isDoc = router.pathname.startsWith("/docs");
  let docPages: string[] = [];
  if (isDoc) {
    const docPath = router.pathname.replace("/docs", "");
    docPages = docPath
      .split("/")
      .filter((page) => page.length > 0)
      .map((page): string => {
        return `${sanitizeTitle(page)} - `;
      });
    title = `Docs - ${docPages.join("")}`;
  } else {
    switch (router.pathname) {
      case "/":
        title = "Home - ";
        break;
      default:
        title = "";
        break;
    }
  }
  let innerContent;
  if (Component.isMDXComponent) {
    innerContent = (
      <div className="flex flex-row">
        <Menu pathname={router.pathname} />
        <div className="container flex-shrink mx-auto px-14 min-w-0">
          <MDXProvider components={COMPONENTS}>
            <Component {...pageProps} />
          </MDXProvider>
        </div>
      </div>
    );
  } else {
    innerContent = <Component {...pageProps} />;
  }
  return (
    <ThemeProvider attribute="class">
      <div className="flex flex-col h-screen bg-white dark:bg-gray-800  overflow-y-auto">
        <OpenGraph
          title={title ? `${title}Message Manager` : "Message Manager"}
        />
        <Nav />
        {innerContent}
        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default MyApp;
