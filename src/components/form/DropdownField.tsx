import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
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
}) {
  const selectedOption = options.find((opt) => opt.id == value);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
    <div className="space-y-2">
      <div className={`text-sm font-medium text-card-foreground`}>
        <span className="truncate">{label}</span>

        {/* The asterisk stays fixed to the right of the truncated text */}
        {required && <span className="text-red-500 flex-shrink-0"> *</span>}
      </div>
      <div ref={dropdownRef} className="relative rounded">
        <div className="w-full">
          <button
            disabled={!enabled || loading}
            className={`flex w-full items-center justify-between px-3 py-2 h-10 bg-muted hover:bg-muted-foreground/30 text-left font-normal border rounded-md disabled:opacity-50 disabled:pointer-events-none ${
              error ? "border-red-500" : "border-input"
            }`}
            onClick={toggleDropdown}
          >
            <span
              className={`truncate ${
                selectedOption ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {getLabel(selectedOption)}
            </span>
            <ChevronDownIcon
              className={`ml-2 size-4 opacity-50 ${isOpen ? "transition-transform rotate-180 duration-300" : "rotate-0 transition-transform duration-300"}`}
            />
          </button>
        </div>
        {isOpen && (
          <div className="w-full min-w-[200px] max-h-[200px] overflow-y-auto absolute mt-1 bg-popover border border-border rounded-md shadow-lg z-50 p-2">
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
    </div>
  );
}
