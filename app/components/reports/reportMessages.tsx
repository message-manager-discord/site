import type { Report } from "~/lib/reports.types";
import { ReportMessageWithProfile } from "./reportProfile";

export default function ReportMessages({ report }: { report: Report }) {
  const messages = report.messages;
  return (
    <ul className="grow flex flex-col justify-start items-start divide-y divide-slate-100 dark:divide-slate-600">
      {messages.map((message) => (
        <li
          key={message.id}
          className="flex flex-col justify-between items-start w-full"
        >
          <div className="flex flex-row justify-between items-center w-full">
            <ReportMessageWithProfile
              id={message.staff_id ?? message.author_id}
              message={message}
            />
          </div>
        </li>
      ))}
      {messages.length === 0 && (
        <li className="flex flex-col justify-between items-start">
          <span className="text-sm py-2">No messages found</span>
        </li>
      )}
    </ul>
  );
}
