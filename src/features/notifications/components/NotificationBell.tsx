import { Bell } from "lucide-react";
import { useGetNotifications } from "../hooks/useNotifications";
import { cn } from "@/lib/utils";

interface Props {
  showNotifications: boolean;
  setShowNotifications: (value: boolean) => void;
}

export default function NotificationBell({
  showNotifications,
  setShowNotifications,
}: Props) {
  const { data } = useGetNotifications();
  const notifications = data?.notifications;
  const unreadCount = notifications?.filter((n) => !n.isRead).length || 0;

  return (
    <button
      onClick={() => setShowNotifications(!showNotifications)}
      className={cn(
        "relative rounded-lg p-2 text-foreground transition-colors",
        "duration-300 hover:bg-muted/30",
      )}
    >
      <Bell
        size={18}
        className={cn(
          "transition-transform duration-300 group-hover:-rotate-12",
          "group-hover:scale-110 group-hover:text-primary",
        )}
      />

      {unreadCount > 0 && (
        <span
          className={cn(
            "absolute -right-1 -top-1 flex h-4 min-w-4 items-center",
            "justify-center rounded-full bg-red-500 px-1 text-[10px]",
            "font-medium text-white shadow-md",
          )}
        >
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}
    </button>
  );
}
