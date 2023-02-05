import { createContext, useContext } from "react";
import type { ReactNode } from "react";
import type { GetUserResponse } from "~/lib/user.server";

const UserContext = createContext<GetUserResponse>({
  loggedIn: false,
});

export function UserProvider({
  children,
  user,
}: {
  children: ReactNode;
  user: GetUserResponse;
}) {
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}

export default function useUser() {
  return useContext(UserContext);
}
