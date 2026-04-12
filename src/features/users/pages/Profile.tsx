import { useState, useRef, useEffect, useMemo } from "react";
import { useAuth } from "@/context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Camera,
  Mail,
  Shield,
  User,
  Calendar,
  LogOut,
  Settings,
  Lock,
  Activity,
  CheckCircle2,
  Clock,
  Key,
  Smartphone,
  Info,
} from "lucide-react";
import { usePageMetadata } from "@/components/layout/Layout";
import {
  GetMyActivities,
  LogEntry,
} from "@/features/activity-meta/services/logService";
import { format12HourTime, formatDate } from "@/utils";

export default function Profile() {
  const { user, logout } = useAuth();
  const [previewImage, setPreviewImage] = useState<string | null>(
    user?.profilePicture || null,
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activities, setActivities] = useState<LogEntry[]>([]);
  const [isLoadingActivities, setIsLoadingActivities] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await GetMyActivities();
        setActivities(response.logs);
      } catch (error) {
        console.error("Failed to fetch activities:", error);
      } finally {
        setIsLoadingActivities(false);
      }
    };

    fetchActivities();
  }, []);

  const stats = useMemo(() => {
    if (!activities.length) return { logins: 0, reports: 0, lastSession: null };

    const loginLogs = activities.filter(
      (log) => log.action === "LOGIN_SUCCESS",
    );

    // Actions that count as "reports" or significant contributions
    const reportActions = [
      "APPOINTMENT_CREATED",
      "SLIP_CREATED",
      "NOTE_CREATED",
      "STUDENT_RECORD_CREATED",
    ];
    const reportLogs = activities.filter((log) =>
      reportActions.includes(log.action),
    );

    return {
      logins: loginLogs.length,
      reports: reportLogs.length,
      lastSession: loginLogs.length > 0 ? loginLogs[0].createdAt : null,
    };
  }, [activities]);

  const profileCompleteness = useMemo(() => {
    if (!user) return 0;
    const fields = [
      user.firstName,
      user.lastName,
      user.middleName,
      user.profilePicture,
      user.email,
      user.type,
    ];
    const filledFields = fields.filter((field) => !!field);
    return Math.round((filledFields.length / fields.length) * 100);
  }, [user]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  if (!user) return null;

  usePageMetadata({
    title: "Account Profile",
    isLoading: false,
    badgeText: "Management",
    badgeIcon: <Settings size={16} />,
  });

  return (
    <div className="mx-auto flex w-full max-w-[1700px] flex-col space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      {/* Profile Header / Hero Section */}
      <div className="relative group overflow-hidden rounded-[32px] border border-white/20 bg-white/45 p-8 md:p-12 backdrop-blur-xl shadow-[0_8px_22px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-white/[0.04] dark:shadow-[0_8px_22px_rgba(0,0,0,0.22)] transition-all duration-500 hover:shadow-primary/5">
        <div className="relative flex flex-col md:flex-row items-center md:items-start gap-10">
          {/* Avatar Section with Impact */}
          <div className="relative group/avatar shrink-0">
            <div className="w-40 h-40 rounded-full p-1.5 bg-gradient-to-tr from-primary via-primary/50 to-blue-400 shadow-2xl relative">
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-black/40 rounded-b-full blur-sm" />
              <Avatar className="w-full h-full rounded-full border-4 border-card relative z-10">
                <AvatarImage
                  src={previewImage || ""}
                  className="object-cover transition-transform duration-500 group-hover/avatar:scale-110"
                />
                <AvatarFallback className="text-4xl font-extrabold bg-muted text-muted-foreground uppercase">
                  {user.firstName[0]}
                  {user.lastName[0]}
                </AvatarFallback>
              </Avatar>
            </div>

            <button
              onClick={triggerFileInput}
              className="absolute bottom-2 right-2 p-3.5 rounded-full bg-primary text-primary-foreground shadow-2xl transform transition-all duration-300 hover:scale-110 hover:rotate-12 active:scale-95 z-20"
              title="Change profile picture"
            >
              <Camera size={20} />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              className="hidden"
              accept="image/*"
            />
          </div>

          {/* User Essential Info */}
          <div className="flex-1 text-center md:text-left space-y-4">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                <Badge
                  variant="outline"
                  className="px-3 py-1 rounded-full border-primary/10 text-primary bg-primary/10 backdrop-blur-md"
                >
                  {user.type.toUpperCase()} ACCOUNT
                </Badge>
                <Badge
                  key={user.role.id}
                  variant="secondary"
                  className="px-3 py-1 rounded-full bg-muted/60 text-foreground font-semibold uppercase tracking-wider text-[10px]"
                >
                  {user.role.name}
                </Badge>
              </div>
              <h1 className="text-lg md:text-5xl font-black tracking-tight text-foreground bg-clip-text bg-gradient-to-r from-foreground to-foreground/60">
                {user.firstName} {user.middleName && `${user.middleName[0]}. `}{" "}
                {user.lastName}
              </h1>
              <p className="text-xl text-muted-foreground/80 font-medium">
                @{user.email.split("@")[0]}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 pt-6 mt-4 border-t border-border/20">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                  Last Session
                </span>
                <span className="flex items-center gap-1.5 text-xs font-bold">
                  <Clock size={12} className="text-blue-400" />{" "}
                  {stats.lastSession
                    ? `${format12HourTime(stats.lastSession)} Today`
                    : "No recent session"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actionable Tabs Interface */}
      <Tabs defaultValue="overview" className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <TabsList className="bg-white/45 backdrop-blur-md border border-white/20 p-1 rounded-2xl h-auto self-start dark:bg-white/[0.04]">
            <TabsTrigger
              value="overview"
              className="rounded-xl px-6 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all flex gap-2"
            >
              <User size={16} /> Overview
            </TabsTrigger>
            <TabsTrigger
              value="security"
              className="rounded-xl px-6 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all flex gap-2"
            >
              <Shield size={16} /> Security
            </TabsTrigger>
            <TabsTrigger
              value="activity"
              className="rounded-xl px-6 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all flex gap-2"
            >
              <Activity size={16} /> Activity
            </TabsTrigger>
          </TabsList>

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="rounded-xl border-border/50 hover:bg-muted font-bold text-xs uppercase tracking-widest"
              disabled
              title="Feature coming soon"
            >
              Export Account Data
            </Button>
            <Button
              onClick={logout}
              variant="destructive"
              className="rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-red-500/10"
            >
              <LogOut size={16} className="mr-2" /> Logout
            </Button>
          </div>
        </div>

        {/* Overview Tab Content */}
        <TabsContent
          value="overview"
          className="grid grid-cols-1 md:grid-cols-3 gap-6 outline-none"
        >
          <Card className="md:col-span-2 rounded-[32px] border-white/20 bg-white/45 backdrop-blur-xl shadow-[0_8px_22px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-white/[0.04] overflow-hidden hover:border-primary/20 transition-colors">
            <CardHeader className="p-8 border-b border-white/10 bg-white/20 dark:bg-white/[0.02]">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-2xl font-bold flex items-center gap-2">
                    <User className="text-primary" size={24} />
                    Personal Information
                  </CardTitle>
                  <CardDescription>
                    Primary account details that identify you in the system.
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full bg-muted/50 border-primary/20 text-primary cursor-not-allowed group"
                >
                  <Lock size={14} className="mr-2 group-hover:animate-bounce" />{" "}
                  Uneditable
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-8">
                <div className="space-y-2 group">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 transition-colors group-hover:text-primary">
                    First Name
                  </p>
                  <div className="h-10 flex items-center px-4 rounded-xl bg-muted/40 border border-border/10 text-sm font-bold">
                    {user.firstName}
                  </div>
                </div>
                {user.middleName && (
                  <div className="space-y-2 group">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 transition-colors group-hover:text-primary">
                      Middle Name
                    </p>
                    <div className="h-10 flex items-center px-4 rounded-xl bg-muted/40 border border-border/10 text-sm font-bold italic text-muted-foreground">
                      {user.middleName}
                    </div>
                  </div>
                )}
                <div className="space-y-2 group">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 transition-colors group-hover:text-primary">
                    Last Name
                  </p>
                  <div className="h-10 flex items-center px-4 rounded-xl bg-muted/40 border border-border/10 text-sm font-bold">
                    {user.lastName}
                  </div>
                </div>
                <div className="space-y-2 group">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 transition-colors group-hover:text-primary">
                    Primary Email
                  </p>
                  <div className="h-10 flex items-center px-4 rounded-xl bg-muted/40 border border-border/10 text-sm font-bold gap-3">
                    <Mail size={16} className="text-blue-500" />
                    {user.email}
                  </div>
                </div>
                <div className="space-y-2 group sm:col-span-2">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 transition-colors group-hover:text-primary">
                    Contact Number
                  </p>
                  <div className="h-10 flex items-center px-4 rounded-xl bg-muted/40 border border-border/10 text-sm font-bold text-muted-foreground/50 italic">
                    Not provided
                  </div>
                </div>
              </div>

              <div className="mt-12 p-6 rounded-[24px] bg-primary/5 border border-primary/10 flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-2xl bg-primary/20 text-primary group-hover:scale-110 transition-transform">
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold">Verified Account</h4>
                    <p className="text-xs text-muted-foreground">
                      Your account has been verified by the system
                      administrator.
                    </p>
                  </div>
                </div>
                <Badge className="bg-primary/20 text-primary border-none">
                  SYSTEM VERIFIED
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[32px] border-white/20 bg-white/45 backdrop-blur-xl shadow-[0_8px_22px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-white/[0.04] overflow-hidden self-start">
            <CardHeader className="p-8 border-b border-white/10">
              <CardTitle className="text-lg font-bold">Quick Stats</CardTitle>
              <CardDescription>Engagement and account metrics.</CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="space-y-1">
                <div className="flex justify-between items-end">
                  <p className="text-[10px] font-bold uppercase text-muted-foreground/60">
                    Profile Completeness
                  </p>
                  <span className="text-xs font-black">
                    {profileCompleteness}%
                  </span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full shadow-[0_0_10px_rgba(var(--primary),0.3)] transition-all duration-1000"
                    style={{ width: `${profileCompleteness}%` }}
                  />
                </div>
              </div>

              <Separator className="bg-border/20" />

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-muted/30 border border-border/10 text-center">
                  <p className="text-[10px] font-bold text-muted-foreground/60 mb-1">
                    LOGINS
                  </p>
                  <p className="text-xl font-black">{stats.logins}</p>
                </div>
                <div className="p-4 rounded-2xl bg-muted/30 border border-border/10 text-center">
                  <p className="text-[10px] font-bold text-muted-foreground/60 mb-1">
                    REPORTS
                  </p>
                  <p className="text-xl font-black">{stats.reports}</p>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-blue-500/10 border border-primary/20 shadow-inner">
                <div className="flex items-center gap-3 mb-2">
                  <Calendar size={16} className="text-primary" />
                  <p className="text-xs font-bold">Join Date</p>
                </div>
                <p className="text-xl font-black tracking-tight">
                  {user.createdAt ? formatDate(user.createdAt) : "N/A"}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab Content */}
        <TabsContent
          value="security"
          className="grid grid-cols-1 md:grid-cols-2 gap-6 outline-none"
        >
          <Card className="rounded-[32px] border-white/20 bg-white/45 backdrop-blur-xl shadow-[0_8px_22px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-white/[0.04] overflow-hidden hover:border-blue-500/20 transition-colors">
            <CardHeader className="p-8 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
                  <Key size={24} />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold">
                    Password & Auth
                  </CardTitle>
                  <CardDescription>
                    Manage your sign-in methods.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="flex items-center justify-between p-5 rounded-2xl bg-muted/30 border border-border/10 group hover:bg-muted/50 transition-all opacity-60">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-xl bg-background border border-border/20 group-hover:scale-110 transition-transform">
                    <Lock size={20} className="text-muted-foreground" />
                  </div>
                  <div>
                    <h5 className="font-bold">Password</h5>
                    <p className="text-xs text-muted-foreground">
                      Feature not yet available
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="text-[9px] font-bold">
                  COMING SOON
                </Badge>
              </div>

              <div className="flex items-center justify-between p-5 rounded-2xl bg-muted/30 border border-border/10 group hover:bg-muted/50 transition-all opacity-60">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-xl bg-background border border-border/20 group-hover:scale-110 transition-transform">
                    <Smartphone size={20} className="text-muted-foreground" />
                  </div>
                  <div>
                    <h5 className="font-bold">Two-Factor Auth</h5>
                    <p className="text-xs text-muted-foreground">Disabled</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-[9px] font-bold">
                  COMING SOON
                </Badge>
              </div>

              <div className="bg-amber-500/5 rounded-[24px] p-6 border border-amber-500/10 flex flex-col gap-4">
                <div className="flex items-center gap-2 text-amber-500">
                  <Info size={16} />
                  <span className="text-xs font-black uppercase tracking-wider">
                    Note
                  </span>
                </div>
                <p className="text-sm font-medium leading-relaxed italic">
                  Security management features are currently being implemented
                  by the system developers. Some controls may be temporarily
                  disabled.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[32px] border-white/20 bg-white/45 backdrop-blur-xl shadow-[0_8px_22px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-white/[0.04] overflow-hidden">
            <CardHeader className="p-8 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500">
                  <Activity size={24} />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold">
                    Current Session
                  </CardTitle>
                  <CardDescription>
                    Details about your current login session.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-green-500/5 border border-green-500/20">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
                      <Smartphone size={20} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h6 className="font-bold">Active Device</h6>
                        <Badge className="bg-green-500/20 text-green-600 text-[8px] h-4 border-none">
                          CURRENT
                        </Badge>
                      </div>
                      <p className="text-[10px] text-muted-foreground font-medium">
                        Your current browser session
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-green-500">
                    ACTIVE
                  </span>
                </div>
              </div>

              <Separator className="my-4 bg-border/10" />

              <p className="text-[10px] text-muted-foreground text-center italic">
                Advanced session management is not yet available.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activity Tab Content */}
        <TabsContent value="activity" className="outline-none">
          <Card className="rounded-[32px] border-white/20 bg-white/45 backdrop-blur-xl shadow-[0_8px_22px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-white/[0.04] overflow-hidden">
            <CardHeader className="p-10 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                    <Activity size={28} />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold">
                      Activity Dashboard
                    </CardTitle>
                    <CardDescription>
                      Track your interactions and system events.
                    </CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-10">
              {isLoadingActivities ? (
                <div className="flex flex-col items-center justify-center py-24 space-y-4">
                  <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                  <p className="text-muted-foreground font-medium">
                    Loading your activities...
                  </p>
                </div>
              ) : activities.length > 0 ? (
                <div className="space-y-6">
                  {activities.slice(0, 10).map((log) => (
                    <div
                      key={log.id}
                      className="flex gap-4 p-4 rounded-2xl bg-muted/20 border border-border/10 group hover:bg-muted/30 transition-all"
                    >
                      <div
                        className={`p-2 h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${log.category === "SECURITY"
                          ? "bg-blue-500/10 text-blue-500"
                          : log.category === "AUDIT"
                            ? "bg-amber-500/10 text-amber-500"
                            : "bg-primary/10 text-primary"
                          }`}
                      >
                        {log.action.includes("LOGIN") ? (
                          <Key size={20} />
                        ) : log.action.includes("CREATED") ? (
                          <CheckCircle2 size={20} />
                        ) : (
                          <Activity size={20} />
                        )}
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <h6 className="font-bold text-sm">
                            {log.action.replace(/_/g, " ")}
                          </h6>
                          <span className="text-[10px] text-muted-foreground font-medium">
                            {new Date(log.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {log.message}
                        </p>
                      </div>
                    </div>
                  ))}
                  {activities.length > 10 && (
                    <p className="text-[10px] text-muted-foreground text-center pt-4 italic">
                      Showing last 10 activities.
                    </p>
                  )}
                </div>
              ) : (
                <div className="max-w-xs mx-auto space-y-6 py-24 text-center">
                  <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-card shadow-inner">
                    <Clock size={32} className="text-muted-foreground/40" />
                  </div>
                  <h3 className="text-xl font-bold">No recent activities</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Your recent activities, login history, and system logs will
                    appear here as you interact with the platform.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
