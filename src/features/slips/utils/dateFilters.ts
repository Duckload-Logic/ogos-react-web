/**
 * Date Filter Utilities for Slip Management
 * Provides date range calculations for filtering slips by time periods
 */

export type TimeFilter = "today" | "week" | "month" | "all";

export interface DateRange {
  startDate: string;
  endDate: string;
}

/**
 * Get date range for a given time filter
 * @param filter - Time filter type (today, week, month, or all)
 * @returns Date range with startDate and endDate in YYYY-MM-DD format
 */
export function getDateRange(filter: TimeFilter): DateRange {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let startDate: Date;
  let endDate: Date = new Date(today);
  endDate.setHours(23, 59, 59, 999);

  switch (filter) {
    case "today":
      startDate = new Date(today);
      break;

    case "week": {
      // Start from Monday of the current week
      startDate = new Date(today);
      const day = startDate.getDay();
      const diff = startDate.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
      startDate.setDate(diff);
      break;
    }

    case "month": {
      // Start from the first day of the current month
      startDate = new Date(today.getFullYear(), today.getMonth(), 1);
      // End on the last day of the current month
      endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      endDate.setHours(23, 59, 59, 999);
      break;
    }

    case "all":
      // Return a very old start date to get all records
      startDate = new Date("1900-01-01");
      break;

    default:
      startDate = new Date(today);
  }

  return {
    startDate: formatDateString(startDate),
    endDate: formatDateString(endDate),
  };
}

/**
 * Format date to YYYY-MM-DD string
 */
function formatDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Get the display label for a time filter
 */
export function getFilterLabel(filter: TimeFilter): string {
  const labels: Record<TimeFilter, string> = {
    today: "Today",
    week: "This 7 days",
    month: "This Month",
    all: "All Time",
  };
  return labels[filter];
}

/**
 * Get year and month from a date string
 * @param dateString - Date string in YYYY-MM-DD format
 * @returns Object with year and month
 */
export function getYearAndMonth(dateString: string): {
  year: number;
  month: number;
} {
  const [year, month] = dateString.split("-").map(Number);
  return { year, month };
}

/**
 * Get date range for a specific year and month
 * @param year - Year (e.g., 2024)
 * @param month - Month (1-12)
 * @returns Date range covering the entire month
 */
export function getMonthRange(year: number, month: number): DateRange {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);
  endDate.setHours(23, 59, 59, 999);

  return {
    startDate: formatDateString(startDate),
    endDate: formatDateString(endDate),
  };
}

/**
 * Get list of available months for a given year
 * Returns months from January to December
 */
export function getMonthsList(): Array<{ id: number; name: string }> {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return months.map((name, index) => ({ id: index + 1, name }));
}

/**
 * Get list of available years
 * Goes back 5 years from current year
 */
export function getYearsList(): Array<{ id: number; name: string }> {
  const currentYear = new Date().getFullYear();
  const years: number[] = [];
  for (let i = 0; i <= 5; i++) {
    years.unshift(currentYear - i);
  }
  return years.map((year, index) => ({
    id: index + 1,
    name: year.toString(),
  }));
}
