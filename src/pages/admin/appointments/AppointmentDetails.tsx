import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useAppointment,
  useStatuses,
  useUpdateAppointment,
} from "@/features/appointments/hooks";
import {
  CalendarDays,
  Clock,
  Tag,
  User,
  Mail,
  FileText,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock3,
  CalendarRange,
  ShieldUser,
  ArrowLeft,
  Building2,
  Fingerprint,
  MessageSquare,
  StickyNote,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { STATUS_COLORS } from "@/config/constants";
import { format12HourTime } from "@/features/appointments/utils";
import { formatDate } from "@/features/schedules/utils/formatters";
import { usePageMetadata } from "@/context";
import ActionConfirmModal from "@/features/appointments/components/ConfirmModal";
import RescheduleModal from "@/features/appointments/components/RescheduleModal";
import { CORPreviewDialog } from "@/components/shared/CORPreviewDialog";
import { cn } from "@/lib/utils";

export default function AppointmentDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: appointment, isLoading, isError } = useAppointment(id || "");
  const { data: appointmentStatuses } = useStatuses();
  const { mutateAsync: updateAppointment } = useUpdateAppointment();

  const [pendingAction, setPendingAction] = useState<{
    type: string;
    requiresMessage: boolean;
  } | null>(null);
  const [showReschedule, setShowReschedule] = useState(false);
  const [showCorPreview, setShowCorPreview] = useState(false);

  const fullName = appointment
    ? [
        appointment.user?.firstName,
        appointment.user?.middleName
          ? `${appointment.user.middleName[0]}.`
          : "",
        appointment.user?.lastName,
      ]
        .filter(Boolean)
        .join(" ")
    : "";

  const initials = appointment?.user
    ? `${appointment.user.firstName[0]}${appointment.user.lastName[0]}`
    : "??";

  usePageMetadata({
    title: "Appointment Details",
    description: `Managing session for ${fullName || "Student"}`,
    badgeText: "Admin Management",
    badgeIcon: <Calendar className="h-4 w-4" />,
    isLoading: isLoading && !appointment,
    headerActions: null,
  });

  if (isError) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center space-y-4">
        <p className="font-medium text-destructive">
          Error loading appointment
        </p>
        <Button
          onClick={() => navigate("/admin/appointments")}
          variant="outline"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to List
        </Button>
      </div>
    );
  }

  if (!appointment && !isLoading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center space-y-4">
        <p className="text-muted-foreground">Appointment not found</p>
        <Button
          onClick={() => navigate("/admin/appointments")}
          variant="outline"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to List
        </Button>
      </div>
    );
  }

  if (!appointment) return null;

  const getAllowedActions = (statusName: string): string[] => {
    switch (statusName) {
      case "Pending":
        return ["Approve", "Reject"];
      case "Scheduled":
        return ["Reschedule", "Cancel", "Complete", "No-show"];
      case "Rescheduled":
        return ["Reschedule", "Cancel", "Complete", "No-show"];
      default:
        return [];
    }
  };

  const allowedActions = getAllowedActions(appointment.status?.name || "");

  const actionColor = (action: string): string => {
    switch (action) {
      case "Approve":
        return "bg-green-600 hover:bg-green-700 text-white";
      case "Reject":
        return "bg-red-600 hover:bg-red-700 text-white";
      case "Cancel":
        return "bg-orange-600 hover:bg-orange-700 text-white";
      case "Complete":
        return "bg-blue-600 hover:bg-blue-700 text-white";
      case "No-show":
        return "bg-gray-600 hover:bg-gray-700 text-white";
      case "Reschedule":
        return "bg-purple-600 hover:bg-purple-700 text-white";
      default:
        return "bg-primary hover:bg-primary/90 text-primary-foreground";
    }
  };

  const actionIcon = (action: string) => {
    switch (action) {
      case "Approve":
        return <CheckCircle className="h-4 w-4" />;
      case "Reject":
        return <XCircle className="h-4 w-4" />;
      case "Cancel":
        return <AlertCircle className="h-4 w-4" />;
      case "Complete":
        return <CheckCircle className="h-4 w-4" />;
      case "No-show":
        return <Clock3 className="h-4 w-4" />;
      case "Reschedule":
        return <CalendarRange className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const handleActionClick = (action: string) => {
    if (action === "Reschedule") {
      setShowReschedule(true);
      return;
    }
    const requiresMessage = ["Reject", "Cancel", "No-show"].includes(action);
    setPendingAction({ type: action, requiresMessage });
  };

  const getStatusIdByAction = (action: string): number | undefined => {
    const statusMap: Record<string, number | undefined> = {
      Approve: appointmentStatuses?.find((s) =>
        s.name.toLowerCase().includes("scheduled"),
      )?.id,
      Reject: appointmentStatuses?.find((s) =>
        s.name.toLowerCase().includes("rejected"),
      )?.id,
      Reschedule: appointmentStatuses?.find((s) =>
        s.name.toLowerCase().includes("rescheduled"),
      )?.id,
      Cancel: appointmentStatuses?.find((s) =>
        s.name.toLowerCase().includes("cancelled"),
      )?.id,
      Complete: appointmentStatuses?.find((s) =>
        s.name.toLowerCase().includes("completed"),
      )?.id,
      "No-show": appointmentStatuses?.find((s) =>
        s.name.toLowerCase().includes("no-show"),
      )?.id,
    };
    return statusMap[action];
  };

  const handleConfirmAction = async (message?: string): Promise<boolean> => {
    if (!pendingAction) return false;
    const statusId = getStatusIdByAction(pendingAction.type);
    if (!statusId) return false;

    const payload: any = { status: { id: statusId } };
    if (message) payload.adminNotes = message;

    try {
      await updateAppointment({ id: appointment.id!, data: payload });
      setPendingAction(null);
      return true;
    } catch {
      return false;
    }
  };

  const isCompleted = appointment.status?.name === "Completed";
  const needsSignificantNote = isCompleted && !appointment.hasSignificantNote;

  const handleRescheduleConfirm = async (
    newDate: string,
    newTimeSlotId: number,
  ) => {
    try {
      await updateAppointment({
        id: appointment.id!,
        data: {
          whenDate: newDate,
          timeSlot: { id: newTimeSlotId },
        } as any,
      });
      setShowReschedule(false);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-6 space-y-8 duration-700">
      {needsSignificantNote && (
        <div
          className={cn(
            "animate-in zoom-in-95 flex flex-col items-center",
            "justify-between gap-4 rounded-[28px] border border-primary/20",
            "bg-primary/10 p-6 shadow-xl backdrop-blur-xl duration-500",
            "sm:flex-row",
          )}
        >
          <div className="flex items-center gap-4">
            <div className="rounded-2xl border border-primary/30 bg-primary/20 p-3">
              <StickyNote className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-tight text-foreground">
                Record Significant Note
              </h3>
              <p className="text-xs font-medium text-muted-foreground">
                This completed appointment requires a significant note for the
                student's records.
              </p>
            </div>
          </div>
          <Button
            onClick={() =>
              navigate(
                `/admin/student-records/${appointment.iirId}?addNote=true&appointmentId=${appointment.id}`,
              )
            }
            className={cn(
              "h-11 rounded-xl bg-primary px-6 font-bold text-white",
              "shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]",
              "hover:bg-primary/90",
            )}
          >
            Add Note Now
          </Button>
        </div>
      )}

      {/* Top Row: Identity & Information (Modern Glass Style) */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Identity Card */}
        <Card
          className={cn(
            "bg-glass-bg/40 group relative overflow-hidden",
            "border-glass-border shadow-xl backdrop-blur-2xl lg:col-span-1",
          )}
        >
          <CardContent className="relative z-10 flex flex-col items-center space-y-5 p-8 text-center">
            <Avatar className="relative z-10 h-24 w-24 border-2 border-glass-border shadow-lg">
              <AvatarImage
                src={appointment.user?.profilePicture}
                className="object-cover"
              />
              <AvatarFallback className="bg-muted/50 text-3xl font-bold uppercase text-foreground/80">
                {initials}
              </AvatarFallback>
            </Avatar>

            <div className="space-y-1">
              <h2 className="text-xl font-bold leading-tight tracking-tight text-foreground/90">
                {fullName}
              </h2>
              <p className="text-xs font-medium italic text-muted-foreground">
                {appointment.user?.email}
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "group/btn w-full gap-2 rounded-xl border-primary/20",
                  "bg-primary/5 font-bold text-primary shadow-sm transition-all",
                  "duration-300 hover:bg-primary hover:text-white",
                )}
                onClick={() =>
                  navigate(`/admin/student-records/${appointment.iirId}`)
                }
              >
                <User className="h-3.5 w-3.5" />
                Access Record
              </Button>
              {appointment.studentCorUrl && (
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "group/btn w-full gap-2 rounded-xl border-primary/20",
                    "bg-primary/5 font-bold text-primary shadow-sm transition-all",
                    "duration-300 hover:bg-primary hover:text-white",
                  )}
                  onClick={() => setShowCorPreview(true)}
                >
                  <FileText className="h-3.5 w-3.5" />
                  Certificate of Registration
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* General Information Card */}
        <Card className="bg-glass-bg/40 border-glass-border shadow-xl backdrop-blur-2xl lg:col-span-2">
          <CardHeader
            className={cn(
              "border-glass-border/30 flex flex-row items-center",
              "justify-between border-b bg-muted/10 px-8 py-7 pb-6",
            )}
          >
            <CardTitle className="flex items-center gap-3 text-xl font-bold tracking-tight">
              <ShieldUser className="h-6 w-6 text-primary" />
              Personal Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 pb-10">
            <div className="grid h-full grid-cols-1 content-center gap-10 sm:grid-cols-2">
              <div className="group space-y-2 transition-all duration-300">
                <p
                  className={cn(
                    "text-[10px] font-bold uppercase tracking-wider",
                    "text-muted-foreground/60 transition-colors",
                    "group-hover:text-primary",
                  )}
                >
                  Student Number
                </p>
                <div
                  className={cn(
                    "border-glass-border/20 flex items-center gap-3 rounded-2xl",
                    "border bg-muted/20 p-4 shadow-inner transition-all",
                    "group-hover:border-primary/20",
                  )}
                >
                  <Fingerprint className="h-5 w-5 text-primary/60" />
                  <p className="text-lg font-bold tracking-wide text-foreground/80">
                    {appointment?.studentNumber || "N/A"}
                  </p>
                </div>
              </div>

              <div className="group space-y-2 transition-all duration-300">
                <p
                  className={cn(
                    "text-[10px] font-bold uppercase tracking-wider",
                    "text-muted-foreground/60 transition-colors",
                    "group-hover:text-primary",
                  )}
                >
                  Contact Channel
                </p>
                <div
                  className={cn(
                    "border-glass-border/20 flex items-center gap-3 rounded-2xl",
                    "border bg-muted/20 p-4 shadow-inner transition-all",
                    "group-hover:border-primary/20",
                  )}
                >
                  <Building2 className="h-5 w-5 text-primary/60" />
                  <p className="truncate text-lg font-bold text-foreground/80">
                    {appointment.user?.email || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content Row: Session Details & Actions */}
      <div className="grid grid-cols-1 gap-8 pb-12 lg:grid-cols-12">
        {/* Left: Session Details (Col-span 8) */}
        <div className="space-y-8 lg:col-span-8">
          <Card
            className={cn(
              "bg-glass-bg/40 h-full overflow-hidden border-glass-border",
              "shadow-xl backdrop-blur-2xl",
            )}
          >
            <CardHeader
              className={cn(
                "border-glass-border/30 flex flex-row items-center",
                "justify-between border-b bg-muted/10 px-8 py-7",
              )}
            >
              <div className="flex items-center gap-4">
                <div className="rounded-2xl border border-primary/20 bg-primary/10 p-3">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold tracking-tight">
                    Session Context
                  </CardTitle>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    ID: {appointment.id?.substring(0, 8)}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {appointment?.status && (
                  <Badge
                    className={cn(
                      "rounded-full border px-4 py-1.5 text-[10px] font-bold tracking-wide shadow-sm",
                      STATUS_COLORS[appointment.status.colorKey || "info"],
                    )}
                  >
                    {appointment.status.name}
                  </Badge>
                )}
                <Badge
                  variant="secondary"
                  className={cn(
                    "rounded-full border border-primary/20 bg-primary/10 px-4",
                    "py-1.5 text-[10px] font-bold tracking-wide text-primary",
                  )}
                >
                  {appointment.appointmentCategory.name}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-12 p-10">
              {/* Reason for Visit Header/Snippet */}
              {/* Reason for Appointment Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl border border-primary/20 bg-primary/10 p-2">
                    <MessageSquare className="h-4 w-4 text-primary" />
                  </div>
                  <h3 className="text-sm font-bold tracking-tight text-foreground/80">
                    Reason for Appointment
                  </h3>
                </div>

                <div
                  className={cn(
                    "border-glass-border/20 rounded-[24px] border bg-muted/20 p-8",
                    "shadow-inner backdrop-blur-sm",
                  )}
                >
                  <p className="text-base font-medium italic leading-relaxed text-foreground/80">
                    "{appointment.reason || "No specific reason provided."}"
                  </p>
                </div>
              </div>

              {/* Schedule Info Grid */}
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                <div
                  className={cn(
                    "border-glass-border/30 hover:bg-glass-bg/40 group relative",
                    "space-y-3 rounded-3xl border bg-muted/10 p-6 shadow-sm",
                    "transition-all duration-300 hover:border-primary/30",
                  )}
                >
                  <div className="flex items-center gap-3 text-muted-foreground/70">
                    <CalendarDays className="h-5 w-5 text-primary/60" />
                    <span className="text-[10px] font-bold tracking-wide text-muted-foreground/60">
                      Scheduled Date
                    </span>
                  </div>
                  <p className="text-2xl font-bold tracking-tight text-foreground/90">
                    {formatDate(appointment.whenDate)}
                  </p>
                </div>
                <div
                  className={cn(
                    "border-glass-border/30 hover:bg-glass-bg/40 group relative",
                    "space-y-3 rounded-3xl border bg-muted/10 p-6 shadow-sm",
                    "transition-all duration-300 hover:border-primary/30",
                  )}
                >
                  <div className="flex items-center gap-3 text-muted-foreground/70">
                    <Clock className="h-5 w-5 text-primary/60" />
                    <span className="text-[10px] font-bold tracking-wide text-muted-foreground/60">
                      Time Slot
                    </span>
                  </div>
                  <p className="text-2xl font-bold tracking-tight text-foreground/90">
                    {format12HourTime(appointment.timeSlot.time)}
                  </p>
                </div>
              </div>

              {appointment.adminNotes && (
                <div className="border-glass-border/20 border-t pt-10">
                  <div className="mb-6 flex items-center gap-3">
                    <div className="rounded-xl border border-orange-500/20 bg-orange-500/10 p-2">
                      <ShieldUser className="h-5 w-5 text-orange-500" />
                    </div>
                    <h3 className="text-[11px] font-bold tracking-wide text-orange-500">
                      Counselor Remarks
                    </h3>
                  </div>
                  <div
                    className={cn(
                      "rounded-3xl border border-orange-500/10 bg-orange-500/[0.03]",
                      "p-8 shadow-inner backdrop-blur-sm",
                    )}
                  >
                    <p className="text-base italic leading-relaxed text-foreground/80">
                      {appointment.adminNotes}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right: Actions & Timeline (Col-span 4) */}
        <div className="space-y-8 lg:col-span-4">
          <Card className="bg-glass-bg/40 overflow-hidden border-glass-border shadow-xl backdrop-blur-2xl">
            <CardHeader className="border-glass-border/30 border-b bg-muted/10 px-8 py-6">
              <CardTitle className="flex items-center gap-3 text-lg font-bold tracking-tight">
                <ShieldUser className="h-5 w-5 text-primary" />
                Administrative Controls
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              {allowedActions.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {allowedActions.map((action) => (
                    <Button
                      key={action}
                      onClick={() => handleActionClick(action)}
                      className={cn(
                        actionColor(action),
                        "group/action h-14 w-full items-center justify-between rounded-2xl border border-white/10 px-6 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl",
                      )}
                    >
                      <div className="flex items-center gap-4">
                        {actionIcon(action)}
                        <span className="text-[11px] font-bold tracking-wide">
                          {action}
                        </span>
                      </div>
                      <ArrowLeft
                        className={cn(
                          "h-4 w-4 -translate-x-2 rotate-180 opacity-0 transition-all",
                          "duration-300 group-hover/action:translate-x-0",
                          "group-hover/action:opacity-100",
                        )}
                      />
                    </Button>
                  ))}
                </div>
              ) : (
                <div
                  className={cn(
                    "border-glass-border/20 space-y-4 rounded-3xl border",
                    "border-dashed bg-muted/10 py-12 text-center",
                  )}
                >
                  <div className="mx-auto w-fit rounded-full border border-primary/20 bg-primary/10 p-4">
                    <CheckCircle className="h-8 w-8 text-primary/60" />
                  </div>
                  <p className="text-xs font-bold italic tracking-wide text-muted-foreground/60">
                    All set! No pending tasks.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-glass-bg/40 overflow-hidden border-glass-border shadow-xl backdrop-blur-2xl">
            <CardHeader className="border-glass-border/30 border-b bg-muted/20 px-8 py-6">
              <CardTitle
                className={cn(
                  "flex items-center gap-2 text-[10px] font-bold tracking-wider",
                  "text-muted-foreground",
                )}
              >
                <Clock3 className="h-3.5 w-3.5" />
                Audit Trail
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8 p-8">
              <div className="group flex items-start gap-5">
                <div className="relative mt-1">
                  <div
                    className={cn(
                      "relative z-10 h-4 w-4 shrink-0 rounded-full border-2",
                      "border-primary bg-background shadow-sm",
                    )}
                  />
                  <div
                    className={cn(
                      "bg-glass-border/30 absolute left-1/2 top-4 h-10 w-0.5",
                      "-translate-x-1/2 group-last:hidden",
                    )}
                  />
                </div>
                <div className="space-y-1.5">
                  <p className="text-[11px] font-bold leading-none tracking-wide text-foreground/80">
                    Request Initialized
                  </p>
                  <p
                    className={cn(
                      "border-glass-border/10 w-fit rounded-full border bg-muted/30",
                      "px-2 py-0.5 text-[10px] font-bold text-muted-foreground/60",
                    )}
                  >
                    {formatDate(appointment.createdAt || "")}
                  </p>
                </div>
              </div>
              {appointment.updatedAt &&
                appointment.updatedAt !== appointment.createdAt && (
                  <div className="group flex items-start gap-5">
                    <div className="h-4 w-4 shrink-0 rounded-full border-2 border-blue-500 bg-background shadow-sm" />
                    <div className="space-y-1.5">
                      <p className="text-[11px] font-bold leading-none tracking-wide text-foreground/80">
                        System Activity Recorded
                      </p>
                      <p
                        className={cn(
                          "border-glass-border/10 w-fit rounded-full border bg-muted/30",
                          "px-2 py-0.5 text-[10px] font-bold text-muted-foreground/60",
                        )}
                      >
                        {formatDate(appointment.updatedAt)}
                      </p>
                    </div>
                  </div>
                )}
            </CardContent>
          </Card>
        </div>
      </div>

      <ActionConfirmModal
        isOpen={!!pendingAction}
        onClose={() => setPendingAction(null)}
        onConfirm={handleConfirmAction}
        action={pendingAction?.type || ""}
        requiresMessage={pendingAction?.requiresMessage || false}
      />

      {showReschedule && (
        <RescheduleModal
          isOpen={showReschedule}
          onClose={() => setShowReschedule(false)}
          onConfirm={handleRescheduleConfirm}
          currentDate={appointment.whenDate}
          currentTimeSlotId={appointment.timeSlot.id}
        />
      )}

      {/* COR Preview Modal */}
      <CORPreviewDialog
        isOpen={showCorPreview}
        onClose={() => setShowCorPreview(false)}
        fileUrl={appointment.studentCorUrl}
        studentName={fullName}
      />
    </div>
  );
}
