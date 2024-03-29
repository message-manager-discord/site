import { returnJSONIfOK } from "./libUtils.types";
import type { SeverFunctionReturnType } from "./libUtils.types";
import type { Report, ReportMessage } from "./reports.types";
import { GetReportsStatus } from "./reports.types";
import { getToken, loginIfUnauthorized, requireUser } from "./user.server";
import { AppLoadContext } from "@remix-run/cloudflare";

type GetReportsInternal = {
  id: string;
  title: string;
  status: "pending" | "spam" | "actioned" | "invalid";
  reporting_user_id: string;
  assigned_staff_id?: string;
  guild_data: {
    icon?: string;
    name?: string;
  };
  guild_id: string;
  created_at: string;
  updated_at: string;
  message_count: number;
}[];

type GetReportsResponse = {
  reports: GetReportsInternal;
  report_count: number;
  skipped: number;
};

async function getReports({
  request,
  context,
  skip,
  limit,
  status,
}: {
  request: Request;
  context: AppLoadContext;
  skip: number;
  limit: number;
  status?: GetReportsStatus;
}): Promise<SeverFunctionReturnType<GetReportsResponse>> {
  await requireUser({ request, context });
  const token = await getToken(request)!;
  const reports = await fetch(
    `${context.API_BASE_URL}/v1/reports?skip=${skip}&limit=${limit}${
      status !== undefined && status !== null && status !== GetReportsStatus.ALL
        ? `&status=${status}`
        : ""
    }`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  loginIfUnauthorized(request, reports);
  return await returnJSONIfOK<GetReportsResponse>(reports);
}

async function getMessageCanBeReported({
  request,
  context,
  message_link,
}: {
  request: Request;
  context: AppLoadContext;
  message_link: string;
}): Promise<SeverFunctionReturnType<boolean>> {
  await requireUser({ request, context });
  const token = await getToken(request)!;

  const { message_id, channel_id } = parseAndReturnMessageLink(message_link);

  const response = await fetch(
    `${context.API_BASE_URL}/v1/reports/can-report?message_id=${message_id}&channel_id=${channel_id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  loginIfUnauthorized(request, response);
  return await returnJSONIfOK<boolean>(response);
}

const parseAndReturnMessageLink = (
  message_link: string
): { message_id: string; channel_id: string } => {
  // parse message link for message id and channel id
  const messageLinkRegex =
    /^(https:\/\/){0,1}((ptb|canary)\.){0,1}(discord\.com)\/channels\/(\d{18,22})\/(\d{18,22})\/(\d{18,22})$/gim;
  const match = messageLinkRegex.exec(message_link);
  if (match === null) {
    throw new Error("Invalid message link");
  }
  const [, , , , , , channel_id, message_id] = match;
  return { message_id, channel_id };
};

async function createReport({
  request,
  context,
  title,
  reason,
  message_link,
}: {
  request: Request;
  context: AppLoadContext;
  title: string;
  reason: string;
  message_link: string;
}): Promise<SeverFunctionReturnType<Report>> {
  await requireUser({ request, context });
  const token = await getToken(request)!;

  const { message_id, channel_id } = parseAndReturnMessageLink(message_link);

  const response = await fetch(`${context.API_BASE_URL}/v1/reports`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title,
      reason,
      message_id,
      channel_id,
    }),
  });
  loginIfUnauthorized(request, response);
  return await returnJSONIfOK<Report>(response);
}

async function getReport({
  request,
  context,
  id,
}: {
  request: Request;
  context: AppLoadContext;
  id: string;
}): Promise<SeverFunctionReturnType<Report>> {
  await requireUser({ request, context });
  const token = await getToken(request)!;
  const response = await fetch(`${context.API_BASE_URL}/v1/reports/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  loginIfUnauthorized(request, response);
  return await returnJSONIfOK<Report>(response);
}

async function sendReportMessage({
  request,
  context,
  id,
  content,
  staffOnly,
}: {
  request: Request;
  context: AppLoadContext;
  id: string;
  content: string;
  staffOnly?: boolean;
}): Promise<SeverFunctionReturnType<ReportMessage>> {
  await requireUser({ request, context });
  const token = await getToken(request)!;
  const response = await fetch(
    `${context.API_BASE_URL}/v1/reports/${id}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content,
        staff_only: staffOnly ?? false,
      }),
    }
  );
  loginIfUnauthorized(request, response);
  return await returnJSONIfOK<ReportMessage>(response);
}
async function assignReport({
  request,
  context,
  userId,
  id,
}: {
  request: Request;
  context: AppLoadContext;
  userId?: string;
  id: string;
}): Promise<SeverFunctionReturnType<Report>> {
  const user = await requireUser({ request, context });

  const token = await getToken(request)!;
  const response = await fetch(
    `${context.API_BASE_URL}/v1/reports/${id}/assign`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        assigned_staff_id: userId ?? user.id,
      }),
    }
  );
  loginIfUnauthorized(request, response);
  return await returnJSONIfOK<Report>(response);
}

async function closeReport({
  request,
  context,
  userId,
  id,
  message_to_reporting_user,
  staff_report_reason,
  status,
}: {
  request: Request;
  context: AppLoadContext;
  userId?: string;
  id: string;
  message_to_reporting_user: string;
  staff_report_reason?: string;
  status: "invalid" | "spam";
}): Promise<SeverFunctionReturnType<Report>> {
  await requireUser({ request, context });

  const token = await getToken(request)!;
  const response = await fetch(
    `${context.API_BASE_URL}/v1/reports/${id}/close`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status,
        message_to_reporting_user,
        staff_report_reason,
      }),
    }
  );
  loginIfUnauthorized(request, response);
  return await returnJSONIfOK<Report>(response);
}

export {
  getReport,
  getReports,
  getMessageCanBeReported,
  createReport,
  sendReportMessage,
  assignReport,
  closeReport,
};
export type { GetReportsResponse };
