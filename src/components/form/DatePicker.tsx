import * as React from "react";
import { format, isValid, parse, parseISO } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  label?: string;
  value?: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
}

export function DatePicker({
  label,
  value,
  onChange,
  onBlur,
  error,
  required,
  disabled,
}: DatePickerProps) {
  // Parse the incoming YYYY-MM-DD or ISO string to a Date object
  const dateValue = React.useMemo(() => {
    if (!value) return undefined;
    // Try parsing as ISO first (e.g. 2005-01-04T00:00:00.000Z)
    const parsedISO = parseISO(value);
    if (isValid(parsedISO)) return parsedISO;

    // Try parsing as YYYY-MM-DD
    const parsedDate = parse(value, "yyyy-MM-dd", new Date());
    if (isValid(parsedDate)) return parsedDate;

    return undefined;
  }, [value]);

  const dateStringValue = React.useMemo(() => {
    if (!dateValue) return "";
    return format(dateValue, "yyyy-MM-dd");
  }, [dateValue]);

  const [open, setOpen] = React.useState(false);

  const handleSelect = (date: Date | undefined) => {
    if (date) {
      // Format back to YYYY-MM-DD for form state compatibility
      onChange(format(date, "yyyy-MM-dd"));
      setOpen(false); // Close popover when a date is selected
    } else {
      onChange("");
    }
  };

  const id = React.useId();
  const safeId = id.replace(/:/g, "-");

  const inputClasses = cn(
    "w-full justify-start text-left flex items-center gap-2",
    "rounded-xl border px-4 py-2.5 outline-none transition-all",
    "duration-200 text-sm font-medium tracking-tight text-foreground",
    "placeholder:text-muted-foreground/70 h-11",
    disabled
      ? "bg-muted/80 border-glass-border/20 text-muted-foreground " +
        "cursor-not-allowed opacity-60"
      : dateValue
        ? "bg-muted/20 border-primary/30 focus:bg-glass-bg " +
          "dark:focus:bg-glass-bg/50 focus:border-primary/50 " +
          "focus:ring-2 focus:ring-primary/5 shadow-sm"
        : required
          ? "bg-muted/60 dark:bg-muted/20 border-border " +
            "hover:border-destructive/40 focus:border-destructive/50 " +
            "focus:ring-2 focus:ring-destructive/5"
          : "bg-muted/60 dark:bg-muted/20 border-border " +
            "hover:border-glass-border/60 focus:bg-glass-bg " +
            "dark:focus:bg-glass-bg/40 focus:border-primary/50 " +
            "focus:ring-2 focus:ring-primary/5",
    error ? "border-red-500 focus-visible:ring-red-500" : "",
  );

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen && onBlur) {
      onBlur();
    }
  };

  return (
    <div className="space-y-2 w-full">
      {label && (
        <div className="flex max-h-10 items-start gap-1 text-sm font-medium text-card-foreground">
          <span>{label}</span>
          {required && <span className="text-red-500">*</span>}
        </div>
      )}

      {/* Mobile view native date picker */}
      <div className="sm:hidden relative w-full">
        <style>{`
          #${safeId}-mobile::-webkit-calendar-picker-indicator {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            margin: 0;
            padding: 0;
            opacity: 0;
            cursor: pointer;
          }
        `}</style>
        <input
          type="date"
          id={`${safeId}-mobile`}
          value={dateStringValue}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          disabled={disabled}
          className={cn(
            inputClasses,
            "bg-background pr-10 text-left",
            !value && "text-muted-foreground/70",
          )}
        />
        <CalendarIcon
          className={cn(
            "absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4",
            "text-muted-foreground pointer-events-none",
          )}
        />
      </div>

      {/* Desktop view Popover calendar */}
      <div className="hidden sm:block w-full">
        <Popover open={open} onOpenChange={handleOpenChange}>
          <PopoverTrigger asChild>
            <Button
              id={`${safeId}-desktop`}
              variant="ghost"
              className={cn(
                inputClasses,
                !dateValue && "text-muted-foreground/70 font-normal",
              )}
              disabled={disabled}
            >
              <CalendarIcon className="h-4 w-4 shrink-0" />
              <span className="flex-1 text-left truncate">
                {dateValue ? format(dateValue, "PPP") : "Select a date"}
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-[300px] p-0 bg-background rounded-xl"
            align="start"
          >
            <Calendar
              mode="single"
              selected={dateValue}
              defaultMonth={dateValue}
              onSelect={handleSelect}
              initialFocus
              captionLayout="dropdown"
              fromYear={1900}
              toYear={new Date().getFullYear()}
            />
          </PopoverContent>
        </Popover>
      </div>

      {error && (
        <span className="text-xs text-red-500 mt-1.5 ml-1 block">
          {error}
        </span>
      )}
    </div>
  );
}
