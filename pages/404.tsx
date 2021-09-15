import { H1, H2 } from "../components/mdx/heading";
import Paragraph from "../components/mdx/paragraph";
import Anchor from "../components/mdx/anchor";
import Link from "next/link";

export default function Custom404() {
  return (
    <div className="container mx-auto px-6 flex-grow flex flex-col justify-center">
      {" "}
      {/*Flex box used to align content even though there is one child*/}
      <div className="container mx-auto px-6">
        <div className="mt-3 mb-2 md:mb-8 text-center">
          <H1>Not Found</H1>
          <H2>
            That page could not be found! Go{" "}
            <Anchor internal href="/">
              home
            </Anchor>
            ?
          </H2>
        </div>
      </div>
    </div>
  );
}
