import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useAppointment,
  useStatuses,
  useUpdateAppointment
} from "../../hooks";
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
import { format12HourTime } from "../../utils";
import { formatDate } from "@/features/schedules/utils/formatters";
import { usePageMetadata } from "@/components/layout/Layout";
import ActionConfirmModal from "../../components/ConfirmModal";
import RescheduleModal from "../../components/RescheduleModal";
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

  const fullName = appointment ? [
    appointment.user?.firstName,
    appointment.user?.middleName ? `${appointment.user.middleName[0]}.` : "",
    appointment.user?.lastName,
  ].filter(Boolean).join(" ") : "";

  const initials = appointment?.user ?
    `${appointment.user.firstName[0]}${appointment.user.lastName[0]}` : "??";

  usePageMetadata({
    title: "Appointment Details",
    description: `Managing session for ${fullName || "Student"}`,
    badgeText: "Admin Management",
    badgeIcon: <Calendar className="h-4 w-4" />,
    isLoading: isLoading && !appointment,
    headerActions: null
  });

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <p className="text-destructive font-medium">Error loading appointment</p>
        <Button onClick={() => navigate("/admin/appointments")} variant="outline">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to List
        </Button>
      </div>
    );
  }

  if (!appointment && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <p className="text-muted-foreground">Appointment not found</p>
        <Button onClick={() => navigate("/admin/appointments")} variant="outline">
          <ArrowLeft className="w-4 h-4 mr-2" />
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
      case "Approve": return "bg-green-600 hover:bg-green-700 text-white";
      case "Reject": return "bg-red-600 hover:bg-red-700 text-white";
      case "Cancel": return "bg-orange-600 hover:bg-orange-700 text-white";
      case "Complete": return "bg-blue-600 hover:bg-blue-700 text-white";
      case "No-show": return "bg-gray-600 hover:bg-gray-700 text-white";
      case "Reschedule": return "bg-purple-600 hover:bg-purple-700 text-white";
      default: return "bg-primary hover:bg-primary/90 text-primary-foreground";
    }
  };

  const actionIcon = (action: string) => {
    switch (action) {
      case "Approve": return <CheckCircle className="w-4 h-4" />;
      case "Reject": return <XCircle className="w-4 h-4" />;
      case "Cancel": return <AlertCircle className="w-4 h-4" />;
      case "Complete": return <CheckCircle className="w-4 h-4" />;
      case "No-show": return <Clock3 className="w-4 h-4" />;
      case "Reschedule": return <CalendarRange className="w-4 h-4" />;
      default: return null;
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
      Approve: appointmentStatuses?.find((s) => s.name.toLowerCase().includes("scheduled"))?.id,
      Reject: appointmentStatuses?.find((s) => s.name.toLowerCase().includes("rejected"))?.id,
      Reschedule: appointmentStatuses?.find((s) => s.name.toLowerCase().includes("rescheduled"))?.id,
      Cancel: appointmentStatuses?.find((s) => s.name.toLowerCase().includes("cancelled"))?.id,
      Complete: appointmentStatuses?.find((s) => s.name.toLowerCase().includes("completed"))?.id,
      "No-show": appointmentStatuses?.find((s) => s.name.toLowerCase().includes("no-show"))?.id,
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

  const handleRescheduleConfirm = async (newDate: string, newTimeSlotId: number) => {
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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
      {needsSignificantNote && (
        <div className="bg-primary/10 border border-primary/20 backdrop-blur-xl rounded-[28px] p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl animate-in zoom-in-95 duration-500">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/20 rounded-2xl border border-primary/30">
              <StickyNote className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-tight text-foreground">Record Significant Note</h3>
              <p className="text-xs text-muted-foreground font-medium">This completed appointment requires a significant note for the student's records.</p>
            </div>
          </div>
          <Button 
            onClick={() => navigate(`/admin/student-records/${appointment.iirId}?addNote=true&appointmentId=${appointment.id}`)}
            className="rounded-xl bg-primary hover:bg-primary/90 text-white font-bold px-6 h-11 shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]"
          >
            Add Note Now
          </Button>
        </div>
      )}

      {/* Top Row: Identity & Information (Modern Glass Style) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Identity Card */}
        <Card className="lg:col-span-1 border-glass-border bg-glass-bg/40 backdrop-blur-2xl shadow-xl relative overflow-hidden group">
          <CardContent className="p-8 flex flex-col items-center text-center space-y-5 relative z-10">
            <Avatar className="h-24 w-24 border-2 border-glass-border shadow-lg relative z-10">
              <AvatarImage src={appointment.user?.profilePicture} className="object-cover" />
              <AvatarFallback className="text-3xl font-bold bg-muted/50 text-foreground/80 uppercase">
                {initials}
              </AvatarFallback>
            </Avatar>

            <div className="space-y-1">
              <h2 className="text-xl font-bold tracking-tight text-foreground/90 leading-tight">
                {fullName}
              </h2>
              <p className="text-xs font-medium text-muted-foreground italic">
                {appointment.user?.email}
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="w-full rounded-xl border-primary/20 bg-primary/5 text-primary font-bold hover:bg-primary hover:text-white transition-all duration-300 gap-2 shadow-sm group/btn"
              onClick={() => navigate(`/admin/student-records/${appointment.iirId}`)}
            >
              <User className="w-3.5 h-3.5" />
              Access Record
            </Button>
          </CardContent>
        </Card>

        {/* General Information Card */}
        <Card className="lg:col-span-2 border-glass-border bg-glass-bg/40 backdrop-blur-2xl shadow-xl">
          <CardHeader className="border-b border-glass-border/30 pb-6 flex flex-row items-center justify-between bg-muted/10 px-8 py-7">
            <CardTitle className="text-xl font-bold tracking-tight flex items-center gap-3">
              <ShieldUser className="w-6 h-6 text-primary" />
              Personal Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 pb-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 content-center h-full">
              <div className="space-y-2 group transition-all duration-300">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60 transition-colors group-hover:text-primary">
                  Student Number
                </p>
                <div className="flex items-center gap-3 bg-muted/20 p-4 rounded-2xl border border-glass-border/20 shadow-inner group-hover:border-primary/20 transition-all">
                  <Fingerprint className="w-5 h-5 text-primary/60" />
                  <p className="text-lg font-bold text-foreground/80 tracking-wide">
                    {appointment?.studentNumber || "N/A"}
                  </p>
                </div>
              </div>

              <div className="space-y-2 group transition-all duration-300">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60 transition-colors group-hover:text-primary">
                  Contact Channel
                </p>
                <div className="flex items-center gap-3 bg-muted/20 p-4 rounded-2xl border border-glass-border/20 shadow-inner group-hover:border-primary/20 transition-all">
                  <Building2 className="w-5 h-5 text-primary/60" />
                  <p className="text-lg font-bold text-foreground/80 truncate">
                    {appointment.user?.email || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content Row: Session Details & Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-12">
        {/* Left: Session Details (Col-span 8) */}
        <div className="lg:col-span-8 space-y-8">
          <Card className="border-glass-border bg-glass-bg/40 backdrop-blur-2xl shadow-xl h-full overflow-hidden">
            <CardHeader className="border-b border-glass-border/30 bg-muted/10 px-8 py-7 flex flex-row items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold tracking-tight">Session Context</CardTitle>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">ID: {appointment.id?.substring(0, 8)}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {appointment?.status && (
                  <Badge className={cn("px-4 py-1.5 text-[10px] font-bold tracking-wide rounded-full border shadow-sm", STATUS_COLORS[appointment.status.colorKey || "info"])}>
                    {appointment.status.name}
                  </Badge>
                )}
                <Badge variant="secondary" className="rounded-full bg-primary/10 text-primary border border-primary/20 font-bold tracking-wide px-4 py-1.5 text-[10px]">
                  {appointment.appointmentCategory.name}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-10 space-y-12">
              {/* Reason for Visit Header/Snippet */}
              {/* Reason for Appointment Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-xl border border-primary/20">
                    <MessageSquare className="w-4 h-4 text-primary" />
                  </div>
                  <h3 className="text-sm font-bold text-foreground/80 tracking-tight">
                    Reason for Appointment
                  </h3>
                </div>

                <div className="p-8 rounded-[24px] bg-muted/20 border border-glass-border/20 shadow-inner backdrop-blur-sm">
                  <p className="text-base leading-relaxed text-foreground/80 italic font-medium">
                    "{appointment.reason || "No specific reason provided."}"
                  </p>
                </div>
              </div>

              {/* Schedule Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="relative p-6 rounded-3xl border border-glass-border/30 bg-muted/10 space-y-3 group transition-all duration-300 hover:bg-glass-bg/40 hover:border-primary/30 shadow-sm">
                  <div className="flex items-center gap-3 text-muted-foreground/70">
                    <CalendarDays className="w-5 h-5 text-primary/60" />
                    <span className="text-[10px] font-bold text-muted-foreground/60 tracking-wide">Scheduled Date</span>
                  </div>
                  <p className="text-2xl font-bold text-foreground/90 tracking-tight">{formatDate(appointment.whenDate)}</p>
                </div>
                <div className="relative p-6 rounded-3xl border border-glass-border/30 bg-muted/10 space-y-3 group transition-all duration-300 hover:bg-glass-bg/40 hover:border-primary/30 shadow-sm">
                  <div className="flex items-center gap-3 text-muted-foreground/70">
                    <Clock className="w-5 h-5 text-primary/60" />
                    <span className="text-[10px] font-bold text-muted-foreground/60 tracking-wide">Time Slot</span>
                  </div>
                  <p className="text-2xl font-bold text-foreground/90 tracking-tight">{format12HourTime(appointment.timeSlot.time)}</p>
                </div>
              </div>

              {appointment.adminNotes && (
                <div className="pt-10 border-t border-glass-border/20">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-orange-500/10 rounded-xl border border-orange-500/20">
                      <ShieldUser className="w-5 h-5 text-orange-500" />
                    </div>
                    <h3 className="text-[11px] font-bold text-orange-500 tracking-wide">
                      Counselor Remarks
                    </h3>
                  </div>
                  <div className="p-8 bg-orange-500/[0.03] border border-orange-500/10 rounded-3xl shadow-inner backdrop-blur-sm">
                    <p className="text-base leading-relaxed text-foreground/80 italic">
                      {appointment.adminNotes}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right: Actions & Timeline (Col-span 4) */}
        <div className="lg:col-span-4 space-y-8">
          <Card className="border-glass-border bg-glass-bg/40 backdrop-blur-2xl shadow-xl overflow-hidden">
            <CardHeader className="border-b border-glass-border/30 bg-muted/10 px-8 py-6">
              <CardTitle className="text-lg font-bold tracking-tight flex items-center gap-3">
                <ShieldUser className="w-5 h-5 text-primary" />
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
                        "w-full justify-between items-center group/action h-14 px-6 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] border border-white/10"
                      )}
                    >
                      <div className="flex items-center gap-4">
                        {actionIcon(action)}
                        <span className="font-bold tracking-wide text-[11px]">{action}</span>
                      </div>
                      <ArrowLeft className="w-4 h-4 rotate-180 opacity-0 group-hover/action:opacity-100 transition-all duration-300 -translate-x-2 group-hover/action:translate-x-0" />
                    </Button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 space-y-4 bg-muted/10 rounded-3xl border border-glass-border/20 border-dashed">
                  <div className="p-4 bg-primary/10 rounded-full w-fit mx-auto border border-primary/20">
                    <CheckCircle className="w-8 h-8 text-primary/60" />
                  </div>
                  <p className="text-xs font-bold tracking-wide text-muted-foreground/60 italic">
                    All set! No pending tasks.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-glass-border bg-glass-bg/40 backdrop-blur-2xl shadow-xl overflow-hidden">
            <CardHeader className="py-6 border-b border-glass-border/30 bg-muted/20 px-8">
              <CardTitle className="text-[10px] font-bold tracking-wider text-muted-foreground flex items-center gap-2">
                <Clock3 className="w-3.5 h-3.5" />
                Audit Trail
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              <div className="flex items-start gap-5 group">
                <div className="relative mt-1">
                  <div className="h-4 w-4 rounded-full border-2 border-primary bg-background shrink-0 shadow-sm relative z-10" />
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 w-0.5 h-10 bg-glass-border/30 group-last:hidden" />
                </div>
                <div className="space-y-1.5">
                  <p className="text-[11px] font-bold tracking-wide leading-none text-foreground/80">Request Initialized</p>
                  <p className="text-[10px] font-bold text-muted-foreground/60 bg-muted/30 px-2 py-0.5 rounded-full border border-glass-border/10 w-fit">
                    {formatDate(appointment.createdAt || "")}
                  </p>
                </div>
              </div>
              {appointment.updatedAt && appointment.updatedAt !== appointment.createdAt && (
                <div className="flex items-start gap-5 group">
                  <div className="h-4 w-4 rounded-full border-2 border-blue-500 bg-background shrink-0 shadow-sm" />
                  <div className="space-y-1.5">
                    <p className="text-[11px] font-bold tracking-wide leading-none text-foreground/80">System Activity Recorded</p>
                    <p className="text-[10px] font-bold text-muted-foreground/60 bg-muted/30 px-2 py-0.5 rounded-full border border-glass-border/10 w-fit">
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
    </div>
  );
}
