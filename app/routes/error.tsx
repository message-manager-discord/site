// For button click that throws error - just for testing (isn't displayed on any link and to any bot so has no impact on the user)
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
