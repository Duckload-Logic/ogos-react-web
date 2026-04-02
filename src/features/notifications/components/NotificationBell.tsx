import { Bell } from "lucide-react";
import { useGetNotifications } from "../hooks/useNotifications";

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
      className="relative p-2 hover:bg-muted/30 rounded-lg transition-colors duration-300 text-foreground"
    >
      <Bell
        size={18}
        className="transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-110 group-hover:text-primary"
      />

      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-4 h-4 px-1 text-[10px] font-medium text-white bg-red-500 rounded-full shadow-md">
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}
    </button>
  );
}
