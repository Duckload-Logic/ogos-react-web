import { ChevronDownIcon, ChevronUpIcon, Check, Lock } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function DropdownField({
  label,
  options,
  value,
  onChange,
  error,
  required = false,
  enabled = true,
  get = "id",
  loading = false,
  lockedReason = "Locked",
  formStyle = false,
}: {
  label: string;
  options: any[];
  value: any;
  onChange: (val: any) => void;
  error?: string;
  required?: boolean;
  enabled?: boolean;
  get?: string;
  loading?: boolean;
  lockedReason?: string;
  formStyle?: boolean;
}) {
  const selectedOption = options.find((opt) => opt.id == value);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isFilled = selectedOption !== undefined;

  const getLabel = (option: any) => {
    if (!option) return `Select ${label}`;
    return option.code || option.name || option.text || option || "";
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="space-y-2 relative">
      <div className={`text-sm font-medium text-foreground`}>
        <span className="truncate">{label}</span>

        {/* The asterisk stays fixed to the right of the truncated text */}
        {required && <span className="text-red-500 flex-shrink-0"> *</span>}
      </div>
      <div ref={dropdownRef} className="relative rounded">
        <div className="w-full">
          <button
            disabled={!enabled || loading}
            className={`flex w-full items-center justify-between px-3 py-2 h-10 text-left font-normal border rounded-md focus:ring-2 focus:ring-offset-0 outline-none transition-colors duration-200 text-foreground ${
              !enabled || loading
                ? 'bg-muted border-border text-muted-foreground cursor-not-allowed pointer-events-none'
                : formStyle
                  ? isFilled
                    ? 'bg-card border-green-500 focus:border-green-500 focus:ring-green-500/20'
                    : 'bg-card border-red-500 hover:border-red-600 focus:border-red-500 focus:ring-red-500/20'
                  : 'bg-background border-border hover:border-primary focus:border-primary focus:ring-primary/20'
            } ${
              error ? "border-red-500" : ""
            }`}
            onClick={toggleDropdown}
          >
            <span
              className={`truncate ${
                selectedOption ? "text-foreground font-medium" : "text-muted-foreground italic"
              }`}
            >
              {getLabel(selectedOption)}
            </span>
            <div className="flex items-center gap-2 flex-shrink-0">
              {!enabled && (
                <Lock size={16} className="text-muted-foreground" strokeWidth={2} />
              )}
              {enabled && isFilled && !error && formStyle && (
                <Check size={16} className="text-green-500" strokeWidth={2.5} />
              )}
              {enabled && (
                <ChevronDownIcon
                  className={`ml-2 size-4 opacity-50 ${isOpen ? "transition-transform rotate-180 duration-300" : "rotate-0 transition-transform duration-300"}`}
                />
              )}
            </div>
          </button>
        </div>
        {isOpen && (
          <div className={`w-full min-w-[200px] max-h-[200px] overflow-y-auto absolute mt-1 border border-border rounded-md shadow-lg z-50 p-2 ${formStyle ? 'bg-card' : 'bg-background'}`}>
            {options.length === 0 ? (
              <div className="px-2 py-1.5 text-sm text-muted-foreground">
                No options available
              </div>
            ) : (
              options.map((option) => {
                const isOptionDisabled = option.isEnabled === false || !enabled;

                return (
                  <button
                    key={option.id}
                    onClick={() => {
                      onChange(option[get]);
                      setIsOpen(false);
                    }}
                    disabled={isOptionDisabled}
                    className={`w-full text-left px-3 py-2 text-sm hover:text-primary hover:bg-muted-foreground/30 rounded ${
                      option.id === value
                        ? "bg-muted-foreground/10 text-primary font-medium"
                        : ""
                    } ${isOptionDisabled && "text-muted-foreground cursor-not-allowed"}`}
                  >
                    {getLabel(option)}
                  </button>
                );
              })
            )}
          </div>
        )}
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
      {/* tooltip removed: showTooltip/tooltipRef were unused */}
    </div>
  );
}
