// display a single report

import type { LoaderFunction } from "@remix-run/cloudflare";
import {
  useFetcher,
  useLoaderData,
  useLocation,
  useSearchParams,
  useSubmit,
} from "@remix-run/react";
import H2 from "~/components/headings/h2";
import ReportSideBar from "~/components/reports/reportSideBar";
import ReportMessages from "~/components/reports/reportMessages";
import { checkIfErrorReturn } from "~/lib/libUtils.types";
import { getReport } from "~/lib/reports.server";
import type { Report } from "~/lib/reports.types";
import { useEffect, useRef, useState, useCallback } from "react";
import { sendMessageIsError } from "./send-message";
import type { SendMessageResponseType } from "./send-message";
import useUser from "~/hooks/useUser";
import type { AssignReportResponseType } from "./assign";
import { closeReportIsError } from "./close";
import type { CloseReportResponseType } from "./close";

type ReportActionOptions =
  | "send-message"
  | "mark-as-spam"
  | "mark-as-invalid"
  | "take-action";

export const loader: LoaderFunction = async ({
  params,
  request,
}): Promise<Report> => {
  const reportId = params.reportId as string;
  const reportResponse = await getReport({ request, id: reportId });
  return await checkIfErrorReturn(reportResponse);
};

export default function ReportPage() {
  const submit = useSubmit();
  const report = useLoaderData<Report>();
  const location = useLocation();
  const sendMessageFetcher = useFetcher();
  const assignFetcher = useFetcher();
  const closeReportFetcher = useFetcher();
  const closeReportIsFetching =
    closeReportFetcher.state === "loading" ||
    closeReportFetcher.state === "submitting";
  const sendMessageisFetching =
    sendMessageFetcher.state === "loading" ||
    sendMessageFetcher.state === "submitting";
  const sendMessageFetchedData =
    sendMessageFetcher.data as SendMessageResponseType;
  const closeReportFetchedData =
    closeReportFetcher.data as CloseReportResponseType;
  const sendFormRef = useRef<HTMLFormElement>(null);
  const closeReportFormRef = useRef<HTMLFormElement>(null);

  const user = useUser();
  const isClosed = ["invalid", "actioned", "spam"].includes(report.status);

  // for both send and closing
  // this is to clear the fields are they have been submitted
  useEffect(() => {
    if (!sendMessageIsError(sendMessageFetchedData) && !sendMessageisFetching) {
      sendFormRef.current?.reset();
    }
  }, [sendMessageFetchedData, sendMessageisFetching]);
  useEffect(() => {
    if (
      !closeReportIsError(closeReportFetchedData) &&
      !closeReportIsFetching &&
      closeReportFetchedData
    ) {
      closeReportFormRef.current?.reset();
      setActionState("send-message");
    }
  }, [closeReportFetchedData, closeReportIsFetching]);

  // pending: blue, spam: red, actioned: purple, invalid: grey, assigned: blue
  let statusColor: string;
  switch (report.status) {
    case "pending":
      statusColor = "bg-blue-700 dark:bg-blue-600";
      break;
    case "spam":
      statusColor = "bg-red-700 dark:bg-red-600";
      break;
    case "actioned":
      statusColor = "bg-purple-700 dark:bg-purple-600";
      break;
    case "invalid":
      statusColor = "bg-slate-700 dark:bg-slate-600";
      break;
    default:
      statusColor = "bg-blue-700 dark:bg-blue-600";
      break;
  }
  const [search] = useSearchParams();
  let currentAction: ReportActionOptions =
    (search.get("action") as ReportActionOptions | undefined) ?? "send-message";
  // also validate action
  if (
    ![
      "send-message",
      "mark-as-spam",
      "mark-as-invalid",
      "take-action",
    ].includes(currentAction) ||
    isClosed
  ) {
    currentAction = "send-message";
  }
  if (!user.loggedIn || !user.staff) {
    currentAction = "send-message";
  }

  const [actionState, setActionState] =
    useState<ReportActionOptions>(currentAction);
  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setActionState(e.target.value as ReportActionOptions);
      submit(e.target.form);
    },
    [setActionState, submit]
  );

  const sendComponent = (
    <sendMessageFetcher.Form
      method="post"
      ref={sendFormRef}
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
          {sendMessageIsError(sendMessageFetchedData) && (
            <div className="text-red-500 text-sm mb-1">
              Error: {sendMessageFetchedData.error}
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
            required
          ></textarea>
        </div>
        <button
          type="submit"
          className="inline-flex justify-center p-2 text-blue-600 rounded-full cursor-pointer hover:bg-blue-100 dark:text-blue-500 dark:hover:bg-slate-600 disabled:text-slate-400 disabled:dark:text-slate-400 disabled:cursor-not-allowed disabled:hover:bg-slate-100 disabled:hover:dark:bg-slate-600"
          disabled={isClosed}
          title={isClosed ? "This report is closed" : ""}
          onSubmit={useCallback(() => {
            // the idea is to reset state to 'send-message' if it closes correctly
          }, [])}
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
    </sendMessageFetcher.Form>
  );
  const generateSpamOrInvalidComponent = (type: "spam" | "invalid") => {
    return (
      <closeReportFetcher.Form
        method="post"
        ref={closeReportFormRef}
        action={`${location.pathname}/close`}
        className=""
      >
        <input name="status" type="hidden" value={type} />

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
          <div className="flex flex-col items-start w-full mr-4 ml-2 py-2">
            {/** display error if error */}
            {closeReportIsError(closeReportFetchedData) && (
              <div className="text-red-500 text-sm mb-1">
                Error: {closeReportFetchedData.error}
              </div>
            )}
            <label
              htmlFor="message"
              className="block text-sm font-medium text-slate-700 dark:text-white"
            >
              Message to reporting user
            </label>

            <textarea
              id="message"
              name="message"
              disabled={isClosed}
              rows={1}
              className="block p-2.5 my-2 w-full text-sm text-slate-900 bg-white rounded-lg border border-slate-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-800 dark:border-slate-600 dark:placeholder-slate-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 disabled:opacity-75 disabled:cursor-not-allowed"
              placeholder={`Message to reporting user - detail why this report is ${type}`}
              title={isClosed ? "This report is closed" : ""}
              required
            ></textarea>
            <label
              htmlFor="staff-reason"
              className="block text-sm font-medium text-slate-700 dark:text-white"
            >
              Message for staff
            </label>
            <textarea
              id="staff-reason"
              name="staff-reason"
              disabled={isClosed}
              rows={1}
              className="block p-2.5 my-2 w-full text-sm text-slate-900 bg-white rounded-lg border border-slate-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-800 dark:border-slate-600 dark:placeholder-slate-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 disabled:opacity-75 disabled:cursor-not-allowed"
              placeholder="Message for staff - for anything that you want to add privately"
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
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path d="M3.375 3C2.339 3 1.5 3.84 1.5 4.875v.75c0 1.036.84 1.875 1.875 1.875h17.25c1.035 0 1.875-.84 1.875-1.875v-.75C22.5 3.839 21.66 3 20.625 3H3.375z" />
              <path
                fillRule="evenodd"
                d="M3.087 9l.54 9.176A3 3 0 006.62 21h10.757a3 3 0 002.995-2.824L20.913 9H3.087zM12 10.5a.75.75 0 01.75.75v4.94l1.72-1.72a.75.75 0 111.06 1.06l-3 3a.75.75 0 01-1.06 0l-3-3a.75.75 0 111.06-1.06l1.72 1.72v-4.94a.75.75 0 01.75-.75z"
                clipRule="evenodd"
              />
            </svg>

            <span className="sr-only">Send message</span>
          </button>
        </div>
      </closeReportFetcher.Form>
    );
  };
  const spamComponent = generateSpamOrInvalidComponent("spam");
  const invalidComponent = generateSpamOrInvalidComponent("invalid");

  const actionComponent = <p> "mark-as-actioned"</p>;

  return (
    <div className="grow container mx-auto flex flex-col">
      <div className="grow flex flex-col justify-between items-start px-2">
        <div className="grow flex flex-col items-stretch lg:flex-row justify-between  w-full">
          <div className="w-full lg:w-3/4 p-4 flex flex-col items-stretch justify-between">
            <div className="flex flex-row justify-between items-center w-full">
              <H2 className="px-4">Title: {report.title}</H2>
              <div
                className={`mt-4 text-white font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 ${statusColor}`}
              >
                {report.status.slice(0, 1).toUpperCase() +
                  report.status.slice(1)}
              </div>
            </div>
            {/* mobile sidebar - shows above content on small screens */}
            <ReportSideBar report={report} mobile />{" "}
            <ReportMessages report={report} />
            {/* Send message form */}
            <div className="bg-slate-100 dark:bg-slate-600 rounded-lg px-2 mt-2 flex flex-col items-stretch">
              {user.loggedIn && user.staff && !isClosed && (
                <div className="flex flex-row items-center justify-start px-2">
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
                    method="get"
                    action={`${location.pathname}`}
                    className="text-sm font-medium text-center text-slate-500 border-b border-slate-400 dark:text-slate-400 dark:border-slate-500 w-full"
                  >
                    <ul className="flex flex-wrap -mb-px">
                      <li className="mr-2">
                        <input
                          type="radio"
                          id="send-message"
                          value="send-message"
                          name="action"
                          onChange={onChange}
                          className="hidden peer/send"
                          defaultChecked={currentAction === "send-message"}
                        />
                        <label
                          htmlFor="send-message"
                          className="inline-block p-4 text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 peer-checked/send:text-blue-600 peer-checked/send:hover:text-blue-600 peer-checked/send:dark:text-blue-500 peer-checked/send:dark:hover:text-blue-500 rounded-t-lg border-b-2 border-transparent peer-checked/send:border-blue-600 hover:border-slate-300 peer-checked/send:hover:border-blue-600 peer-checked/send:active  peer-checked/send:dark:border-blue-500 peer-checked/send:dark:hover:border-blue-500"
                        >
                          Send Message
                        </label>
                      </li>
                      <li className="mr-2">
                        <input
                          type="radio"
                          id="mark-as-spam"
                          value="mark-as-spam"
                          name="action"
                          onChange={onChange}
                          className="hidden peer/spam"
                          defaultChecked={currentAction === "mark-as-spam"}
                        />
                        <label
                          htmlFor="mark-as-spam"
                          className="inline-block p-4 text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 peer-checked/spam:text-blue-600 peer-checked/spam:hover:text-blue-600 peer-checked/spam:dark:text-blue-500 peer-checked/spam:dark:hover:text-blue-500 rounded-t-lg border-b-2 border-transparent peer-checked/spam:border-blue-600 hover:border-slate-300 peer-checked/spam:hover:border-blue-600 peer-checked/spam:active  peer-checked/spam:dark:border-blue-500 peer-checked/spam:dark:hover:border-blue-500"
                        >
                          Mark as Spam
                        </label>
                      </li>
                      <li className="mr-2">
                        <input
                          type="radio"
                          id="mark-as-invalid"
                          value="mark-as-invalid"
                          name="action"
                          onChange={onChange}
                          className="hidden peer/invalid"
                          defaultChecked={currentAction === "mark-as-invalid"}
                        />
                        <label
                          htmlFor="mark-as-invalid"
                          className="inline-block p-4 text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 peer-checked/invalid:text-blue-600 peer-checked/invalid:hover:text-blue-600 peer-checked/invalid:dark:text-blue-500 peer-checked/invalid:dark:hover:text-blue-500 rounded-t-lg border-b-2 border-transparent peer-checked/invalid:border-blue-600 hover:border-slate-300 peer-checked/invalid:hover:border-blue-600 peer-checked/invalid:active  peer-checked/invalid:dark:border-blue-500 peer-checked/invalid:dark:hover:border-blue-500"
                        >
                          Mark as Invalid
                        </label>
                      </li>
                      <li className="mr-2">
                        <input
                          type="radio"
                          id="take-action"
                          value="take-action"
                          name="action"
                          onChange={onChange}
                          className="hidden peer/action"
                          defaultChecked={currentAction === "take-action"}
                        />
                        <label
                          htmlFor="take-action"
                          className="inline-block p-4 text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 peer-checked/action:text-blue-600 peer-checked/action:hover:text-blue-600 peer-checked/action:dark:text-blue-500 peer-checked/action:dark:hover:text-blue-500 rounded-t-lg border-b-2 border-transparent peer-checked/action:border-blue-600 hover:border-slate-300 peer-checked/action:hover:border-blue-600 peer-checked/action:active  peer-checked/action:dark:border-blue-500 peer-checked/action:dark:hover:border-blue-500"
                        >
                          Take Action
                        </label>
                      </li>
                    </ul>
                  </assignFetcher.Form>
                </div>
              )}
              <div className={actionState === "send-message" ? "" : "hidden"}>
                {sendComponent}
              </div>
              <div className={actionState === "mark-as-spam" ? "" : "hidden"}>
                {spamComponent}
              </div>
              <div
                className={actionState === "mark-as-invalid" ? "" : "hidden"}
              >
                {invalidComponent}
              </div>
              <div className={actionState === "take-action" ? "" : "hidden"}>
                {actionComponent}
              </div>
            </div>
          </div>
          <ReportSideBar report={report} mobile={false} />{" "}
          {/* desktop sidebar shows to the side of content on large screens*/}
        </div>
      </div>
    </div>
  );
}
