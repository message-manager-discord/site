import { json } from "@remix-run/cloudflare";
import type { ActionFunction } from "@remix-run/cloudflare";
import { useActionData, useParams } from "@remix-run/react";
import Anchor from "~/components/anchor";
import { isErrorReturn } from "~/lib/libUtils.types";
import { sendReportMessage } from "~/lib/reports.server";
import type { ReportMessage } from "~/lib/reports.types";

interface ActionErrorResponseSendMessage {
  error: string;
  content?: string;
}

function sendMessageIsError(
  response: unknown
): response is ActionErrorResponseSendMessage {
  if (response && typeof response === "object") {
    return (response as ActionErrorResponseSendMessage).error !== undefined;
  } else {
    return false;
  }
}

export const action: ActionFunction = async ({ request, params, context }) => {
  const data = await request.formData();
  const content = data.get("content")?.toString();

  if (!content) {
    return json<ActionErrorResponseSendMessage>({
      error: "content is required",
    });
  }
  const report = await sendReportMessage({
    request,
    id: params.reportId as string,
    content,
    context,
  });
  if (isErrorReturn(report)) {
    return json<ActionErrorResponseSendMessage>({
      error: ((await report.response.json()) as any).message,
      content,
    });
  }
  return json<ReportMessage>(report);
};
type SendMessageResponseType =
  | ActionErrorResponseSendMessage
  | ReportMessage
  | undefined;

// for no js users export a component with a success message that includes a link to the report page

export default function SendMessage() {
  const id = useParams().reportId;
  const data = useActionData<SendMessageResponseType>();
  if (data === undefined) {
    return (
      <div className="flex flex-col justify-center items-center">
        <h2 className="text-2xl font-bold">
          You seem to have arrived here when you shouldn't have...
        </h2>
        <Anchor to={`/reports/${id}`}>View Report?</Anchor>
      </div>
    );
  } else if (!sendMessageIsError(data)) {
    return (
      <div className="flex flex-col justify-center items-center">
        <h1 className="text-2xl">Message Sent</h1>
        <Anchor to={`/reports/${id}`}>View Report?</Anchor>
      </div>
    );
  } else
    return (
      <div className="flex flex-col justify-center items-center">
        <h1 className="text-red-500 text-2xl">Error</h1>
        <p className="text-red-500">{data.error}</p>
        <Anchor to={`/reports/${id}`}>View Report</Anchor>
      </div>
    );
}

export type { SendMessageResponseType };
export { sendMessageIsError };
