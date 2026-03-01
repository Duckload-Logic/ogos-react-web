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
            <input
              type="radio"
              name={label}
              value={option.id}
              checked={String(value) === String(option.id)}
              onChange={(e) => onChange(e.target.value)}
              disabled={disabled}
              className="w-4 h-4 cursor-pointer accent-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <span className="text-sm text-foreground group-hover:text-primary transition-colors duration-200">
              {option.name || option.text || option.code}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}
