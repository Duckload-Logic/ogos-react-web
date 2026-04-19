import { Nothing } from "@/assets/icons";
import { cn } from "@/lib/utils";

interface NothingFoundProps {
  message: string;
}

export const NothingFound = ({ message }: NothingFoundProps) => {
  return (
    <div
      className={cn(
        "flex h-full w-full flex-col items-center justify-center",
        "gap-4 bg-transparent p-12 text-center",
      )}
    >
      <Nothing className="h-64 w-64 text-muted" />
      <p className="text-lg font-semibold text-muted">{message}</p>
    </div>
  );
};
