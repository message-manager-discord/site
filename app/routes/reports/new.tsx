/**Contains a text input with the format https://discord.com/channels/serverid/channelid/messageid
 * When the input is valid (in the form https://discord.com/channels/xxx/xxx/xxx)
 * Call a get loader to call /check-message
 * If that is true, display a larger text input for the reporting reason
 * And a submit button when pressed calls a post action
 * If false, display an error message
 *
 */

import {
  ActionFunction,
  json,
  LoaderFunction,
  redirect,
} from "@remix-run/cloudflare";
import {
  Form,
  useActionData,
  useBeforeUnload,
  useLoaderData,
  useLocation,
  useSearchParams,
  useSubmit,
  useTransition,
} from "@remix-run/react";
import { Fragment, useCallback, useEffect, useState } from "react";
import H3 from "~/components/headings/h3";
import { createReport, getMessageCanBeReported } from "~/lib/reports.server";
import CatchBoundary from "~/components/CatchBoundary";
import { checkIfErrorReturn, isErrorReturn } from "~/lib/libUtils.types";

interface LoaderResponse {
  error?: string;
  valid: boolean;
}

export const loader: LoaderFunction = async ({ request, context }) => {
  // call /check-message
  // for now just return 50/50 false or true
  const query = new URL(request.url).searchParams;

  const message_link = query.get("message_link");

  // Check if message link is valid
  if (
    !message_link ||
    !/^(https:\/\/){0,1}((ptb|canary)\.){0,1}(discord\.com)\/channels\/(\d{18,22})\/(\d{18,22})\/(\d{18,22})$/gim.test(
      message_link
    )
  ) {
    return json({ valid: false, error: "Invalid message link" });
  }

  const isValid = await getMessageCanBeReported({
    request,
    message_link,
    context,
  });
  if (isValid) {
    return json<LoaderResponse>({ valid: true });
  } else {
    return json<LoaderResponse>({
      valid: false,
      error:
        "That message either does not exist or was not sent via the bot - so it cannot be reported",
    });
  }
};

interface ActionErrorResponse {
  error: string;
  reason?: string;
  title?: string;
}
interface ActionBody {
  reason: string;
}

export const action: ActionFunction = async ({ request, context }) => {
  // call /report
  const data = await request.formData();
  const reason = data.get("reason")?.toString();
  const title = data.get("title")?.toString();
  const message_link = data.get("message_link")?.toString();

  if (!message_link) {
    return json<ActionErrorResponse>({
      error: "Message link is required",
      reason,
      title,
    });
  }
  if (!reason) {
    return json<ActionErrorResponse>({
      error: "Reason is required",
      reason,
      title,
    });
  }
  if (!title) {
    return json<ActionErrorResponse>({
      error: "Title is required",
      reason,
      title,
    });
  }
  const newReportResponse = await createReport({
    request,
    reason,
    title,
    message_link,
    context,
  });

  if (isErrorReturn(newReportResponse)) {
    return json<ActionErrorResponse>({
      error: ((await newReportResponse.response.json()) as any).message,
      reason,
      title,
    });
  }

  return redirect(`/reports/${newReportResponse.id}`);
};

function MessageLinkForm() {
  const submit = useSubmit();
  const valid = useLoaderData<LoaderResponse>();
  const [searchParams] = useSearchParams();
  let message_link = searchParams.get("message_link") ?? undefined;
  if (message_link === "") {
    message_link = undefined;
  }
  const transition = useTransition();
  return (
    <Form method="get" className="p-3">
      <label
        htmlFor="message_link"
        className="block mb-2 text-sm font-medium text-slate-900 dark:text-slate-300"
      >
        Link to Message to Report
      </label>
      {!!valid.error && message_link !== undefined && (
        <p
          id="message-link-error"
          className="block mb-2 text-sm font-medium text-red-700 dark:text-red-500"
        >
          {valid.error}
        </p>
      )}
      {transition.state === "submitting" && (
        <span
          id="message-link-error"
          className="block mb-2 text-sm font-medium"
        >
          Loading...
          <svg
            aria-hidden="true"
            role="status"
            className="inline mx-2  w-4 h-4 text-slate-200 animate-spin dark:text-slate-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="#1C64F2"
            />
          </svg>
        </span>
      )}
      <input
        id="message_link"
        aria-describedby={valid.error ? "message-link-error" : undefined}
        type="text"
        name="message_link"
        defaultValue={message_link}
        placeholder="https://discord.com/channels/xxx/xxx/xxx"
        className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        onBlur={(e) => submit(e.currentTarget.form)}
      />{" "}
      {/*Todo update on transition*/}
    </Form>
  );
}

export default function NewReport() {
  const messageLinkData = useLoaderData<LoaderResponse>();
  const submitData = useActionData<ActionErrorResponse | undefined>();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const message_link = searchParams.get("message_link") ?? undefined;
  // Track title and reason so we can prevent the form from being submitted if they are set
  const [title, setTitle] = useState(submitData?.title ?? "");
  const [reason, setReason] = useState(submitData?.reason ?? "");
  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      if (e.currentTarget.name === "title") {
        setTitle(e.currentTarget.value);
      } else if (e.currentTarget.name === "reason") {
        setReason(e.currentTarget.value);
      }
    },
    []
  );
  useBeforeUnload(
    useCallback(() => {
      // Save title and reason to local storage
      if (title !== "" || reason !== "") {
        localStorage.setItem("new-report-title", title);
        localStorage.setItem("new-report-reason", reason);
      }
    }, [title, reason])
  );
  // load title and reason from local storage
  useEffect(() => {
    // only set each if submitData is undefined
    if (submitData === undefined) {
      setTitle(localStorage.getItem("new-report-title") ?? "");
      setReason(localStorage.getItem("new-report-reason") ?? "");
    }
    // No matter what clear
    localStorage.removeItem("new-report-title");
    localStorage.removeItem("new-report-reason");
  }, [submitData]);

  return (
    <div className="container grow mx-auto flex flex-col">
      <H3 className="text-center">Submit a Report</H3>
      <MessageLinkForm />

      <Form
        method="post"
        className="p-3 pt-0"
        action={location.pathname + location.search}
      >
        {!!submitData?.error && messageLinkData.error === undefined && (
          <p
            id="submit-error"
            className="block mb-2 text-sm font-medium text-red-700 dark:text-red-500"
          >
            {submitData.error}
          </p>
        )}
        <label
          htmlFor="title"
          className="block mb-2 text-sm font-medium text-slate-900 dark:text-slate-300"
        >
          Report Title
        </label>

        <input
          id="title"
          aria-describedby={submitData?.error ? "submit-error" : undefined}
          type="text"
          placeholder="Short summary of the report"
          maxLength={35}
          name="title"
          onChange={onChange}
          required
          value={title}
          className="mb-3 bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
        {/*Todo update on transition*/}
        <label
          htmlFor="reason"
          className="block mb-2 text-sm font-medium text-slate-900 dark:text-slate-400"
        >
          Report Reason
        </label>

        <textarea
          id="reason"
          onChange={onChange}
          aria-describedby={submitData?.error ? "submit-error" : undefined}
          name="reason"
          placeholder="Why are you reporting this message?"
          className="block p-2.5 w-full text-sm text-slate-900 bg-slate-50 rounded-lg border border-slate-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          maxLength={2000}
          value={reason}
          required
        />
        <input
          value={message_link}
          name="message_link"
          id="message_link"
          readOnly
          hidden
          aria-hidden
          className="hidden"
        ></input>
        <button
          type="submit"
          className="mt-4 text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:hover:bg-slate-700 disabled:dark:bg-slate-600 disabled:dark:hover:bg-slate-600 disabled:focus:ring-0"
        >
          Submit
        </button>
      </Form>
    </div>
  );
}

export { CatchBoundary };
