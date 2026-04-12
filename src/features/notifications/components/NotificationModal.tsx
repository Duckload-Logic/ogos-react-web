import { useState } from "react";
import {
  Calendar,
  FileText,
  Bell,
  X,
  User,
  Shield,
  Info,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import {
  ResponsiveModal,
  ResponsiveModalContent,
} from "@/components/ui/responsive-modal";
import {
  useGetNotifications,
  useMarkNotificationRead,
} from "../hooks/useNotifications";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/hooks";

// Simple relative time formatter
function formatTimeAgo(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;

  return date.toLocaleDateString();
}

// Icon mapper
function getIconForType(type: string) {
  const t = type.toLowerCase();
  if (t.includes("appointment")) return { icon: Calendar, color: "blue" };
  if (t.includes("slip")) return { icon: FileText, color: "purple" };
  if (t.includes("user")) return { icon: User, color: "green" };
  if (t.includes("security") || t.includes("auth"))
    return { icon: Shield, color: "red" };
  if (t.includes("error") || t.includes("failed"))
    return { icon: AlertTriangle, color: "red" };
  if (t.includes("success")) return { icon: CheckCircle, color: "green" };
  return { icon: Info, color: "blue" };
}

interface Props {
  showNotifications: boolean;
  setShowNotifications: (value: boolean) => void;
}

export default function NotificationModal({
  showNotifications,
  setShowNotifications,
}: Props) {
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const { data, isLoading } = useGetNotifications();
  const markRead = useMarkNotificationRead();
  const { user } = useAuth();

  if (!showNotifications) return null;

  const notifications = data?.notifications;
  const displayList =
    notifications?.filter((n) => (filter === "all" ? true : !n.isRead)) || [];
  const unreadCount = notifications?.filter((n) => !n.isRead).length || 0;

  const handleMarkAllRead = async () => {
    if (!notifications) return;
    const unreadIds = notifications.filter((n) => !n.isRead).map((n) => n.id);
    await Promise.allSettled(unreadIds.map((id) => markRead.mutateAsync(id)));
  };

  const handleMarkRead = (id: string, isRead: boolean) => {
    if (!isRead && !markRead.isPending) {
      markRead.mutate(id);
    }
  };

  return (
    <ResponsiveModal
      open={showNotifications}
      onOpenChange={setShowNotifications}
    >
      <ResponsiveModalContent className="flex flex-col w-full md:max-w-[60%] h-[85vh] sm:h-[75vh] p-0 overflow-hidden shadow-2xl border-border bg-card outline-none">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div>
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Bell size={16} className="text-primary" />
              Notifications
            </h2>

            <p className="text-xs text-muted-foreground">
              Stay updated with system activity
            </p>
          </div>

          <div className="flex items-center gap-3">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                disabled={markRead.isPending}
                className="text-xs text-muted-foreground hover:text-primary transition disabled:opacity-50 mr-10"
              >
                Mark all as read
              </button>
            )}
          </div>
        </div>

        <div className="flex gap-6 px-6 py-3 border-b border-border text-sm">
          <button
            onClick={() => setFilter("all")}
            className={`font-medium transition-colors ${filter === "all" ? "text-primary relative after:absolute after:-bottom-[13px] after:left-0 after:w-full after:h-[2px] after:bg-primary" : "text-muted-foreground hover:text-foreground"}`}
          >
            All
          </button>

          <button
            onClick={() => setFilter("unread")}
            className={`font-medium transition-colors flex items-center gap-2 ${filter === "unread" ? "text-primary relative after:absolute after:-bottom-[13px] after:left-0 after:w-full after:h-[2px] after:bg-primary" : "text-muted-foreground hover:text-foreground"}`}
          >
            Unread
            {unreadCount > 0 && filter === "all" && (
              <span className="flex items-center justify-center min-w-[20px] h-5 px-1 text-[10px] text-white bg-red-500 rounded-full">
                {unreadCount}
              </span>
            )}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1 scroll-smooth">
          {isLoading ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Loading notifications...
            </div>
          ) : displayList.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              No {filter === "unread" ? "unread " : ""}notifications found.
            </div>
          ) : (
            displayList.map((notif) => {
              const { icon, color } = getIconForType(notif.type || "");
              return (
                <NotificationItem
                  key={notif.id}
                  icon={icon}
                  color={color}
                  title={notif.title}
                  description={notif.message}
                  time={formatTimeAgo(notif.createdAt)}
                  unread={!notif.isRead}
                  onClick={() => handleMarkRead(notif.id, notif.isRead)}
                />
              );
            })
          )}
        </div>

        <div className="border-t border-border p-4 text-center">
          <Link
            to={`/${user?.role?.name?.toLowerCase().replace(" ", "") || "student"}/notifications`}
            onClick={() => setShowNotifications(false)}
            className="text-sm text-primary hover:underline transition inline-block w-full"
          >
            View All Notifications
          </Link>
        </div>
      </ResponsiveModalContent>
    </ResponsiveModal>
  );
}

interface NotificationItemProps {
  icon: any;
  color: string;
  title: string;
  description: string;
  time: string;
  unread: boolean;
  onClick: () => void;
}

function NotificationItem({
  icon: Icon,
  color,
  title,
  description,
  time,
  unread,
  onClick,
}: NotificationItemProps) {
  const colors: Record<string, string> = {
    blue: "text-blue-500 bg-blue-500/10",
    purple: "text-purple-500 bg-purple-500/10",
    green: "text-green-500 bg-green-500/10",
    red: "text-red-500 bg-red-500/10",
  };

  const colorClass = colors[color] || colors.blue;

  return (
    <div
      onClick={onClick}
      className={`group flex items-start gap-4 p-4 rounded-xl cursor-pointer transition-colors duration-200 hover:bg-muted/60 ${
        unread ? "" : "opacity-70"
      }`}
    >
      <span
        className={`w-2 h-2 rounded-full mt-2 shrink-0 transition-colors ${unread ? "bg-red-500 shadow-sm" : "bg-transparent"}`}
      />

      <div className={`p-2 rounded-lg shrink-0 ${colorClass}`}>
        <Icon size={18} />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{title}</p>

        <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
          {description}
        </p>

        <p className="text-[11px] text-muted-foreground mt-1.5 font-medium">
          {time}
        </p>
      </div>
    </div>
  );
}
