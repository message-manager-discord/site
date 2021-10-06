import useUser from "../lib/auth/UseUser";
import Link from "next/link";
import { Fragment } from "react";

function StaffLink() {
  const { user } = useUser();

  if (!user || !user.staff) {
    return <Fragment />;
  }
  return (
    <li className="py-2">
      <Link href="/admin">
        <a className="transition duration-300 ease-in-out text-lg font-medium md:px-4 text-gray-600 hover:text-blue-500 dark:text-gray-200 dark:hover:text-white">
          Admin
        </a>
      </Link>
    </li>
  );
}
export default StaffLink;
