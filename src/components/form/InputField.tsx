import { Info, Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { is } from "zod/v4/locales";

export default function InputField({
  label,
  min,
  max,
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
  min?: string;
  max?: string;
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
  return (
    <div className="space-y-2">
      <div className="text-sm font-medium text-card-foreground flex items-start gap-1">
        {info && <CustomTooltip content={info} />}
        <span>{label}</span>
        {required && <span className="text-red-500">*</span>}
      </div>
      <div className="flex gap-2">
        {prefix && (
          <div className="flex items-center w-fit rounded-md bg-muted-foreground/50 px-3 py-2 text-muted-foreground rounded-r-none">
            <span className="text-sm font-medium text-card-foreground text-nowrap">
              {prefix}
            </span>
          </div>
        )}
        <div className="relative w-full">
          <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            inputMode={inputMode}
            disabled={disabled}
            className={`
              w-full h-10 rounded-md border px-3 py-2 focus:ring-2 font-normal text-left
              outline-none transition-colors duration-200
              placeholder:text-muted-foreground
              focus:ring-offset-0 text-foreground
              ${
                disabled 
                  ? 'bg-muted border-border text-muted-foreground cursor-not-allowed pointer-events-none' 
                  : value 
                    ? 'bg-white dark:!bg-neutral-800 border-green-500 focus:border-green-500 focus:ring-green-500/20'
                    : 'bg-white dark:!bg-neutral-800 border-red-500 hover:border-red-600 focus:border-red-500 focus:ring-red-500/20'
              }
            `}
            min={min}
            max={max}
          />
          {!disabled && value && (
            <Check size={18} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500" strokeWidth={2.5} />
          )}
        </div>
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
