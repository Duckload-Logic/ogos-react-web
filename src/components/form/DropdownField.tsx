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
  lockedReason = "",
}: {
  label: string;
  options: any[];
  value: any;
  onChange: (val: any) => void;
  error?: string;
  required?: boolean;
  enabled?: boolean;
  get?: string;
  lockedReason?: string;
}) {
  const selectedOption = options.find((opt) => opt.id == value);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const isFilled = selectedOption !== undefined;

  const getLabel = (option: any) => {
    if (!option) {
      return enabled ? `Select ${label}` : lockedReason || "Locked";
    }
    return option.code || option.name || option.text || "";
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
      <div className={`text-sm font-medium text-gray-700`}>
        <span className="truncate">{label}</span>

        {/* The asterisk stays fixed to the right of the truncated text */}
        {required && <span className="text-red-500 flex-shrink-0"> *</span>}
      </div>
      <div ref={dropdownRef} className="relative rounded">
        <div className="w-full">
          <button
            disabled={!enabled}
            onMouseEnter={() => !enabled && lockedReason && setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            className={`flex w-full items-center justify-between px-3 py-2 h-10 text-left font-normal border rounded-md transition-all duration-200 ${
              !enabled
                ? "bg-gray-150 border-gray-300 text-gray-500 cursor-not-allowed opacity-60"
                : isFilled
                ? "bg-white border-blue-400 text-gray-900 font-medium hover:border-blue-500"
                : required && !isFilled
                ? "bg-gray-100 border-red-400 text-gray-700 hover:bg-gray-150 hover:border-red-500"
                : "bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-150 hover:border-gray-400"
            } ${error && enabled ? "border-red-500 hover:border-red-500" : ""}`}
            onClick={toggleDropdown}
          >
            <span
              className={`truncate ${
                selectedOption ? "text-gray-900 font-medium" : "text-gray-500 italic"
              }`}
            >
              {getLabel(selectedOption)}
            </span>
            <div className="flex items-center gap-2 flex-shrink-0">
              {!enabled && (
                <Lock size={16} className="text-gray-400" strokeWidth={2} />
              )}
              {enabled && isFilled && !error && (
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
          <div className="w-full min-w-[200px] max-h-[250px] overflow-y-auto absolute mt-1 bg-popover border border-border rounded-md shadow-lg z-50 p-2">
            {options.length === 0 ? (
              <div className="px-2 py-1.5 text-sm text-muted-foreground">
                No options available
              </div>
            ) : (
              options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => {
                    onChange(option[get]);
                    setIsOpen(false);
                  }}
                  disabled={!enabled}
                  className={`w-full text-left px-3 py-2 text-sm hover:text-primary hover:bg-muted-foreground/30 rounded ${
                    option.id === value
                      ? "bg-blue-100 text-blue-700 font-medium"
                      : ""
                  } ${!enabled && "text-muted-foreground cursor-not-allowed"}`}
                >
                  {getLabel(option)}
                </button>
              ))
            )}
          </div>
        )}
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
      {showTooltip && !enabled && lockedReason && (
        <div
          ref={tooltipRef}
          className="absolute z-50 px-3 py-2 text-xs bg-gray-800 text-white rounded-md whitespace-nowrap shadow-lg"
          style={{
            bottom: "100%",
            left: "50%",
            transform: "translateX(-50%)",
            marginBottom: "8px",
          }}
        >
          {lockedReason}
          <div
            className="absolute w-2 h-2 bg-gray-800 transform rotate-45"
            style={{
              bottom: "-4px",
              left: "50%",
              marginLeft: "-4px",
            }}
          />
        </div>
      )}
    </div>
  );
}
