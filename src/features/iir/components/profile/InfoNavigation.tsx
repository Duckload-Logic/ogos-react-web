import {
  Activity,
  BookOpen,
  HeartPulse,
  MessageSquare,
  Trophy,
  User,
  Users,
} from "lucide-react";
import { TabId } from "../../constants";

const TABS: { id: TabId; label: string; icon: any }[] = [
  { id: "personal", label: "I. Personal Information", icon: User },
  { id: "education", label: "II. Educational Background", icon: BookOpen },
  { id: "family", label: "III. Family Background", icon: Users },
  { id: "health", label: "IV. Health", icon: HeartPulse },
  { id: "interests", label: "V. Interests & Hobbies", icon: Trophy },
  { id: "testResults", label: "VI. Test Results", icon: Activity },
  {
    id: "significantNotes",
    label: "VII. Significant Notes",
    icon: MessageSquare,
  },
];

export default function InfoNavigation({
  activeTab,
  setActiveTab,
}: {
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
}) {
  return (
    <div className="relative z-20 -mb-[2px]">
      <nav className="flex items-end gap-1 w-full sm:w-auto overflow-x-auto overflow-y-hidden sm:overflow-visible no-scrollbar ml-0 sm:ml-4">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex-1 sm:flex-none whitespace-nowrap py-3 px-4 sm:px-6 text-xs sm:text-sm font-medium transition-all duration-300
                border-t-2 border-l-2 border-r-2 group
                ${
                  isActive
                    ? "bg-card text-card-foreground border-border rounded-t-xl"
                    : "bg-muted text-muted-foreground border-transparent rounded-t-lg z-0 opacity-70"
                }`}
            >
              <div className="flex items-center justify-center gap-2 group-hover:text-secondary transition-colors">
                <tab.icon
                  className={`transition-all duration-300 group-hover:text-secondary ${isActive ? "scale-110 text-primary" : "opacity-60 group-hover:opacity-100"}`}
                  size={18}
                />

                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    isActive
                      ? "grid-cols-[1fr] opacity-100"
                      : "grid-cols-[0fr] opacity-0"
                  }`}
                >
                  <span className="overflow-hidden whitespace-nowrap text-[10px] sm:text-sm hidden sm:block  group-hover:text-secondary">
                    {tab.label}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
