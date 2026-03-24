/**
 * Global Date and Time Utility Functions
 */

/**
 * Format a date string or Date object to a readable format
 * @param date - ISO date string or Date object
 * @returns Formatted date string (e.g., "January 5, 2026")
 */
export const formatDate = (date: string | Date): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

/**
 * Converts a Date object to an ISO date string (YYYY-MM-DD)
 * @param date - Date object to convert
 * @returns Formatted date string
 */
export const toISODateString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/**
 * Formats a time or date string into a 12-hour AM/PM format.
 * @param input - The date or time string to format
 * @returns Formatted time string (e.g., "02:30 PM")
 */
export const format12HourTime = (input: string): string => {
  if (!input) return "";

  let hour: number;
  let minute: number;

  const IS_FULL_DATE = input.includes("T") || input.includes("-");
  const TIME_SEPARATOR = ":";
  const NOON_HOUR = 12;
  const MIDNIGHT_HOUR = 0;

  if (IS_FULL_DATE) {
    const dateObj = new Date(input);
    hour = dateObj.getHours();
    minute = dateObj.getMinutes();
  } else {
    const parts = input.split(TIME_SEPARATOR);
    if (parts.length < 2) return input;
    const [h, m] = parts.map(Number);
    hour = h;
    minute = m;
  }

  const period = hour >= NOON_HOUR ? "PM" : "AM";
  const hour12 = hour % NOON_HOUR === MIDNIGHT_HOUR ? NOON_HOUR : hour % NOON_HOUR;
  const minuteDisplay = String(minute).padStart(2, "0");

  return `${hour12}:${minuteDisplay} ${period}`;
};
