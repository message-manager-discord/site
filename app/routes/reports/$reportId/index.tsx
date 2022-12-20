// display a single report

import type { LoaderFunction } from "@remix-run/cloudflare";
import { useFetcher, useLoaderData, useLocation } from "@remix-run/react";
import H2 from "~/components/headings/h2";
import ReportSideBar from "~/components/reports/reportSideBar";
import ReportMessages from "~/components/reports/reportMessages";
import { checkIfErrorReturn } from "~/lib/libUtils.types";
import { getReport } from "~/lib/reports.server";
import type { Report } from "~/lib/reports.types";
import { useEffect, useRef } from "react";
import { sendMessageIsError } from "./send-message";
import type { SendMessageResponseType } from "./send-message";
import useUser from "~/hooks/useUser";
import { AssignReportResponseType } from "./assign";

export const loader: LoaderFunction = async ({
  params,
  request,
}): Promise<Report> => {
  const reportId = params.reportId as string;
  const reportResponse = await getReport({ request, id: reportId });
  return await checkIfErrorReturn(reportResponse);
};

export default function ReportPage() {
  const report = useLoaderData<Report>();
  const location = useLocation();
  const fetcher = useFetcher();
  const assignFetcher = useFetcher();
  const isFetching =
    fetcher.state === "loading" || fetcher.state === "submitting";
  const fetchedData = fetcher.data as SendMessageResponseType;
  const formRef = useRef<HTMLFormElement>(null);
  const user = useUser();
  const isClosed = ["invalid", "actioned", "spam"].includes(report.status);

  useEffect(() => {
    if (!sendMessageIsError(fetchedData) && !isFetching) {
      formRef.current?.reset();
    }
  }, [fetchedData, isFetching]);

  // pending: blue, spam: red, actioned: purple, invalid: grey, assigned: blue
  let statusColor: string;
  switch (report.status) {
    case "pending":
      statusColor =
        "bg-blue-700 hover:bg-blue-800 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800";
      break;
    case "spam":
      statusColor =
        "bg-red-700 hover:bg-red-800 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800";
      break;
    case "actioned":
      statusColor =
        "bg-purple-700 hover:bg-purple-800 focus:ring-purple-300 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-800";
      break;
    case "invalid":
      statusColor =
        "bg-slate-700 hover:bg-slate-800 focus:ring-slate-300 dark:bg-slate-600 dark:hover:bg-slate-700 dark:focus:ring-slate-800";
      break;
    default:
      statusColor =
        "bg-blue-700 hover:bg-blue-800 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800";
      break;
  }

  return (
    <div className="grow container mx-auto flex flex-col">
      <div className="grow flex flex-col justify-between items-start px-2">
        <div className="grow flex flex-col items-stretch lg:flex-row justify-between  w-full">
          <div className="w-full lg:w-3/4 p-4 flex flex-col items-stretch justify-between">
            <div className="flex flex-row justify-between items-center w-full">
              <H2 className="px-4">Title: {report.title}</H2>
              <div
                className={`mt-4 text-white focus:outline-none focus:ring-4 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 ${statusColor}`}
              >
                {report.status.slice(0, 1).toUpperCase() +
                  report.status.slice(1)}
              </div>
            </div>
            {/* mobile sidebar - shows above content on small screens */}
            <ReportSideBar report={report} mobile />{" "}
            <ReportMessages report={report} />
            {/* Send message form */}
            <div className="bg-slate-100 dark:bg-slate-600 rounded-lg px-2 mt-2 flex flex-col items-stretch divide-y-2 divide-slate-500">
              {user.loggedIn && user.staff && !isClosed && (
                <div className="flex flex-row items-center justify-start p-2">
                  {/**
                   * Only display if user is logged in, user is staff and report is not closed
                   * Display a button to accept a report - if report is not assigned
                   * Otherwise display a dropdown with the options to Send a message (default), mark as spam, mark as invalid, or take action
                   */}
                  {!report.assigned_staff_id && (
                    <assignFetcher.Form
                      method="post"
                      action={`${location.pathname}/assign`}
                    >
                      <div className="flex flex-col items-start w-full mr-4 ml-2">
                        {/** display error if error */}
                        {sendMessageIsError(
                          assignFetcher.data as AssignReportResponseType
                        ) && (
                          <div className="text-red-500 text-sm mb-1">
                            Error: {assignFetcher.data.error}
                          </div>
                        )}
                        <button
                          className="bg-green-700 hover:bg-green-800 focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 text-white focus:outline-none focus:ring-4 font-medium rounded-full text-sm px-5 py-2.5 text-center"
                          value="Accept"
                          name="accept-report"
                          type="submit"
                        >
                          Accept Report
                        </button>
                      </div>
                    </assignFetcher.Form>
                  )}
                  <assignFetcher.Form
                    method="post"
                    action={`${location.pathname}/assign`}
                  >
                    <div className="flex flex-col items-start w-full mr-4 ml-2">
                      {/** display error if error */}
                      {sendMessageIsError(
                        assignFetcher.data as AssignReportResponseType
                      ) && (
                        <div className="text-red-500 text-sm mb-1">
                          Error: {assignFetcher.data.error}
                        </div>
                      )}
                      <select
                        className="text-sm block w-full p-2.5 text-slate-900 bg-white rounded-xl border-2 border-slate-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-800 dark:border-slate-600 dark:placeholder-slate-400 dark:text-white focus:ring-2 focus:outline-none dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        name="action"
                        defaultValue="send-message"
                      >
                        <option value="send-message">Send Message</option>
                        <option value="mark-as-spam">Mark as Spam</option>
                        <option value="mark-as-invalid">Mark as Invalid</option>
                        <option value="take-action">Take Action</option>
                      </select>
                    </div>
                  </assignFetcher.Form>
                </div>
              )}
              <fetcher.Form
                method="post"
                ref={formRef}
                action={`${location.pathname}/send-message`}
                className=""
              >
                <label htmlFor="content" className="sr-only">
                  Your message
                </label>
                <div className="flex items-center rounded-lg">
                  <img
                    src={
                      user.loggedIn
                        ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
                        : "https://cdn.discordapp.com/embed/avatars/0.png"
                    }
                    alt="User avatar"
                    width="40"
                    height="40"
                    className="rounded-full m-2"
                  />
                  <div className="flex flex-col items-start w-full mr-4 ml-2">
                    {/** display error if error */}
                    {sendMessageIsError(fetchedData) && (
                      <div className="text-red-500 text-sm mb-1">
                        Error: {fetchedData.error}
                      </div>
                    )}

                    <textarea
                      id="content"
                      name="content"
                      disabled={isClosed}
                      rows={1}
                      className="block p-2.5 w-full text-sm text-slate-900 bg-white rounded-lg border border-slate-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-800 dark:border-slate-600 dark:placeholder-slate-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 disabled:opacity-75 disabled:cursor-not-allowed"
                      placeholder="Your message..."
                      title={isClosed ? "This report is closed" : ""}
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="inline-flex justify-center p-2 text-blue-600 rounded-full cursor-pointer hover:bg-blue-100 dark:text-blue-500 dark:hover:bg-slate-600 disabled:text-slate-400 disabled:dark:text-slate-400 disabled:cursor-not-allowed disabled:hover:bg-slate-100 disabled:hover:dark:bg-slate-600"
                    disabled={isClosed}
                    title={isClosed ? "This report is closed" : ""}
                  >
                    <svg
                      aria-hidden="true"
                      className="w-6 h-6 rotate-90"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
                    </svg>
                    <span className="sr-only">Send message</span>
                  </button>
                </div>
              </fetcher.Form>
            </div>
          </div>
          <ReportSideBar report={report} mobile={false} />{" "}
          {/* desktop sidebar shows to the side of content on large screens*/}
        </div>
      </div>
    </div>
  );
}
