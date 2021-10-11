/* eslint-disable @next/next/no-img-element */
// Disabled because I don't want to use Image for cdn.discordapp.com
import useUser, { StoredUserData } from "../lib/auth/UseUser";
import Image from "next/image";
import { logout } from "../lib/auth/auth";

function UserBanner() {
  const { loading, user, mutate, loggedOut } = useUser();
  if (loggedOut) {
    return (
      <div className="flex flex-row md:px-4">
        <a
          className="flex-grow"
          href={`${process.env.NEXT_PUBLIC_AUTH_URL}/auth/login`}
        >
          <span className="pt-1 transition duration-300 ease-in-out text-lg font-medium md:px-4 text-gray-600 hover:text-blue-500 dark:text-gray-200 dark:hover:text-white">
            Log in
          </span>
        </a>
      </div>
    );
  }
  if (loading) {
    return (
      <div className="flex flex-row md:px-4">
        <span className="pt-1 text-normal font-medium md:px-4 text-gray-600  dark:text-gray-200">
          Loading...
        </span>
      </div>
    );
  }
  if (!user) {
    return (
      <div className="flex flex-row md:px-4">
        <span className="pt-1  text-normal font-medium md:px-4 text-gray-600 dark:text-gray-200">
          Unable to fetch user data
        </span>
      </div>
    );
  }
  return (
    <div className="flex flex-row md:px-4">
      <img
        src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?height=32&width=32`}
        alt="User avatar"
        width="32"
        height="32"
        className="rounded-full"
      />
      <a
        href={`${process.env.NEXT_PUBLIC_AUTH_URL}/auth/logout`}
        className="px-2 pt-1 transition duration-300 ease-in-out text-normal font-medium md:px-4 text-gray-600 hover:text-blue-500 dark:text-gray-200 dark:hover:text-white"
      >
        <span>{`${user.username}#${user.discriminator}`}</span>
      </a>
    </div>
  );
}
export default UserBanner;
