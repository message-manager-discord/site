// Display an error page from the querystring

import { json } from "@remix-run/cloudflare";

import type { LoaderFunction } from "@remix-run/cloudflare";
import { useLoaderData, useNavigate } from "@remix-run/react";

import H1 from "~/components/headings/h1";
import H2 from "~/components/headings/h2";
import { useEffect } from "react";

export const loader: LoaderFunction = ({ request }) => {
  const query = new URLSearchParams(request.url.split("?")[1]);
  const error = query.get("error");
  const errorName = query.get("errorName");
  return json({
    error,
    errorName,
  });
};

export default function AuthError() {
  const { error, errorName } = useLoaderData();
  const navigate = useNavigate();

  useEffect(() => {
    if (!error || !errorName) {
      navigate("/");
    }
  });

  return (
    <div className="container mx-auto px-6 grow flex flex-col justify-center pt-6">
      {" "}
      {/*Flex box used to align content even though there is one child*/}
      <div className="container mx-auto px-6">
        <div className="mt-3 mb-2 md:mb-8 text-center">
          <H1>{errorName}</H1>
          <H2>{error}</H2>
        </div>
      </div>
    </div>
  );
}
