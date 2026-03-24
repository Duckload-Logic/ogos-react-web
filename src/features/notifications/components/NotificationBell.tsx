import { Bell } from "lucide-react";

interface Props {
  showNotifications: boolean;
  setShowNotifications: (value: boolean) => void;
}

export default function NotificationBell({
  showNotifications,
  setShowNotifications,
}: Props) {
  return (
    <button
      onClick={() => setShowNotifications(!showNotifications)}
      className="relative p-2 rounded-lg transition-colors duration-200 hover:bg-muted active:scale-95 group"
    >
      <Bell
        size={18}
        className="transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-110 group-hover:text-primary"
      />

      <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 text-[10px] font-medium text-white bg-red-500 rounded-full shadow-md">
        3
      </span>
    </button>
  );
}