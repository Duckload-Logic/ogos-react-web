import { Check } from "lucide-react";

export default function Checkbox({
  id,
  label,
  name,
  checked,
  onChange,
  onCheckedChange,
  disabled = false,
  className = "",
  info = "",
}: {
  id: string;
  label: string;
  name: string;
  checked: boolean;
  onChange?: (...args: any[]) => void;
  onCheckedChange?: (checked: boolean | "indeterminate") => void;
  disabled?: boolean;
  className?: string;
  info?: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-3 group">
        <div className="relative flex items-center justify-center h-4 w-4 shrink-0">
          <input
            type="checkbox"
            id={id}
            name={name}
            checked={checked}
            onChange={(e) => {
              onChange?.(e);
              onCheckedChange?.(e.target.checked);
            }}
            disabled={disabled}
            className={`peer absolute h-full w-full opacity-0 cursor-pointer z-10  ${className}`}
          />
          <div
            className="h-full w-full rounded-full border border-card-foreground bg-white transition-all duration-200
            peer-checked:bg-red-600 peer-checked:border-red-600 peer-hover:border-red-600"
          />
          <Check className="absolute h-3 w-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" />
        </div>
        <label
          htmlFor={id}
          className="text-sm font-medium text-foreground cursor-pointer select-none group-hover:text-primary transition-colors duration-200 disabled:opacity-50"
        >
          {label}
        </label>
      </div>
      {info && <p className="text-xs text-muted-foreground mt-1 ml-7">{info}</p>}
    </div>
  );
}
