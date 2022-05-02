import { H1, H2 } from "../components/mdx/heading";
import InternalAnchor from "../components/mdx/internalAnchor";

export default function Custom404() {
  return (
    <div className="container mx-auto px-6 grow flex flex-col justify-center">
      {" "}
      {/*Flex box used to align content even though there is one child*/}
      <div className="container mx-auto px-6">
        <div className="mt-3 mb-2 md:mb-8 text-center">
          <H1>Not Found</H1>
          <H2>
            That page could not be found! Go{" "}
            <InternalAnchor href="/">home</InternalAnchor>?
          </H2>
        </div>
      </div>
    </div>
  );
}
