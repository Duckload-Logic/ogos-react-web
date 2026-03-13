const toISODateString = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/**
 * Formats a time or date string into a 12-hour AM/PM format.
 * Detects if the input is an ISO string or a simple HH:mm string.
 * * @param input - The date or time string to format
 * @returns Formatted time string (e.g., "02:30 PM")
 */
const format12HourTime = (input: string): string => {
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
    const [h, m] = input.split(TIME_SEPARATOR).map(Number);
    hour = h;
    minute = m;
  }

  const period = hour >= NOON_HOUR ? "PM" : "AM";
  const hour12 = hour % NOON_HOUR === MIDNIGHT_HOUR ? NOON_HOUR : hour % NOON_HOUR;
  const minuteDisplay = String(minute).padStart(2, "0");

  return `${hour12}:${minuteDisplay} ${period}`;
};

export { toISODateString, format12HourTime };
