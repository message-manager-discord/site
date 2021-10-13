/* eslint-disable @next/next/no-img-element */
// Disabled because I don't want to use Image for cdn.discordapp.com
import useUser, { StoredUserData } from "../lib/auth/UseUser";
import Link from "next/link";
import classNames from "classnames";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import ChevronLeft from "./icons/chevronLeft";
import ChevronDown from "./icons/chevronDown";
import ChevronUp from "./icons/chevronUp";

type LinkProps = JSX.IntrinsicElements["a"] & {
  internal?: boolean;
  href: string;
};

function InternalOrExternalLink({
  href,
  className,
  internal,
  children,
  role,
}: LinkProps) {
  if (internal) {
    return (
      <Link href={href}>
        <a className={className} role={role}>
          {children}
        </a>
      </Link>
    );
  } else {
    return (
      <a className={className} href={href} role={role}>
        {children}
      </a>
    );
  }
}

interface LinkData {
  internal?: boolean;
  href: string;
}
export interface ProfileLinkData {
  label: string;
  link: LinkData;
}

function UserBanner({ user }: { user: StoredUserData }) {
  return (
    <div className="flex flex-row">
      <img
        src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?height=32&width=32`}
        alt="User avatar"
        width="32"
        height="32"
        className="rounded-full"
      />

      <span className="py-1 px-1">{`${user.username}#${user.discriminator}`}</span>
    </div>
  );
}

function UserMenu({ mobile }: { mobile?: boolean }) {
  const [active, setActive] = useState(false);

  const handleClick = () => {
    setActive(!active);
  };
  const router = useRouter();
  useEffect(() => {
    const handleRouteChange = () => {
      setActive(false);
    };

    router.events.on("routeChangeComplete", handleRouteChange);

    // If the component is unmounted, unsubscribe
    // from the event with the `off` method:
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  });

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
        <span className="pt-1 text-normal font-medium md:px-4 text-gray-600 dark:text-gray-200">
          Unable to fetch user data
        </span>
      </div>
    );
  }
  let items: ProfileLinkData[] = [
    {
      label: "Dashboard",
      link: {
        href: "/dashboard",
        internal: true,
      },
    },
    {
      label: "Logout",
      link: {
        href: `${process.env.NEXT_PUBLIC_AUTH_URL}/auth/logout`,
      },
    },
  ];
  if (user.staff) {
    const staffProfileData: ProfileLinkData = {
      label: "Admin",
      link: { internal: true, href: "/admin" },
    };
    items = [staffProfileData].concat(items);
  }
  if (!mobile) {
    return (
      <div className="relative inline-block text-left">
        <div>
          <button
            type="button"
            onClick={handleClick}
            className={`mt-1 flex items-center justify-center w-full rounded-md px-4 transition duration-300 ease-in-out text-normal font-medium md:px-4 text-gray-600 hover:text-blue-500 dark:text-gray-200 dark:hover:text-white`}
            id="options-menu"
          >
            <UserBanner user={user} />

            {active ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </button>
        </div>

        {active && (
          <div className="origin-top-right absolute right-0 mt-5 w-52 rounded-md shadow-lg bg-blue-50 dark:bg-gray-700 ring-1 ring-black dark:ring-gray-500 ring-opacity-5">
            <div
              className={`flex-col divide-y-2 divide-gray-500 ${
                false ? "divide-y divide-gray-100" : ""
              }`}
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="options-menu"
            >
              {items.map((item, index) => {
                let roundedClass = "";
                if (index === 0) {
                  roundedClass = "rounded-t-md";
                } else if (index === items.length - 1) {
                  roundedClass = "rounded-b-md";
                }
                return (
                  <InternalOrExternalLink
                    key={item.label}
                    href={item.link.href}
                    internal={item.link.internal}
                    className={classNames(
                      "block px-4 py-2 text-md text-gray-700 hover:text-gray-600 hover:bg-blue-100 dark:text-gray-200 dark:hover:text-white dark:hover:bg-gray-600",
                      roundedClass,
                    )}
                    role="menuitem"
                  >
                    <span className="flex flex-col">
                      <span>{item.label}</span>
                    </span>
                  </InternalOrExternalLink>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  } else {
    return (
      <div className="text-gray-600 dark:text-gray-200">
        <UserBanner user={user} />
        {items.map((item) => {
          return (
            <div className="flex pt-1 ml-1.5" key={item.label}>
              <div>
                <ChevronLeft className="h-5 w-5 mt-0.5" />
              </div>
              <InternalOrExternalLink
                href={item.link.href}
                internal={item.link.internal}
                className="px-2.5 transition duration-300 ease-in-out text-md  md:px-4 text-gray-600 hover:text-blue-500 dark:text-gray-200 dark:hover:text-white"
              >
                <span className="flex flex-col">
                  <span>{item.label}</span>
                </span>
              </InternalOrExternalLink>
            </div>
          );
        })}
      </div>
    );
  }
}
export default UserMenu;
