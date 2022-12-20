import { useCallback, useState } from "react";
import useLocale from "~/hooks/useLocale";
import { getDisplayDate } from "~/lib/date.utils";
import type { Report } from "~/lib/reports.types";
import Down from "../icons/down";
import Up from "../icons/up";
import ReportProfile from "./reportProfile";

export default function ReportSideBar({
  report,
  mobile,
}: {
  report: Report;
  mobile: boolean;
}) {
  const [active, setActive] = useState(!mobile); // If mobile start collapsed, otherwise should always be expanded
  const onClick = useCallback(() => {
    if (mobile) {
      setActive((prev) => !prev);
    } else {
      setActive(true);
    }
  }, [mobile]);
  const assignedComponent = report.assigned_staff_id ? (
    <ReportProfile id={report.assigned_staff_id} />
  ) : (
    "Not Assigned"
  );
  const locale = useLocale();

  return (
    <div
      className={`${
        mobile ? `lg:hidden` : `hidden lg:block mt-6`
      } flex flex-col justify-end items-start`}
    >
      {/* Side panel with information about the report */}
      <div
        className={`flex flex-col justify-between p-3 bg-slate-50 w-full dark:bg-slate-700 shadow-md rounded-md ml-2 mb-2`}
      >
        <button
          className={`flex flex-row justify-start items-center ${
            mobile ? "" : "hidden"
          }`}
          onClick={mobile ? onClick : undefined}
        >
          <div className="p-2 hover:bg-slate-200 hover:dark:bg-slate-500 rounded-md ">
            <Down className={`h-4 w-4 ${active ? "hidden" : ""}`} />
            <Up className={`h-4 w-4 ${!active ? "hidden" : ""}`} />
          </div>
          <span className="text-xl font-semibold">Report Information</span>
        </button>
        <div
          className={`flex flex-col justify-between ${active ? "" : "hidden"} ${
            mobile ? "border-t-2 dark:border-slate-200 border-slate-500" : ""
          }`}
        >
          <span className={`text-xl font-bold ${mobile ? "hidden" : ""}`}>
            Report Information
          </span>
          <span className="text-sm py-2">Report ID: {report.id}</span>
          <span className="text-sm py-2">
            Reported in: {report.guild_data.name}
          </span>
          <span className="text-sm py-2">
            Created at: {getDisplayDate(report.created_at, locale)}
          </span>
          <span className="text-sm py-2">
            Updated at: {getDisplayDate(report.updated_at, locale)}
          </span>
          <span className="text-sm py-2">
            Status: {report.status[0].toUpperCase() + report.status.slice(1)}
          </span>
          <div className="flex flex-row justify-start items-center">
            <span className="text-sm py-2 mr-2">Reported by:</span>{" "}
            <ReportProfile id={report.reporting_user_id} />
          </div>
          <div className="flex flex-row justify-start items-center">
            <span className="text-sm py-2 mr-2">Assigned to:</span>{" "}
            {assignedComponent}
          </div>
        </div>
      </div>
    </div>
  );
}
