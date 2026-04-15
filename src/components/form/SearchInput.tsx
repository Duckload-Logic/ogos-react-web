import { Search, X } from "lucide-react";
import { useState } from "react";
import { SPECIAL_CHARS_REGEX } from "@/utils/validation";

const ICON_SIZE = 20;

export default function SearchInput({
  className = "",
  searchTerm,
  onSearchChange,
  placeholder = "Search...",
  hasHeader = true,
  noSpecialCharacters = false,
}: any) {
  const [error, setError] = useState("");

  const handleChange = (val: string) => {
    if (noSpecialCharacters && SPECIAL_CHARS_REGEX.test(val)) {
      setError("Special characters are not allowed");
    } else {
      setError("");
    }
    onSearchChange(val);
  };

  return (
    <div className={className}>
      {hasHeader && (
        <label className="block text-sm font-medium text-card-foreground mb-2">
          Search:
        </label>
      )}
      <div className="flex gap-2 items-center">
        <div className="relative w-full">
          <input
            type="text"
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => handleChange(e.target.value)}
            className={`w-full h-11 rounded-xl border px-4 py-2.5 outline-none transition-all duration-200
                text-sm font-medium tracking-tight text-foreground placeholder:text-muted-foreground/70
                bg-muted/60 dark:bg-muted/20 border-border hover:border-glass-border/60 focus:bg-glass-bg dark:focus:bg-glass-bg/40 focus:border-primary/50 focus:ring-2 focus:ring-primary/5
                ${error ? "border-destructive/50 ring-destructive/5" : ""}
                `}
          />
        </div>
        {searchTerm ? (
          <button
            onClick={() => handleChange("")}
            className="flex items-center justify-center p-1 text-card-foreground hover:bg-muted/50 rounded transition-colors cursor-pointer"
            type="button"
          >
            <X size={ICON_SIZE} />
          </button>
        ) : (
          <div className="flex items-center justify-center p-1 text-card-foreground opacity-50">
            <Search size={ICON_SIZE} />
          </div>
        )}
      </div>
      {error && (
        <p className="text-[11px] font-medium text-destructive mt-1.5 ml-1 animate-in fade-in slide-in-from-top-1 duration-200">
          {error}
        </p>
      )}
    </div>
  );
}
