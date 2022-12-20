// This component is used to display the profile of the user for reports
// Data is loaded asynchronously by the component (instead of using loaders)

import { useApi } from "~/hooks/useAPI";
import useLocale from "~/hooks/useLocale";
import { getDisplayDate } from "~/lib/date.utils";
import { ReportMessage } from "~/lib/reports.types";

export default function ReportProfile({ id }: { id: string }) {
  // load the user data - with builtin fetch
  const { state, error, data } = useApi<{
    avatarPath: string;
    username: string;
    discriminator: string;
  }>(`https://avatar-cache-mm.anothercat.workers.dev/data/${id}`);
  if (state === "LOADING") {
    return <div>Loading...</div>;
  } else if (state === "SUCCESS" && data) {
    return (
      <div className="inline-flex flex-row justify-around items-center">
        <img
          src={data.avatarPath}
          alt="User avatar"
          width="32"
          height="32"
          className="rounded-full"
        />
        <p className="py-1 px-1 break-words min-w-0">{`${data.username}#${data.discriminator}`}</p>
      </div>
    );
  } else {
    return <div>Error: {error ?? "unknown error"}</div>;
  }
}

export function ReportMessageWithProfile({
  id,
  message,
}: {
  id: string;
  message: ReportMessage;
}) {
  // load the user data - with builtin fetch
  const { error, data } = useApi<{
    avatarPath: string;
    username: string;
    discriminator: string;
  }>(`https://avatar-cache-mm.anothercat.workers.dev/data/${id}`);
  const locale = useLocale();
  const avatarPath = data?.avatarPath
    ? data.avatarPath
    : "https://cdn.discordapp.com/embed/avatars/0.png";
  const username =
    data?.username && data?.discriminator ? (
      <p className="py-1 px-1 break-words min-w-0">{`${data!.username}#${
        data!.discriminator
      }`}</p>
    ) : error ? (
      <p className="py-1 px-1 break-words min-w-0">{`Error: ${error}`}</p>
    ) : (
      <p className="py-1 px-1 break-words min-w-0">Loading...</p>
    );

  return (
    <div className="inline-flex flex-row justify-around items-start py-2">
      <img
        src={avatarPath}
        alt="User avatar"
        width="40"
        height="40"
        className="rounded-full"
      />
      <div className="flex flex-col items-start justify-evenly px-1">
        <div className="flex flex-row justify-between items-center ml-1 font-semibold text-slate-900 text-base">
          {username}
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {getDisplayDate(message.created_at, locale)}
          </span>
        </div>

        <p className="text-base ml-2 whitespace-pre-wrap">{message.content}</p>
      </div>
    </div>
  );
}
