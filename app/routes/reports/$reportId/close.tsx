import { json } from "@remix-run/cloudflare";
import type { ActionFunction } from "@remix-run/cloudflare";
import { useActionData, useParams } from "@remix-run/react";
import Anchor from "~/components/anchor";
import { isErrorReturn } from "~/lib/libUtils.types";
import { closeReport } from "~/lib/reports.server";
import type { Report } from "~/lib/reports.types";

interface ActionErrorResponseCloseReport {
  error: string;
  status?: "invalid" | "spam";
  message_to_reporting_user?: string;
  staff_report_reason?: string;
}

function closeReportIsError(
  response: unknown
): response is ActionErrorResponseCloseReport {
  if (response && typeof response === "object") {
    return (response as ActionErrorResponseCloseReport).error !== undefined;
  } else {
    return false;
  }
}

export const action: ActionFunction = async ({ request, params, context }) => {
  const data = await request.formData();
  const status = data.get("status")?.toString();

  const message_to_reporting_user = data.get("message")?.toString();
  const staff_report_reason = data.get("staff-reason")?.toString();
  // validate status
  if (status !== "invalid" && status !== "spam") {
    return json<ActionErrorResponseCloseReport>({
      error: `Status must be one of "invalid" or "spam" but was "${status}"`,
      message_to_reporting_user,
      staff_report_reason,
      // not including status here because it's invalid
    });
  }
  // validate message (required)
  if (!message_to_reporting_user) {
    return json<ActionErrorResponseCloseReport>({
      error: `Message to reporting user is required`,
      status,
      staff_report_reason,
    });
  }

  const report = await closeReport({
    request,
    id: params.reportId as string,
    status,
    message_to_reporting_user,
    staff_report_reason,
    context,
  });
  if (isErrorReturn(report)) {
    return json<ActionErrorResponseCloseReport>({
      error: ((await report.response.json()) as any).message,
      status,
      message_to_reporting_user,
      staff_report_reason,
    });
  }
  return json<Report>(report);
};
type CloseReportResponseType =
  | ActionErrorResponseCloseReport
  | Report
  | undefined;

// for no js users export a component with a success message that includes a link to the report page

export default function AssignReport() {
  const id = useParams().reportId;
  const data = useActionData<CloseReportResponseType>();
  if (data === undefined) {
    return (
      <div className="flex flex-col justify-center items-center">
        <h2 className="text-2xl font-bold">
          You seem to have arrived here when you shouldn't have...
        </h2>
        <Anchor to={`/reports/${id}`}>View Report?</Anchor>
      </div>
    );
  } else if (!closeReportIsError(data)) {
    return (
      <div className="flex flex-col justify-center items-center">
        <h1 className="text-2xl">Report Closed</h1>
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

export type { CloseReportResponseType };
export { closeReportIsError };
