import React from "react";

export default function RadioField({
  label,
  options,
  value,
  onChange,
  required = false,
  columns = 1,
  disabled = false,
}: {
  label: string;
  options: Array<{ id: string | number; name: string; text?: string; code?: string }>;
  value: string | number;
  onChange: (val: string | number) => void;
  required?: boolean;
  columns?: number;
  disabled?: boolean;
}) {
  const gridColsClass = {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-3",
  }[columns] || "grid-cols-1";

  return (
    <div className="space-y-2">
      <div className="text-sm font-medium text-card-foreground flex items-start gap-1">
        <span>{label}</span>
        {required && <span className="text-red-500">*</span>}
      </div>
      <div className={`grid ${gridColsClass} gap-4`}>
        {options.map((option) => (
          <label
            key={option.id}
            className="flex items-center gap-3 group cursor-pointer"
          >
              <div className="relative flex items-center justify-center h-5 w-5 shrink-0 transition-transform duration-200 group-active:scale-95">
                <input
                  type="radio"
                  name={label}
                  value={option.id}
                  checked={String(value) === String(option.id)}
                  onChange={() => onChange(option.id)}
                  disabled={disabled}
                  className="peer absolute h-full w-full opacity-0 cursor-pointer z-10"
                />
                <div className="h-full w-full rounded-full border border-white/30 bg-white/40 transition-all duration-200 peer-checked:border-primary peer-checked:bg-primary/5 dark:border-white/10 dark:bg-white/[0.04] dark:peer-checked:border-primary" />
                <div className="absolute h-2 w-2 rounded-full bg-primary opacity-0 peer-checked:opacity-100 transition-all duration-200 scale-50 peer-checked:scale-100 pointer-events-none" />
              </div>
              <span className="text-sm font-medium text-foreground/80 group-hover:text-primary transition-colors duration-200">
                {option.name || option.text || option.code}
              </span>
            </label>
          ))}
        </div>
      </div>
    );
  }
