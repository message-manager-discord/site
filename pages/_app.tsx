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
import { Fragment, useState } from "react";
import classNames from "classnames";

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

  if (
    Component.isMDXComponent ||
    router.pathname === "/privacy" // next-mdx-remote doesn't have isMDXComponent
  ) {
    let smallPadding = "";
    if (isDoc) {
      smallPadding = "pl-14 pr-5";
    } else {
      smallPadding = "px-5";
    }

    const mdxContent = (
      <div
        className={classNames(
          "container flex-shrink mx-auto",
          smallPadding,
          "md:px-14 min-w-0 pt-5",
        )}
      >
        <MDXProvider components={COMPONENTS}>
          <Component {...pageProps} />
        </MDXProvider>
      </div>
    );
    if (isDoc) {
      innerContent = (
        <div className="flex flex-row flex-grow-0 items-start">
          <Menu pathname={router.pathname} />
          {mdxContent}
        </div>
      );
    } else {
      innerContent = (
        <Fragment>
          <Nav />
          {mdxContent}
        </Fragment>
      );
    }
  } else {
    innerContent = (
      <Fragment>
        <Nav />
        <Component {...pageProps} />
      </Fragment>
    );
  }
  return (
    <ThemeProvider attribute="class">
      <div className="flex flex-col h-screen bg-white dark:bg-gray-800">
        <OpenGraph
          title={title ? `${title}Message Manager` : "Message Manager"}
        />
        {innerContent}
        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default MyApp;
