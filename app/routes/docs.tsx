import { Outlet } from "@remix-run/react";
import Menu from "~/components/menu";

export default function Page() {
  return (
    <div className="flex flex-row grow-0 items-start md:px-4 lg:px-10">
      <Menu />
      <div className="container shrink mx-auto pl-14 pr-5 md:px-6 lg:px-14 min-w-0 pt-5 grow">
        <Outlet />
      </div>
    </div>
  );
}
