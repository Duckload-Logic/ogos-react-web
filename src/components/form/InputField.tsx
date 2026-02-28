import { Info, Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { is } from "zod/v4/locales";

export default function InputField({
  label,
  type = "text",
  value,
  onChange,
  error,
  placeholder,
  required = false,
  inputMode,
  disabled = false,
  info = "",
  prefix,
}: {
  label: string;
  type?: string;
  value: any;
  onChange: (val: string) => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
  isTextarea?: boolean;
  inputMode?:
    | "search"
    | "none"
    | "text"
    | "tel"
    | "url"
    | "email"
    | "numeric"
    | "decimal";
  disabled?: boolean;
  info?: string;
  prefix?: string;
}) {
  const isFilled = value && value !== "";

  return (
    <div className="space-y-2">
      <div className="text-sm font-medium text-gray-700 flex items-start gap-1">
        {info && <CustomTooltip content={info} />}
        <span>{label}</span>
        {required && <span className="text-red-500">*</span>}
      </div>
      <div className="flex gap-2 relative">
        {prefix && (
          <div className="flex items-center w-fit rounded-md bg-muted-foreground/50 px-3 py-2 text-muted-foreground rounded-r-none">
            <span className="text-sm font-medium text-card-foreground text-nowrap">
              {prefix}
            </span>
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => {
            let inputValue = e.target.value;
            // For numeric inputs, only allow numbers and decimal point
            if (type === "number" || inputMode === "decimal" || inputMode === "numeric") {
              inputValue = inputValue.replace(/[^0-9.]/g, "");
              // Prevent multiple decimal points
              if ((inputValue.match(/\./g) || []).length > 1) {
                inputValue = inputValue.substring(0, inputValue.lastIndexOf("."));
              }
            }
            onChange(inputValue);
          }}
          placeholder={placeholder}
          inputMode={inputMode}
          disabled={disabled}
          className={`
            w-full px-3 py-2 border rounded-md bg-white text-sm
            outline-none disabled:cursor-not-allowed
            disabled:opacity-50 disabled:pointer-events-none
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-offset-0
            ${
              isFilled
                ? "border-blue-400 text-gray-900 font-medium hover:border-blue-500 focus:border-blue-500 focus:ring-blue-500/20"
                : required && !isFilled
                ? "border-red-400 text-gray-700 hover:border-red-500 focus:border-red-500 focus:ring-red-500/20"
                : "border-gray-300 text-gray-700 hover:border-gray-400 focus:border-gray-400 focus:ring-gray-500/20"
            }
            ${error ? "border-red-500 focus:border-red-600 focus:ring-red-500/20" : ""}
            placeholder:text-gray-500 placeholder:italic placeholder:font-normal
          `}
        />
        {isFilled && !error && !disabled && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">
            <Check size={18} strokeWidth={2.5} />
          </div>
        )}
      </div>
      {info && <p className="text-xs text-muted-foreground">{info}</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

export function CustomTooltip({
  content,
  children,
}: {
  content: string;
  children?: React.ReactNode;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const handleMouseEnter = () => {
    setIsVisible(true);
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom - rect.height * 3.9,
        left: rect.left - rect.width / 2,
      });
    }
  };

  return (
    <div className="relative inline-flex items-center overflow-visible">
      <div
        ref={triggerRef}
        className="cursor-help transition-all duration-200 hover:scale-110"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children || (
          <Info className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors duration-200" />
        )}
      </div>

      {isVisible && (
        <div
          className="fixed px-3 py-2 bg-card border-2 border-primary rounded-md shadow-lg text-sm text-card-foreground z-50 animate-in fade-in slide-in-from-bottom-2 duration-200 max-w-xs whitespace-normal"
          style={{
            top: `${position.top}px`,
            left: `${position.left}px`,
            transform: "translateX(-50%)",
            pointerEvents: "none",
          }}
        >
          {content}
          {/* <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-primary" /> */}
        </div>
      )}
    </div>
  );
}
