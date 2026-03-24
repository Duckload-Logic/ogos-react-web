import { Info, Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { forwardRef } from "react";

const FormInput = forwardRef<
  HTMLInputElement,
  {
    className?: string;
    name?: string;
    label: string;
    min?: string;
    max?: string;
    type?: string;
    value: any;
    onChange: (val: string) => void;
    onBlur?: () => void;
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
  }
>(
  (
    {
      className = "",
      name,
      label,
      min,
      max,
      type = "text",
      value,
      onChange,
      onBlur,
      error,
      placeholder,
      required = false,
      inputMode,
      disabled = false,
      info = "",
      prefix,
    },
    ref,
  ) => {
    return (
      <div className={`space-y-2 ${className}`}>
        <div className="text-sm font-medium text-card-foreground flex max-h-10 items-start gap-1">
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
              ref={ref}
              type={type}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onBlur={onBlur}
              placeholder={placeholder}
              inputMode={inputMode}
              disabled={disabled}
              className={`
              w-full h-11 rounded-xl border px-4 py-2.5 outline-none transition-all duration-200
              text-sm font-medium tracking-tight text-foreground placeholder:text-muted-foreground/70
              ${
                disabled
                  ? "bg-muted/80 border-glass-border/20 text-muted-foreground cursor-not-allowed opacity-60"
                  : value !== undefined && value !== null && value !== ""
                    ? "bg-muted/20 border-primary/30 focus:bg-glass-bg dark:focus:bg-glass-bg/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/5 shadow-sm"
                    : required
                      ? "bg-muted/60 dark:bg-muted/20 border-border hover:border-destructive/40 focus:border-destructive/50 focus:ring-2 focus:ring-destructive/5"
                      : "bg-muted/60 dark:bg-muted/20 border-border hover:border-glass-border/60 focus:bg-glass-bg dark:focus:bg-glass-bg/40 focus:border-primary/50 focus:ring-2 focus:ring-primary/5"
              }
            `}
              min={min}
              max={max}
            />
            {!disabled &&
              value !== undefined &&
              value !== null &&
              value !== "" && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary animate-in zoom-in duration-300">
                  <Check size={12} strokeWidth={3} />
                </div>
              )}
          </div>
        </div>
        {error && (
          <p className="text-[11px] font-medium text-destructive mt-1.5 ml-1 animate-in fade-in slide-in-from-top-1 duration-200">
            {error}
          </p>
        )}
      </div>
    );
  },
);

export default FormInput;

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
