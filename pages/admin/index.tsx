import Pie from "../../components/icons/pie";
import Anchor from "../../components/mdx/anchor";
import { H1 } from "../../components/mdx/heading";
import CheckNotStaff from "../../lib/auth/CheckNotStaff";

export default function Admin() {
  return (
    <CheckNotStaff>
      <H1 className="text-center">Admin Panel</H1>
      <div className="container mx-auto px-6 flex-grow flex flex-col justify-center">
        {" "}
        {/*Flex box used to align content even though there is one child*/}
        <div className="container mx-auto px-6">
          <div className="mt-3 mb-2 md:mb-8 text-center">
            <div className="container mx-auto px-6">
              <div className="flex flex-wrap justify-center items-center text-center gap-8">
                <div className="w-5/6 sm:w-3/5 md:w-1/2 lg:w-1/5 px-4 py-4 bg-gray-100 mt-6 shadow-lg rounded-lg dark:bg-gray-700 text-gray-500 dark:text-gray-300">
                  <div className="py-3 flex flex-row items-center justify-center">
                    <Pie />
                    <Anchor href="/admin/analytics" internal className="mx-2">
                      Analytics
                    </Anchor>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CheckNotStaff>
  );
}
