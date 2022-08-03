// For button that throws error
function onClick() {
  throw new Error("Sentry Frontend Error");
}

// This page will throw an error, used to test sentry
export default function ErrorPage() {
  return (
    <button type="button" onClick={onClick}>
      Throw error
    </button>
  );
}
