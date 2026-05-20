import { Bell } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  toasts: string[];
  icon?: React.ReactNode;
}

const ICON_SIZE = 20;

export default function Toast({
  toasts,
  icon = (
    <Bell
      size={ICON_SIZE}
      className="text-primary"
    />
  ),
}: Props) {
  const visibleToasts = toasts.slice(-5);

  return (
    <div className="fixed bottom-4 right-6 z-[99999] flex flex-col gap-3">
      {visibleToasts.map((toast, index) => {
        const age = visibleToasts.length - 1 - index;
        const opacity = Math.max(0.2, 1 - age * 0.2);

        return (
          <div
            key={index}
            style={{ opacity }}
            className={cn(
              "flex animate-toast-slide-in-right items-center gap-3",
              "rounded-xl border-glass-border bg-card px-5 py-3 text-sm",
              "shadow-xl transition-opacity duration-300",
            )}
          >
            <div className="flex-shrink-0 origin-top animate-ring">{icon}</div>
            {toast}
          </div>
        );
      })}
    </div>
  );
}
