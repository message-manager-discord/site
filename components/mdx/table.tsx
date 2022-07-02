export function Table(props: JSX.IntrinsicElements["table"]) {
  return (
    <table
      className="table p-6 my-6 dark:bg-slate-700 shadow rounded-lg overflow-y-auto"
      {...props}
    />
  );
}

export function TableHead(props: JSX.IntrinsicElements["thead"]) {
  return <thead {...props} />;
}

// border-bottom: 1px solid #040405;
//     background-color: #202225;
export function TableHeader(props: JSX.IntrinsicElements["th"]) {
  return (
    <th
      className="whitespace-nowrap px-4 py-2 font-normal text-lg text-slate-500 dark:text-slate-200"
      {...props}
    />
  );
}

// margin-top: 0;
// border: 1px solid transparent;
export function TableRow(props: JSX.IntrinsicElements["tr"]) {
  return <tr className="px-2" {...props} />;
}

export function TableData(props: JSX.IntrinsicElements["td"]) {
  return (
    <td
      className="border-t-2 p-4 dark:border-slate-400 font-normal text-slate-500 dark:text-slate-200"
      {...props}
    />
  );
}
