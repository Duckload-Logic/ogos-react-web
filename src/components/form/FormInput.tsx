import { Info, Mic, MicOff } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useSpeechToText } from "@/hooks/useSpeechToText";
import { SPECIAL_CHARS_REGEX } from "@/utils/validation";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

const FormInput = forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  {
    id?: any;
    className?: string;
    name?: string;
    label: string;
    min?: string | number;
    max?: string | number;
    type?: string;
    value: any;
    onChange: (val: any) => void;
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
    noSpecialCharacters?: boolean;
    list?: string;
  }
>(
  (
    {
      id,
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
      isTextarea = false,
      inputMode,
      disabled = false,
      info = "",
      prefix,
      noSpecialCharacters = true,
      list,
    },
    ref,
  ) => {
    const {
      isListening,
      transcript,
      startListening,
      stopListening,
      browserSupportsSpeechRecognition,
    } = useSpeechToText();

    const previousTranscriptRef = useRef("");

    useEffect(() => {
      if (transcript && transcript !== previousTranscriptRef.current) {
        const newPart = transcript.slice(previousTranscriptRef.current.length);
        const newValue = (value || "") + newPart;

        // Support both string-based and event-based onChange (React Hook Form)
        if (typeof onChange === "function") {
          // Create a synthetic event for React Hook Form if needed
          const event = {
            target: { value: newValue, name },
            currentTarget: { value: newValue, name },
          } as any;

          try {
            onChange(newValue);
          } catch (e) {
            onChange(event);
          }
        }
        previousTranscriptRef.current = transcript;
      }
    }, [transcript, onChange, value, name]);

    const handleMicToggle = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (isListening) {
        stopListening();
      } else {
        startListening();
      }
    };

    const [internalError, setInternalError] = useState("");

    const validateContent = (val: string) => {
      if (noSpecialCharacters && SPECIAL_CHARS_REGEX.test(val)) {
        setInternalError("Special characters are not allowed");
      } else {
        setInternalError("");
      }
    };

    const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
      const newValue = e.target.value;
      validateContent(newValue);

      // Try string first, then event (RHF)
      try {
        onChange(newValue);
      } catch (err) {
        onChange(e);
      }
    };

    const inputClasses = `
      w-full rounded-xl border px-4 py-2.5 outline-none transition-all duration-200
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
      ${isTextarea ? "min-h-[100px] py-3 resize-none" : "h-11"}
      ${isListening ? "border-primary ring-2 ring-primary/10" : ""}
    `;

    return (
      <div className={`space-y-2 ${className}`}>
        <div className="flex max-h-10 items-start gap-1 text-sm font-medium text-card-foreground">
          {info && <CustomTooltip content={info} />}
          <span>{label}</span>
          {required && <span className="text-red-500">*</span>}
        </div>
        <div className="flex gap-2">
          {prefix && (
            <div
              className={cn(
                "flex w-fit items-center rounded-md rounded-r-none",
                "bg-muted-foreground/50 px-3 py-2 text-muted-foreground",
              )}
            >
              <span className="text-nowrap text-sm font-medium text-card-foreground">
                {prefix}
              </span>
            </div>
          )}
          <div className="relative w-full">
            {isTextarea ? (
              <textarea
                id={id}
                name={name}
                ref={ref as any}
                value={value}
                onChange={handleChange}
                onBlur={onBlur}
                placeholder={placeholder}
                disabled={disabled}
                className={inputClasses}
                rows={5}
              />
            ) : (
              <input
                id={id}
                name={name}
                ref={ref as any}
                type={type}
                value={value}
                onChange={handleChange}
                onBlur={onBlur}
                placeholder={placeholder}
                inputMode={inputMode}
                disabled={disabled}
                className={inputClasses}
                min={min}
                max={max}
                list={list}
              />
            )}

            <div className="bottom-4 right-2 z-10 block flex items-center gap-2">
              {isTextarea && browserSupportsSpeechRecognition && !disabled && (
                <button
                  type="button"
                  onClick={handleMicToggle}
                  title={isListening ? "Stop Dictation" : "Start Dictation"}
                  className={`flex h-10 w-10 items-center justify-center rounded-lg p-0 shadow-sm transition-all ${
                    isListening
                      ? "animate-pulse bg-primary text-white ring-4 ring-primary/20"
                      : "bg-transparent text-muted-foreground hover:bg-primary/10 " +
                        "border border-border/50 hover:text-primary"
                  }`}
                >
                  {isListening ? <MicOff size={15} /> : <Mic size={15} />}
                </button>
              )}
            </div>
          </div>
        </div>
        {(error || internalError) && (
          <p
            className={cn(
              "animate-in fade-in slide-in-from-top-1 ml-1 mt-1.5",
              "text-[11px] font-medium text-destructive duration-200",
            )}
          >
            {error || internalError}
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
          <Info className="h-4 w-4 text-muted-foreground transition-colors duration-200 hover:text-primary" />
        )}
      </div>

      {isVisible && (
        <div
          className={cn(
            "animate-in fade-in slide-in-from-bottom-2 fixed z-50",
            "max-w-xs whitespace-normal rounded-md border-2 border-primary",
            "bg-card px-3 py-2 text-sm text-card-foreground shadow-lg",
            "duration-200",
          )}
          style={{
            top: `${position.top}px`,
            left: `${position.left}px`,
            transform: "translateX(-50%)",
            pointerEvents: "none",
          }}
        >
          {content}
          {/* <div className={cn(
    "absolute top-full left-1/2 -translate-x-1/2 w-0 h-0",
    "border-l-4 border-r-4 border-t-4 border-l-transparent",
    "border-r-transparent border-t-primary"
  )} /> */}
        </div>
      )}
    </div>
  );
}
