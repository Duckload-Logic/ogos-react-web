import { useState } from "react";
import { usePageMetadata } from "@/context";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  FileText,
  Bell,
  User,
  Shield,
  Info,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useGetNotifications,
  useMarkNotificationRead,
} from "@/features/notifications/hooks/useNotifications";

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

export default function NotificationsPage() {
  usePageMetadata({
    title: "Notifications",
    description: "View all your system activities and alerts.",
    badgeText: "Account",
  });

  const [filter, setFilter] = useState<"all" | "unread">("all");
  const { data, isLoading } = useGetNotifications();
  const markRead = useMarkNotificationRead();

  const notifications = data?.notifications || [];
  const displayList = notifications.filter((n) =>
    filter === "all" ? true : !n.isRead,
  );
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAllRead = async () => {
    const unreadIds = notifications.filter((n) => !n.isRead).map((n) => n.id);
    await Promise.allSettled(unreadIds.map((id) => markRead.mutateAsync(id)));
  };

  const handleMarkRead = (id: string, isRead: boolean) => {
    if (!isRead && !markRead.isPending) {
      markRead.mutate(id);
    }
  };

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 p-4 md:p-6">
      <Card className="border-border shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
          <div>
            <CardTitle className="flex items-center gap-2 text-xl font-semibold">
              <Bell className="h-5 w-5 text-primary" />
              Recent Notifications
            </CardTitle>
            <CardDescription className="mt-1">
              Stay up to date with the latest activities and alerts.
            </CardDescription>
          </div>
          {unreadCount > 0 && (
            <Button
              onClick={handleMarkAllRead}
              disabled={markRead.isPending}
            >
              Mark all as read
            </Button>
          )}
        </CardHeader>

        <div className="flex gap-4 border-b border-border px-6 pt-2 text-sm">
          <button
            onClick={() => setFilter("all")}
            className={cn(
              "pb-3 font-medium transition-colors",
              filter === "all"
                ? "relative text-primary after:absolute after:-bottom-[1px] after:left-0 after:h-[2px] after:w-full after:bg-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            All
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={cn(
              "flex items-center gap-2 pb-3 font-medium transition-colors",
              filter === "unread"
                ? "relative text-primary after:absolute after:-bottom-[1px] after:left-0 after:h-[2px] after:w-full after:bg-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Unread
            {unreadCount > 0 && filter === "all" && (
              <span
                className={cn(
                  "flex h-5 min-w-[20px] items-center justify-center",
                  "rounded-full bg-red-500 px-1 text-[10px] text-white",
                )}
              >
                {unreadCount}
              </span>
            )}
          </button>
        </div>

        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {isLoading ? (
              <div className="p-8 text-center text-sm text-muted-foreground">
                Loading notifications...
              </div>
            ) : displayList.length === 0 ? (
              <div className="p-12 text-center text-sm text-muted-foreground">
                No {filter === "unread" ? "unread " : ""}notifications found.
              </div>
            ) : (
              displayList.map((notif) => {
                const { icon: Icon, color } = getIconForType(notif.type || "");
                const colors: Record<string, string> = {
                  blue: "text-blue-500 bg-blue-500/10",
                  purple: "text-purple-500 bg-purple-500/10",
                  green: "text-green-500 bg-green-500/10",
                  red: "text-red-500 bg-red-500/10",
                };
                const colorClass = colors[color] || colors.blue;

                return (
                  <div
                    key={notif.id}
                    onClick={() => handleMarkRead(notif.id, notif.isRead)}
                    className={cn(
                      "group flex cursor-pointer items-start gap-4 p-5 transition-colors duration-200 hover:bg-muted/40 sm:px-6",
                      !notif.isRead ? "bg-muted/10" : "opacity-75"
                    )}
                  >
                    <span
                      className={cn(
                        "mt-2.5 h-2.5 w-2.5 shrink-0 rounded-full transition-colors",
                        !notif.isRead ? "bg-red-500 shadow-sm" : "bg-transparent"
                      )}
                    />

                    <div className={cn("shrink-0 rounded-xl p-2.5", colorClass)}>
                      <Icon className="h-5 w-5" />
                    </div>

                    <div className="min-w-0 flex-1 pr-4">
                      <p
                        className={cn(
                          "text-sm sm:text-base",
                          !notif.isRead
                            ? "font-semibold text-foreground"
                            : "font-medium text-muted-foreground"
                        )}
                      >
                        {notif.title}
                      </p>
                      <p
                        className={cn(
                          "mt-1 line-clamp-2 text-sm leading-relaxed",
                          "text-muted-foreground sm:line-clamp-none",
                        )}
                      >
                        {notif.message}
                      </p>
                      <p className="mt-2 text-xs font-medium text-muted-foreground">
                        {formatTimeAgo(notif.createdAt)}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
