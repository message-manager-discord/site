import { json } from "@remix-run/cloudflare";
import type { ActionFunction } from "@remix-run/cloudflare";
import { useActionData, useParams } from "@remix-run/react";
import Anchor from "~/components/anchor";
import { isErrorReturn } from "~/lib/libUtils.types";
import { assignReport } from "~/lib/reports.server";
import type { Report } from "~/lib/reports.types";

interface ActionErrorResponseAssignReport {
  error: string;
  userId?: string;
}

function assignReportIsError(
  response: unknown
): response is ActionErrorResponseAssignReport {
  if (response && typeof response === "object") {
    return (response as ActionErrorResponseAssignReport).error !== undefined;
  } else {
    return false;
  }
}

export const action: ActionFunction = async ({ request, params, context }) => {
  const data = await request.formData();
  const userId = data.get("user-id")?.toString();

  const report = await assignReport({
    request,
    id: params.reportId as string,
    userId,
    context,
  });
  if (isErrorReturn(report)) {
    return json<ActionErrorResponseAssignReport>({
      error: ((await report.response.json()) as any).message,
      userId,
    });
  }
  return json<Report>(report);
};
type AssignReportResponseType =
  | ActionErrorResponseAssignReport
  | Report
  | undefined;

// for no js users export a component with a success message that includes a link to the report page

export default function AssignReport() {
  const id = useParams().reportId;
  const data = useActionData<AssignReportResponseType>();
  if (data === undefined) {
    return (
      <div className="flex flex-col justify-center items-center">
        <h2 className="text-2xl font-bold">
          You seem to have arrived here when you shouldn't have...
        </h2>
        <Anchor to={`/reports/${id}`}>View Report?</Anchor>
      </div>
    );
  } else if (!assignReportIsError(data)) {
    return (
      <div className="flex flex-col justify-center items-center">
        <h1 className="text-2xl">Report Assigned</h1>
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

export type { AssignReportResponseType };
export { assignReportIsError };
