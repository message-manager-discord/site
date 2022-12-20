// Export error boundary function
export default function ErrorBoundary({ error }: { error: Error }) {
  return (
    <div className="bg-red-100 text-red-500 flex grow-0 flex-col items-center justify-around border border-red-600 m-6 p-6 rounded-lg">
      <div className="flex flex-col items-center justify-between">
        <p className="text-5xl font-bold p-2">500</p>

        <p className="text-xl font-bold p-2">
          This seems unexpected :( We're already working on it
        </p>

        <p className="p-2">{error.message}</p>
      </div>
    </div>
  );
}
