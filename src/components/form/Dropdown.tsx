import { Check, Lock, ChevronDown } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

export default function Dropdown({
  id,
  label,
  name,
  options = [],
  identifier = "id",
  value,
  onChange,
  onBlur,
  error,
  required = false,
  enabled = true,
  get = "id",
  loading = false,
  lockedReason = "Locked",
  formStyle = false,
  labelKey,
}: {
  id?: string;
  label?: string;
  name?: string;
  options: any[];
  identifier?: any;
  value: any;
  onChange: (val: any) => void;
  onBlur?: () => void;
  error?: string;
  required?: boolean;
  enabled?: boolean;
  get?: string;
  loading?: boolean;
  lockedReason?: string;
  formStyle?: boolean;
  labelKey?: string;
}) {
  const [open, setOpen] = useState(false);
  const selectedOption = options.find(
    (opt) => String(opt[identifier]) === String(value),
  );
  const isFilled = selectedOption !== undefined;

  const getLabel = (option: any) => {
    if (!option) return `Select ${label}`;
    if (labelKey) return option[labelKey] || "";
    return option.code || option.name || option.text || option || "";
  };

  const handleSelect = (optionValue: string) => {
    const selected = options.find(
      (opt) => String(opt[identifier]) === optionValue,
    );
    if (selected) {
      onChange(selected[get]);
      setOpen(false);
      if (onBlur) onBlur();
    }
  };

  return (
    <div className="space-y-2 relative">
      {label && <div className="text-sm font-medium text-foreground">
        <span className="truncate">{label}</span>
        {required && <span className="text-red-500 flex-shrink-0"> *</span>}
      </div>}

      <div id={id}>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <button
              disabled={!enabled || loading}
              className={cn(
                "flex w-full items-center justify-between px-4 py-2.5 h-11 text-left text-sm font-medium tracking-tight border rounded-xl outline-none transition-all duration-200 text-foreground shadow-sm",
                !enabled || loading
                  ? "bg-muted/50 border-glass-border/20 text-muted-foreground cursor-not-allowed opacity-60"
                  : formStyle
                    ? isFilled
                      ? "bg-muted/20 border-primary/30 focus:bg-glass-bg dark:focus:bg-glass-bg/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/5"
                      : "bg-muted/20 border-destructive/20 hover:border-destructive/40 focus:border-destructive/50 focus:ring-2 focus:ring-destructive/5"
                    : "bg-muted/20 border-glass-border/40 hover:border-glass-border/60 focus:bg-glass-bg dark:focus:bg-glass-bg/40 focus:border-primary/50 focus:ring-2 focus:ring-primary/5 shadow-sm",
                error && "border-destructive/50",
              )}
            >
              <span
                className={cn(
                  "truncate flex-1",
                  !selectedOption &&
                  "text-muted-foreground/50 italic font-normal",
                )}
              >
                {selectedOption ? getLabel(selectedOption) : `Select ${label}`}
              </span>

              <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                {!enabled && (
                  <Lock
                    size={14}
                    className="text-muted-foreground/60"
                    strokeWidth={2}
                  />
                )}
                {enabled && isFilled && !error && formStyle && (
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary animate-in zoom-in duration-300">
                    <Check size={12} strokeWidth={3} />
                  </div>
                )}
                <ChevronDown
                  className={cn(
                    "size-4 opacity-40 transition-transform duration-300",
                    open && "rotate-180",
                  )}
                />
              </div>
            </button>
          </PopoverTrigger>
          <PopoverContent
            className={cn(
              "p-0 z-50 overflow-hidden rounded-xl border-glass-border speech-control-ignore",
              formStyle ? "bg-card" : "bg-background",
            )}
            align="start"
            sideOffset={8}
          >
            <Command className={formStyle ? "bg-card" : "bg-background"}>
              {label && (<CommandInput
                placeholder={`Search ${label.toLowerCase()}...`}
                className="h-11"
              />)}
              <CommandList
                className={cn(
                  "max-h-[250px] overflow-y-auto p-1",
                  formStyle ? "bg-card" : "bg-background",
                )}
              >
                {label && (<CommandEmpty>No {label.toLowerCase()} found.</CommandEmpty>)}
                <CommandGroup>
                  {options.map((option) => (
                    <CommandItem
                      key={String(option[identifier])}
                      value={`${getLabel(option)}|${String(option[identifier])}`} // Ensure unique value for cmdk search/matching
                      onSelect={() => handleSelect(String(option[identifier]))}
                      className={cn(
                        "flex items-center justify-between px-3 py-2 text-sm rounded-lg cursor-pointer transition-colors mb-0.5",
                        String(option[identifier]) === String(value)
                          ? "bg-primary/10 text-primary font-bold"
                          : "hover:bg-primary/5 text-foreground",
                      )}
                    >
                      <span className="truncate">{getLabel(option)}</span>
                      {String(option[identifier]) === String(value) && (
                        <Check className="size-4 flex-shrink-0" />
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {error && (
        <p className="text-xs font-semibold text-red-600 mt-1">{error}</p>
      )}
    </div>
  );
}
