import React, { Fragment } from "react";
import { H2 } from "../../components/mdx/heading";
import useUser from "./UseUser";

const CheckNotStaff = ({ children }: { children: React.ReactNode }) => {
  const { loading, user, loggedOut } = useUser();
  if (loading) {
    return (
      <div className="container mx-auto px-6 flex-grow flex flex-col justify-center">
        {" "}
        {/*Flex box used to align content even though there is one child*/}
        <div className="container mx-auto px-6">
          <div className="mt-3 mb-2 md:mb-8 text-center">
            <div className="container mx-auto px-6">
              <H2>Loading user info....</H2>
            </div>
          </div>
        </div>
      </div>
    );
  } else if (loggedOut || !user) {
    return (
      <div className="container mx-auto px-6 flex-grow flex flex-col justify-center">
        {" "}
        {/*Flex box used to align content even though there is one child*/}
        <div className="container mx-auto px-6">
          <div className="mt-3 mb-2 md:mb-8 text-center">
            <div className="container mx-auto px-6">
              <H2>You must be logged in to access this resource!</H2>
            </div>
          </div>
        </div>
      </div>
    );
  } else if (!user.staff) {
    return (
      <div className="container mx-auto px-6 flex-grow flex flex-col justify-center">
        {" "}
        {/*Flex box used to align content even though there is one child*/}
        <div className="container mx-auto px-6">
          <div className="mt-3 mb-2 md:mb-8 text-center">
            <div className="container mx-auto px-6">
              <H2>You must be staff to access this resource!</H2>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return <Fragment>{children}</Fragment>;
  }
};

export default CheckNotStaff;
