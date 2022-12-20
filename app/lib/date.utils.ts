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

/*
import { Temporal, Intl } from "@js-temporal/polyfill";
export function newDisplayDate(dateInput: string) {
  // Output either, Today at hh:mm, Yesterday at hh:mm, or dd/mm/yyyy at hh:mm

  const dateTime = Temporal.ZonedDateTime.from(dateInput);
  // get different between dateTime and midnight today

  const midnightToday = Temporal.Now.zonedDateTime(dateInput).startOfDay();
  const diff = dateTime.since(midnightToday);
  // if dateTime was after midnight today, then it is today
  if (diff.total({ unit: "days" }) >= 0) {
    return `Today at ${dateTime.toLocaleString(undefined, {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    })}`;
  }
  // if dateTime was before midnight today but after midnight yesterday, then it is yesterday
  else if (diff.total({ unit: "days" }) >= -1) {
    return `Yesterday at ${dateTime.toLocaleString(undefined, {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    })}`;
  }
  // otherwise it is a date in the past
  else {
    return dateTime.toLocaleString(undefined, {
      day: "numeric",
      month: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  }
}
*/
