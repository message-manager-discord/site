export {};
/*

const generateToast = (t: Toast) => {
  let baseColor: string;
  switch (t.type) {
    case "error":
      baseColor = "red";
      break;
    case "success":
      baseColor = "green";
      break;
    case "loading":
      baseColor = "blue";
      break;
    case "blank":
      baseColor = "slate";
      break;
    default:
      baseColor = "slate";
      break;
  }
  return (
    <div
      id="alert-1"
      className={`${
        t.visible ? "animate-enter" : "animate-leave"
      } flex items-center p-2 mb-4 bg-${baseColor}-100 rounded-lg dark:bg-${baseColor}-200 border border-${baseColor}-400`}
      role="alert"
    >
      <svg
        aria-hidden="true"
        className={`flex-shrink-0 w-5 h-5 text-${baseColor}-700 dark:text-${baseColor}-800`}
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
          clipRule="evenodd"
        ></path>
      </svg>
      <span className="sr-only">Info</span>
      <div
        className={`ml-3 p-2 text-sm font-medium text-${baseColor}-700 dark:text-${baseColor}-800`}
      >
        {resolveValue(t.message, t)}
      </div>
      <button
        type="button"
        className={`ml-auto -mx-1.5 -my-1.5 bg-${baseColor}-100 text-${baseColor}-500 rounded-lg focus:ring-2 focus:ring-${baseColor}-400 p-1.5 hover:bg-${baseColor}-200 inline-flex h-8 w-8 dark:bg-${baseColor}-200 dark:text-${baseColor}-600 dark:hover:bg-${baseColor}-300`}
        aria-label="Close"
        onClick={() => toast.dismiss(t.id)}
      >
        <span className="sr-only">Close</span>
        <svg
          aria-hidden="true"
          className="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          ></path>
        </svg>
      </button>
    </div>
  );
};

export { generateToast };
*/
