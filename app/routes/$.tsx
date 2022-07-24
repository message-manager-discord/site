import Anchor from "~/components/anchor";
import { H1, H2 } from "~/components/heading";

export default function NotFound() {
  return (
    <div className="container mx-auto px-6 grow flex flex-col justify-center pt-6">
      {" "}
      {/*Flex box used to align content even though there is one child*/}
      <div className="container mx-auto px-6">
        <div className="mt-3 mb-2 md:mb-8 text-center">
          <H1>Not Found</H1>
          <H2>
            That page could not be found! Go <Anchor to="/">home</Anchor>?
          </H2>
        </div>
      </div>
    </div>
  );
}
