import { Calendar, FileText, BarChart3, Bell, X } from "lucide-react";

interface Props {
  showNotifications: boolean;
  setShowNotifications: (value: boolean) => void;
  toasts: string[];
}

export default function NotificationModal({
  showNotifications,
  setShowNotifications,
  toasts,
}: Props) {
  if (!showNotifications) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-slate-950/12 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
        onClick={() => setShowNotifications(false)}
      />

      <div className="relative bg-card w-[90%] max-w-2xl h-[75vh] rounded-2xl shadow-2xl border border-border flex flex-col animate-in fade-in zoom-in-95 slide-in-from-bottom-6 duration-300">
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
            <button className="text-xs text-muted-foreground hover:text-primary transition">
              Mark all as read
            </button>

            <button
              onClick={() => setShowNotifications(false)}
              className="p-1 rounded-md hover:bg-muted transition"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="flex gap-6 px-6 py-3 border-b border-border text-sm">
          <button className="font-medium text-primary relative after:absolute after:-bottom-2 after:left-0 after:w-full after:h-[2px] after:bg-primary">
            All
          </button>

          <button className="text-muted-foreground hover:text-foreground transition">
            Unread
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1 scroll-smooth">
          <NotificationItem
            icon={Calendar}
            color="blue"
            title="New appointment request submitted"
            description="A student has requested a counseling session."
            time="5 minutes ago"
            unread
          />

          <NotificationItem
            icon={FileText}
            color="purple"
            title="Excuse letter awaiting review"
            description="A student submitted an excuse letter."
            time="30 minutes ago"
            unread
          />

          <NotificationItem
            icon={BarChart3}
            color="green"
            title="Monthly report generated"
            description="The system generated the monthly analytics report."
            time="Yesterday"
          />
        </div>

        <div className="border-t border-border p-4 text-center">
          <button className="text-sm text-primary hover:underline transition">
            View All Notifications
          </button>
        </div>
      </div>

      <div className="fixed top-6 right-6 z-[99999] flex flex-col gap-3">
        {toasts.map((toast, index) => (
          <div
            key={index}
            className="bg-card border border-border shadow-xl rounded-xl px-5 py-3 text-sm flex items-center gap-3 animate-in slide-in-from-right fade-in zoom-in-95 duration-300"
          >
            <Bell size={16} className="text-primary" />
            {toast}
          </div>
        ))}
      </div>
    </div>
  );
}

function NotificationItem({
  icon: Icon,
  color,
  title,
  description,
  time,
  unread,
}: any) {
  const colors: any = {
    blue: "text-blue-500 bg-blue-500/10",
    purple: "text-purple-500 bg-purple-500/10",
    green: "text-green-500 bg-green-500/10",
  };

  return (
    <div
      className={`group flex items-start gap-4 p-4 rounded-xl cursor-pointer transition-colors duration-200 hover:bg-muted/60 ${
        unread ? "" : "opacity-70"
      }`}
    >
      <span
        className={`w-2 h-2 rounded-full mt-2 ${unread ? "bg-blue-500 shadow-sm" : ""}`}
      />

      <div className={`p-2 rounded-lg ${colors[color]}`}>
        <Icon size={18} />
      </div>

      <div className="flex-1">
        <p className="text-sm font-medium">{title}</p>

        <p className="text-xs text-muted-foreground">{description}</p>

        <p className="text-[11px] text-muted-foreground mt-1">{time}</p>
      </div>
    </div>
  );
}