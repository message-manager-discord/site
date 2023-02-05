import { useCatch } from "@remix-run/react";
import * as Sentry from "@sentry/remix";

// Export error boundary function
export default function CatchBoundary() {
  const caught = useCatch();
  // Unexpected if status is 5xx, or 429 or 404
  const isUnexpected =
    caught.status >= 500 || caught.status === 429 || caught.status === 404;
  if (isUnexpected) {
    // Send to Sentry
    Sentry.captureException(caught);
  }
  return (
    <div className="bg-red-100 text-red-500 flex grow-0 flex-col items-center justify-around border border-red-600 m-6 p-6 rounded-lg">
      <div className="flex flex-col items-center justify-between">
        <p className="text-5xl font-bold p-2">{caught.status}</p>

        {isUnexpected && (
          <p className="text-xl font-bold p-2">
            This seems unexpected :( We're already working on it
          </p>
        )}

        <p className="p-2">{caught.data}</p>
      </div>
    </div>
  );
}
