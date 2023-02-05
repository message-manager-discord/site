export function getDisplayDate(date: string, locale: string) {
  // Output either, Today at hh:mm, Yesterday at hh:mm, or dd/mm/yyyy at hh:mm
  // Input is an ISO 8601 string - with timezone - that timezone may be different to the user's timezone
  // We want to display the date in the user's timezone

  const dateObj = new Date(date);
  const now = new Date();

  // Compare date to midnight today
  const midnightToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );
  // If date was after midnight today, it's today
  // If date was before midnight today but after midnight yesterday, it's yesterday
  // If date was before midnight yesterday, it's a date
  if (dateObj >= midnightToday) {
    // The format should be Today at hh:mm (24 hour time)
    return `Today at ${dateObj.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })}`;
  }
  const midnightYesterday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - 1
  );
  if (dateObj >= midnightYesterday) {
    // The format should be Yesterday at hh:mm (24 hour time)
    return `Yesterday at ${dateObj.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })}`;
  }
  // Format should be (local simple date, so different for different locales) hh:mm

  return `${dateObj.toLocaleDateString(locale)} ${dateObj.toLocaleTimeString(
    locale,
    {
      hour: "2-digit",
      minute: "2-digit",
      second: undefined,
    }
  )}`;
}
