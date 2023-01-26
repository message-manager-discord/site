import { json } from "@remix-run/cloudflare";
import type { LoaderFunction } from "@remix-run/cloudflare";
import {
  Form,
  Link,
  useLoaderData,
  useLocation,
  useNavigation,
  useSearchParams,
  useSubmit,
} from "@remix-run/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import classNames from "classnames";
import { getReports } from "~/lib/reports.server";
import type { GetReportsResponse } from "~/lib/reports.server";
import { GetReportsStatus } from "~/lib/reports.types";
import ErrorBoundary from "~/components/ErrorBoundary";
import { checkIfErrorReturn } from "~/lib/libUtils.types";
import ReportProfile from "~/components/reports/reportProfile";
import { getDisplayDate } from "~/lib/date.utils";
import useLocale from "~/hooks/useLocale";
import { userPreferences } from "~/lib/sessions.server";

const parseStatus = (status: string | null): GetReportsStatus | null => {
  const values: string[] = Object.values(GetReportsStatus);

  if (status && !values.includes(status)) {
    return null;
  } else {
    return status as GetReportsStatus;
  }
};

function StatusFilter({
  defaultStatus,
}: {
  defaultStatus: GetReportsStatus | undefined;
}) {
  const [active, setActive] = useState(false);
  const onClick = useCallback(() => setActive(!active), [active]);

  // We need to also set active to false if active is true and there is a click outside the dropdown
  const dropdownMenuRef = useRef<HTMLDivElement>(null);
  const onClickOutside = useCallback(
    (event: MouseEvent) => {
      if (
        active &&
        dropdownMenuRef.current &&
        !dropdownMenuRef.current.contains(event.target as Node)
      ) {
        setActive(false);
      }
    },
    [active]
  );

  useEffect(() => {
    document.addEventListener("click", onClickOutside);
    return () => document.removeEventListener("click", onClickOutside);
  }, [onClickOutside]);

  const submit = useSubmit();
  const [searchParams] = useSearchParams();
  const navigation = useNavigation();
  const isSubmitting =
    navigation.state === "loading" &&
    navigation.formData?.get("status") !== null;
  useEffect(() => {
    if (!isSubmitting) {
      setActive(false);
    }
  }, [isSubmitting]);
  let currentStatus = parseStatus(searchParams.get("status"));
  if (currentStatus === null && defaultStatus !== undefined) {
    currentStatus = defaultStatus;
  }
  if (!currentStatus) {
    currentStatus = GetReportsStatus.ALL;
  }
  const location = useLocation();
  const searchParamsWithoutStatus = new URLSearchParams(searchParams);
  searchParamsWithoutStatus.delete("status");
  searchParamsWithoutStatus.set("index", "");

  return (
    <Form
      action={`${location.pathname}?${searchParamsWithoutStatus}`}
      reloadDocument // TODO think about this
    >
      {/* The custom action is to preserve the other search param values */}
      <button
        id="dropdownRadioButton"
        data-dropdown-toggle="dropdownRadio"
        className="inline-flex items-center text-slate-500 bg-white border border-slate-300 focus:outline-none hover:bg-slate-100 font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-slate-800 dark:text-white dark:border-slate-600 dark:hover:bg-slate-700 dark:hover:border-slate-600"
        type="button"
        onClick={onClick}
      >
        <svg
          className="mr-2 w-4 h-4 text-slate-400"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
            clipRule="evenodd"
          ></path>
        </svg>
        {currentStatus !== null
          ? currentStatus[0].toUpperCase() + currentStatus.slice(1)
          : "All"}
        <svg
          className="ml-2 w-3 h-3"
          aria-hidden="true"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          ></path>
        </svg>
      </button>
      {/* Dropdown menu */}
      <div
        id="dropdownRadio"
        ref={dropdownMenuRef}
        className={classNames(
          "z-10 top w-48 pt-2 absolute bg-white rounded divide-y divide-slate-100 shadow dark:bg-slate-700 dark:divide-slate-600",
          {
            hidden: !active,
          }
        )}
      >
        <ul
          className="p-3 space-y-1 text-sm text-slate-700 dark:text-slate-200"
          aria-labelledby="dropdownRadioButton"
        >
          {Object.values(GetReportsStatus).map((status) => (
            <li key={status}>
              <label
                htmlFor={`filter-radio-status-${status}`}
                className="flex items-center p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-600"
              >
                <input
                  id={`filter-radio-status-${status}`}
                  type="radio"
                  value={status}
                  name="status"
                  className="w-4 h-4 text-blue-600 bg-slate-100 border-slate-300  dark:bg-slate-700 dark:border-slate-600"
                  checked={
                    currentStatus?.toLowerCase() === status.toLowerCase()
                  }
                  onChange={(e) => submit(e.currentTarget.form)}
                />

                <span className="ml-2 w-full text-sm font-medium text-slate-900 dark:text-slate-300">
                  {status[0].toUpperCase() + status.slice(1)}
                </span>
              </label>
            </li>
          ))}
        </ul>
      </div>
    </Form>
  );
}

function FilterAndSearch({
  defaultStatus,
}: {
  defaultStatus: GetReportsStatus | undefined;
}) {
  return (
    <div className="flex justify-between items-center p-4">
      <StatusFilter defaultStatus={defaultStatus} />
    </div>
  );
}

const reportsPerPage = 5;
const checkStatus = (status: string | null): GetReportsStatus | undefined => {
  if (
    (status && !Object.values(GetReportsStatus).includes(status as any)) ||
    !status
  ) {
    return undefined;
  } else {
    return status as GetReportsStatus | undefined;
  }
};

interface LoaderResponse {
  reports: GetReportsResponse;
  status: GetReportsStatus | undefined;
}

export const loader: LoaderFunction = async ({ request }) => {
  const query = new URLSearchParams(request.url.split("?")[1]);
  // parse skip correctly, and handle errors
  const skip = parseInt(query.get("skip") || "0") || 0;
  let status = query.get("status");
  // check if status is valid
  let parsedStatus = checkStatus(status);

  // if parsedStatus exists save it in cookie
  // otherwise attempt to fetch it from cookie

  const userPreferencesSession = await userPreferences.getSession(
    request.headers.get("Cookie")
  );
  console.log(parsedStatus);
  let cookieHeader = "";
  if (parsedStatus) {
    userPreferencesSession.set("status", parsedStatus);
    cookieHeader = await userPreferences.commitSession(userPreferencesSession);
  } else {
    parsedStatus = checkStatus(userPreferencesSession.get("status"));
  }

  return json<LoaderResponse>(
    {
      reports: await checkIfErrorReturn<GetReportsResponse>(
        await getReports({
          request,
          skip,
          status: parsedStatus,
          limit: reportsPerPage,
        })
      ),
      status: parsedStatus,
    },
    {
      headers: {
        "Set-Cookie": cookieHeader,
      },
    }
  );
};

export default function Reports() {
  let { reports, status } = useLoaderData<LoaderResponse>();

  const [searchParams] = useSearchParams();

  let skip = parseInt(searchParams.get("skip") || "0") || 0;

  const searchParamsWithoutSkip = new URLSearchParams(searchParams);
  searchParamsWithoutSkip.delete("skip");

  // Create the value of the pagination buttons
  // If there are under reportsPerPage reports only show "1"
  // If there are more than reportsPerPage reports, each page is a multiple of reportsPerPage
  // If there are 20 reports, and reportsPerPage is 5, the pages will be 1, 2, 3, 4
  // If there are 21 reports, and reportsPerPage is 5, the pages will be 1, 2, 3, 4, 5
  // There must always be the button for the current page, the button for the first page, and the button for the last page
  // If the current page is 1, 2 or 3 and there are more than 5 pages a "..." unclicable page and then the last page
  // ie 1, 2, 3, ..., 6
  // If the current page is 2 within the last page and there are more than 5 pages a "..." unclicable page and then the last page
  // ie 1, ..., 4, 5, 6
  // else show the first page, "...", then the current page, "...",  then the last page
  // ie 1, ..., 3, ..., 6
  // "..." is represented by the value "false"
  const currentPage = Math.floor(skip / reportsPerPage) + 1;
  const atExactPage = skip % reportsPerPage === 0;
  const pages: (number | false)[] = useMemo((): (number | false)[] => {
    const pages: (number | false)[] = [];
    const pageCount = Math.ceil(reports.report_count / reportsPerPage);
    if (pageCount > 1 && pageCount <= 5) {
      for (let i = 1; i <= pageCount; i++) {
        pages.push(i);
      }
    } else if (pageCount > 5) {
      if (currentPage <= 3) {
        for (let i = 1; i <= 3; i++) {
          pages.push(i);
        }
        pages.push(false);
        pages.push(pageCount);
      } else if (currentPage >= pageCount - 2) {
        pages.push(1);
        pages.push(false);
        for (let i = pageCount - 2; i <= pageCount; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push(false);
        pages.push(currentPage);
        pages.push(false);
        pages.push(pageCount);
      }
    }
    return pages;
  }, [reports.report_count, currentPage]);

  const locale = useLocale();

  return (
    <div className="overflow-x-auto grow relative shadow-md sm:rounded-lg flex flex-col justify-between">
      <div>
        <FilterAndSearch defaultStatus={status} />
        <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
          <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-700 dark:text-slate-400">
            <tr>
              <th scope="col" className="py-3 px-6">
                Report Title
              </th>

              <th scope="col" className="py-3 px-6">
                Reporting User
              </th>
              <th scope="col" className="py-3 px-6">
                Guild
              </th>
              <th scope="col" className="py-3 px-6">
                Updated At
              </th>
              <th scope="col" className="py-3 px-6">
                Message Count
              </th>
              <th scope="col" className="py-3 px-6">
                Report Id
              </th>
              <th scope="col" className="py-3 px-6">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {reports.reports.map((report) => (
              <tr
                key={report.id}
                className="bg-white border-b dark:bg-slate-900 dark:border-slate-700"
              >
                <th
                  scope="row"
                  className="py-4 px-6 font-medium text-slate-900 whitespace-nowrap dark:text-white"
                >
                  <Link
                    to={`/reports/${report.id}`}
                    className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                  >
                    {report.title}
                  </Link>
                </th>
                <td className="py-4 px-6">
                  <ReportProfile id={report.reporting_user_id} />
                </td>
                <td className="py-4 px-6">
                  <div className="flex flex-row">
                    <img
                      src={
                        report.guild_data.icon
                          ? `https://cdn.discordapp.com/icons/${report.guild_id}/${report.guild_data.icon}.png`
                          : `https://cdn.discordapp.com/embed/avatars/0.png`
                      }
                      alt="Guild avatar"
                      width="32"
                      height="32"
                      className="rounded-full"
                    />
                    <span className="py-1 px-1">
                      {report.guild_data.name ?? report.guild_id}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  {getDisplayDate(report.updated_at, locale)}
                </td>
                <td className="py-4 px-6">{report.message_count}</td>
                <td className="py-4 px-6">{report.id}</td>
                <td className="py-4 px-6">{`${report.status[0].toUpperCase()}${report.status.slice(
                  1
                )}
                  `}</td>
              </tr>
            ))}
            {reports.reports.length === 0 && (
              <tr className="bg-white dark:bg-slate-900 dark:border-slate-700">
                <td className="py-4 px-6 text-center" colSpan={7}>
                  No reports found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <nav
        className="flex justify-between items-center p-4"
        aria-label="Table navigation"
      >
        <span className="text-sm font-normal text-slate-500 dark:text-slate-400">
          Showing{" "}
          <span className="font-semibold text-slate-900 dark:text-white">
            {reports.skipped + 1} - {reports.skipped + reports.reports.length}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-slate-900 dark:text-white">
            {reports.report_count}
          </span>
        </span>
        <ul className="inline-flex items-center -space-x-px">
          <li>
            {/* set the skip param to skip - reportsPerPage, if skip is zero then disabled. 
            Also ensure that current search params are also included */}

            {(() => {
              if (currentPage - 2 >= 0) {
                return (
                  <Link
                    to={{
                      search: `${searchParamsWithoutSkip}&skip=${
                        (currentPage - 2) * reportsPerPage
                      }`,
                    }}
                    className="block py-2 px-3 ml-0 leading-tight text-slate-500 bg-white rounded-l-lg border border-slate-300 hover:bg-slate-100 hover:text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white"
                  >
                    <span className="sr-only">Previous</span>
                    <svg
                      className="w-5 h-5"
                      aria-hidden="true"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </Link>
                );
              } else {
                return (
                  <span
                    className="block py-2 px-3 ml-0 leading-tight text-slate-300 bg-white rounded-l-lg border border-slate-300 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-600"
                    aria-disabled="true"
                  >
                    <span className="sr-only">Next</span>
                    <svg
                      className="w-5 h-5"
                      aria-hidden="true"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </span>
                );
              }
            })()}
          </li>

          {pages.map((page, index) => {
            if (page === false) {
              return (
                <li key={index}>
                  <span className="block py-2 px-3 leading-tight text-slate-500 bg-white border border-slate-300 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400">
                    ...
                  </span>
                </li>
              );
            } else {
              return (
                <li key={index}>
                  <Link
                    to={{
                      search: `${searchParamsWithoutSkip}&skip=${
                        (page - 1) * reportsPerPage
                      }`,
                    }}
                    className={`block py-2 px-3 leading-tight ${
                      page === currentPage && atExactPage
                        ? "text-blue-600 bg-blue-50 border border-blue-300 hover:bg-blue-100 hover:text-blue-700 dark:border-slate-700 dark:bg-slate-700 dark:text-white"
                        : "text-slate-500 bg-white border border-slate-300 hover:bg-slate-100 hover:text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white"
                    }`}
                  >
                    {page}
                  </Link>
                </li>
              );
            }
          })}

          <li>
            {/* set the skip param to skip + reportsPerPage, with max value of report_count - reportsPerPage.
            Also ensure that current search params are also included */}
            {(() => {
              if (reports.report_count - reportsPerPage > skip) {
                return (
                  <Link
                    to={{
                      search: `${searchParamsWithoutSkip}&skip=${
                        currentPage * reportsPerPage
                      }`,
                    }}
                    className="block py-2 px-3 ml-0 leading-tight text-slate-500 bg-white rounded-r-lg border border-slate-300 hover:bg-slate-100 hover:text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white"
                  >
                    <span className="sr-only">Next</span>
                    <svg
                      className="w-5 h-5"
                      aria-hidden="true"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </Link>
                );
              } else {
                return (
                  <span
                    className="block py-2 px-3 ml-0 leading-tight text-slate-300 bg-white rounded-r-lg border border-slate-300 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-600"
                    aria-disabled="true"
                  >
                    <span className="sr-only">Next</span>
                    <svg
                      className="w-5 h-5"
                      aria-hidden="true"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </span>
                );
              }
            })()}
          </li>
        </ul>
      </nav>
    </div>
  );
}
// TODO: investigate when api returns too many - most likely just ignore them
// Also reroute skip when skip is too high

export { ErrorBoundary };
