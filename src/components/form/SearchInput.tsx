import { Search, X } from "lucide-react";

const ICON_SIZE = 20;

export default function SearchInput({
  className = "",
  searchTerm,
  onSearchChange,
  placeholder = "Search...",
  hasHeader = true,
}: any) {
  return (
    <div className={className}>
      {hasHeader && (
        <label className="block text-sm font-medium text-card-foreground mb-2">
          Search:
        </label>
      )}
      <div className="flex gap-2 items-center">
        <input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="flex-1 px-4 py-2 border-2 border-border rounded-md bg-muted focus:outline-none focus:ring-2 focus:ring-primary"
        />
        {searchTerm ? (
          <button
            onClick={() => onSearchChange("")}
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
    </div>
  );
}
