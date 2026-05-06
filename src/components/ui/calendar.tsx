import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium hidden",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-8 w-8 bg-transparent p-0 rounded-full transition-all duration-200",
          "hover:bg-accent hover:scale-105 active:scale-95",
          "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "border-collapse mx-auto",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem] uppercase tracking-wide",
        row: "flex w-full mt-2",
        cell: cn(
          "h-10 w-10 text-center text-sm p-0 relative",
          "[&:has([aria-selected].day-range-end)]:rounded-r-full",
          "[&:has([aria-selected].day-outside)]:bg-accent/50",
          "[&:has([aria-selected])]:bg-accent/30",
          "first:[&:has([aria-selected])]:rounded-l-full",
          "last:[&:has([aria-selected])]:rounded-r-full",
          "focus-within:relative focus-within:z-20"
        ),
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-10 w-10 p-0 font-normal rounded-full transition-all duration-200",
          "hover:scale-105 hover:bg-accent hover:text-accent-foreground",
          "active:scale-95",
          "aria-selected:opacity-100 aria-selected:scale-105"
        ),
        day_range_end: "day-range-end",
        day_selected: cn(
          "bg-primary text-primary-foreground hover:bg-primary",
          "hover:text-primary-foreground focus:bg-primary",
          "focus:text-primary-foreground shadow-md shadow-primary/20"
        ),
        day_today: cn(
          "bg-accent text-accent-foreground ring-1 ring-primary/30",
          "font-semibold"
        ),
        day_outside: cn(
          "day-outside text-muted-foreground opacity-50",
          "aria-selected:bg-accent/50 aria-selected:text-muted-foreground",
          "aria-selected:opacity-30"
        ),
        day_disabled: "text-muted-foreground opacity-40 cursor-not-allowed",
        day_range_middle:
          "aria-selected:bg-accent/60 aria-selected:text-accent-foreground rounded-full",
        day_hidden: "invisible",
        vhidden: "vhidden hidden",
        caption_dropdowns: "flex justify-center gap-2 pt-1",
        dropdown_month: "flex items-center",
        dropdown_year: "flex items-center",
        dropdown: cn(
          "cursor-pointer bg-glass-bg border border-input rounded-md px-4 py-1 text-sm font-medium",
          "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1",
          "hover:bg-accent hover:text-accent-foreground transition-colors",
        ),
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
        IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };