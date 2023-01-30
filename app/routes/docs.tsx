import { Outlet } from "@remix-run/react";
//import toast from "react-hot-toast";
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
/*
<div
  class="go2072408551"
  style="animation: 0.35s cubic-bezier(0.21, 1.02, 0.73, 1) 0s 1 normal forwards running go3223188581;"
>
  <div class="go685806154">
    <div class="go1858758034"></div>
    <div class="go1579819456">
      <div class="go2534082608"></div>
    </div>
  </div>
  <div role="status" aria-live="polite" class="go3958317564">
    HELLO
  </div>
</div>;*/
