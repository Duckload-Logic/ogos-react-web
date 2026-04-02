import { useState } from "react";
import { usePageMetadata } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, FileText, Bell, User, Shield, Info, CheckCircle, AlertTriangle } from "lucide-react";
import { useGetNotifications, useMarkNotificationRead } from "../hooks/useNotifications";

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
  if (t.includes("security") || t.includes("auth")) return { icon: Shield, color: "red" };
  if (t.includes("error") || t.includes("failed")) return { icon: AlertTriangle, color: "red" };
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
  const displayList = notifications.filter((n) => filter === "all" ? true : !n.isRead);
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAllRead = async () => {
    const unreadIds = notifications.filter((n) => !n.isRead).map((n) => n.id);
    await Promise.allSettled(unreadIds.map(id => markRead.mutateAsync(id)));
  };

  const handleMarkRead = (id: string, isRead: boolean) => {
    if (!isRead && !markRead.isPending) {
      markRead.mutate(id);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-6 space-y-6">
      <Card className="border-border shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-4 border-b">
          <div>
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              Recent Notifications
            </CardTitle>
            <CardDescription className="mt-1">
              Stay up to date with the latest activities and alerts.
            </CardDescription>
          </div>
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleMarkAllRead}
              disabled={markRead.isPending}
            >
              Mark all as read
            </Button>
          )}
        </CardHeader>
        
        <div className="flex gap-4 px-6 border-b border-border text-sm pt-2">
          <button 
            onClick={() => setFilter("all")}
            className={`font-medium transition-colors pb-3 ${filter === "all" ? "text-primary relative after:absolute after:-bottom-[1px] after:left-0 after:w-full after:h-[2px] after:bg-primary" : "text-muted-foreground hover:text-foreground"}`}
          >
            All
          </button>
          <button 
            onClick={() => setFilter("unread")}
            className={`font-medium transition-colors flex items-center gap-2 pb-3 ${filter === "unread" ? "text-primary relative after:absolute after:-bottom-[1px] after:left-0 after:w-full after:h-[2px] after:bg-primary" : "text-muted-foreground hover:text-foreground"}`}
          >
            Unread
            {unreadCount > 0 && filter === "all" && (
                <span className="flex items-center justify-center min-w-[20px] h-5 px-1 text-[10px] text-white bg-red-500 rounded-full">
                    {unreadCount}
                </span>
            )}
          </button>
        </div>

        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {isLoading ? (
              <div className="p-8 text-center text-sm text-muted-foreground">Loading notifications...</div>
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
                    className={`group flex items-start gap-4 p-5 sm:px-6 cursor-pointer transition-colors duration-200 hover:bg-muted/40 ${
                      !notif.isRead ? "bg-muted/10" : "opacity-75"
                    }`}
                  >
                    <span
                      className={`w-2.5 h-2.5 rounded-full mt-2.5 shrink-0 transition-colors ${!notif.isRead ? "bg-red-500 shadow-sm" : "bg-transparent"}`}
                    />

                    <div className={`p-2.5 rounded-xl shrink-0 ${colorClass}`}>
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="flex-1 min-w-0 pr-4">
                      <p className={`text-sm sm:text-base ${!notif.isRead ? "font-semibold text-foreground" : "font-medium text-muted-foreground"}`}>{notif.title}</p>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2 sm:line-clamp-none leading-relaxed">{notif.message}</p>
                      <p className="text-xs text-muted-foreground font-medium mt-2">{formatTimeAgo(notif.createdAt)}</p>
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
