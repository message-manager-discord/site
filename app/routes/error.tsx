function onClick() {
  throw new Error("Sentry Frontend Error");
}

export default function a() {
  return (
    <button type="button" onClick={onClick}>
      Throw error
    </button>
  );
}
