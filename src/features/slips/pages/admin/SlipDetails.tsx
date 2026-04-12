import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useGetSlipById,
  useUpdateSlipStatus,
  useGetSlipAttachments,
} from "../../hooks";
import {
  CheckCircle2,
  Ban,
  RefreshCw,
  Clock,
  ArrowLeft,
  FileText,
  Calendar,
  User,
  Info,
  ShieldUser,
  Fingerprint,
  Building2,
  MessageSquare,
  Clock3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { STATUS_COLORS } from "@/config/constants";
import { AttachmentsGrid } from "../../components/AttachmentsGrid";
import { usePageMetadata } from "@/components/layout/Layout";
import { cn } from "@/lib/utils";

type ActionType = "approve" | "reject" | "revision" | null;

export default function SlipDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: slip, isLoading, isError, refetch } = useGetSlipById(id || "");
  const { data: attachments } = useGetSlipAttachments(id || "");
  const { mutate: updateSlipStatus, isPending: isUpdatingStatus } = useUpdateSlipStatus();

  const [actionType, setActionType] = useState<ActionType>(null);
  const [reason, setReason] = useState("");
  const [isConfirming, setIsConfirming] = useState(false);

  const fullName = slip ? [
    slip.user?.firstName,
    slip.user?.middleName ? `${slip.user.middleName[0]}.` : "",
    slip.user?.lastName,
  ].filter(Boolean).join(" ") : "";

  const initials = slip?.user ?
    `${slip.user.firstName[0]}${slip.user.lastName[0]}` : "??";

  usePageMetadata({
    title: "Excuse Slip Details",
    description: `Reviewing submission for ${fullName || "Student"}`,
    badgeText: "Admin Management",
    badgeIcon: <FileText className="h-4 w-4" />,
    isLoading: isLoading && !slip,
    headerActions: null
  });

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <p className="text-destructive font-medium">Error loading excuse slip</p>
        <Button onClick={() => navigate("/admin/slips")} variant="outline">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to List
        </Button>
      </div>
    );
  }

  if (!slip && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <p className="text-muted-foreground">Excuse slip not found</p>
        <Button onClick={() => navigate("/admin/slips")} variant="outline">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to List
        </Button>
      </div>
    );
  }

  if (!slip) return null;

  const handleActionClick = (type: ActionType) => {
    setActionType(type);
    setIsConfirming(true);
  };

  const handleActionConfirm = () => {
    if (!actionType || !slip.id) return;

    const status = actionType === "approve" ? "Approved" : actionType === "reject" ? "Rejected" : "For Revision";

    if ((actionType === "reject" || actionType === "revision") && !reason.trim()) {
      return; // Handled by UI validation in real scenario
    }

    updateSlipStatus(
      { id: slip.id, status, adminNotes: reason },
      {
        onSuccess: () => {
          refetch();
          setIsConfirming(false);
          setActionType(null);
          setReason("");
        },
      }
    );
  };

  const isPending =
    slip.status?.name?.toLowerCase() === "pending" ||
    slip.status?.name?.toLowerCase() === "for revision";

  const formatDateShort = (dateStr?: string) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
      {/* Top Row: Identity & Information */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Identity Card */}
        <Card className="lg:col-span-1 border-glass-border bg-glass-bg/40 backdrop-blur-2xl shadow-xl relative overflow-hidden group">
          <CardContent className="p-8 flex flex-col items-center text-center space-y-5 relative z-10">
            <Avatar className="h-24 w-24 border-2 border-glass-border shadow-lg relative z-10">
              <AvatarImage src={slip.user?.profilePicture} className="object-cover" />
              <AvatarFallback className="text-3xl font-bold bg-muted/50 text-foreground/80 uppercase">
                {initials}
              </AvatarFallback>
            </Avatar>

            <div className="space-y-1">
              <h2 className="text-xl font-bold tracking-tight text-foreground/90 leading-tight">
                {fullName}
              </h2>
              <p className="text-xs font-medium text-muted-foreground italic">
                {slip.user?.email}
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="w-full rounded-xl border-primary/20 bg-primary/5 text-primary font-bold hover:bg-primary hover:text-white transition-all duration-300 gap-2 shadow-sm group/btn"
              onClick={() => navigate(`/admin/student-records/${slip.iirId}`)}
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
              Submission Profile
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
                    {slip.studentNumber || "N/A"}
                  </p>
                </div>
              </div>
              <div className="space-y-2 group transition-all duration-300">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60 transition-colors group-hover:text-primary">
                  Student Email
                </p>
                <div className="flex items-center gap-3 bg-muted/20 p-4 rounded-2xl border border-glass-border/20 shadow-inner group-hover:border-primary/20 transition-all">
                  <Building2 className="w-5 h-5 text-primary/60" />
                  <p className="text-lg font-bold text-foreground/80 truncate">
                    {slip.user?.email || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content Row: Submission Details & Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-12">
        {/* Left: Submission Details (Col-span 8) */}
        <div className="lg:col-span-8 space-y-8">
          <Card className="border-glass-border bg-glass-bg/40 backdrop-blur-2xl shadow-xl h-full overflow-hidden">
            <CardHeader className="border-b border-glass-border/30 bg-muted/10 px-8 py-7 flex flex-row items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold tracking-tight">Submission Context</CardTitle>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">ID: {slip.id?.substring(0, 8)}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {slip.status && (
                  <Badge className={cn("px-4 py-1.5 text-[10px] font-bold tracking-wide rounded-full border shadow-sm", STATUS_COLORS[slip.status.colorKey || "info"])}>
                    {slip.status.name}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-10 space-y-12">
              {/* Reason for Absence Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-xl border border-primary/20">
                    <MessageSquare className="w-4 h-4 text-primary" />
                  </div>
                  <h3 className="text-sm font-bold text-foreground/80 tracking-tight">
                    Reason for Absence
                  </h3>
                </div>

                <div className="p-8 rounded-[24px] bg-muted/20 border border-glass-border/20 shadow-inner backdrop-blur-sm">
                  <p className="text-base leading-relaxed text-foreground/80 italic font-medium">
                    "{slip.reason || "No specific reason provided."}"
                  </p>
                </div>
              </div>

              {/* Date Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="relative p-6 rounded-3xl border border-glass-border/30 bg-muted/10 space-y-3 group transition-all duration-300 hover:bg-glass-bg/40 hover:border-primary/30 shadow-sm">
                  <div className="flex items-center gap-3 text-muted-foreground/70">
                    <Calendar className="w-5 h-5 text-primary/60" />
                    <span className="text-[10px] font-bold text-muted-foreground/60 tracking-wide">Date of Absence</span>
                  </div>
                  <p className="text-lg font-bold text-foreground/90 tracking-tight">{formatDateShort(slip.dateOfAbsence)}</p>
                </div>
                <div className="relative p-6 rounded-3xl border border-glass-border/30 bg-muted/10 space-y-3 group transition-all duration-300 hover:bg-glass-bg/40 hover:border-primary/30 shadow-sm">
                  <div className="flex items-center gap-3 text-muted-foreground/70">
                    <Clock className="w-5 h-5 text-primary/60" />
                    <span className="text-[10px] font-bold text-muted-foreground/60 tracking-wide">Date Needed</span>
                  </div>
                  <p className="text-lg font-bold text-foreground/90 tracking-tight">{formatDateShort(slip.dateNeeded)}</p>
                </div>
              </div>

              {/* Attachments Section */}
              <div className="space-y-6 pt-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-xl border border-primary/20">
                    <ShieldUser className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-sm font-bold text-foreground/80 tracking-tight">Supporting Documents</h3>
                </div>
                <div className="p-6 bg-muted/10 border border-glass-border/20 rounded-3xl shadow-inner">
                  {attachments && attachments.length > 0 ? (
                    <AttachmentsGrid slipId={slip.id || ""} files={attachments} />
                  ) : (
                    <p className="text-sm text-muted-foreground italic text-center py-8">No attachments provided</p>
                  )}
                </div>
              </div>

              {slip.adminNotes && (
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
                      {slip.adminNotes}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right: Actions & History (Col-span 4) */}
        <div className="lg:col-span-4 space-y-8">
          <Card className="border-glass-border bg-glass-bg/40 backdrop-blur-2xl shadow-xl overflow-hidden">
            <CardHeader className="border-b border-glass-border/30 bg-muted/10 px-8 py-6">
              <CardTitle className="text-lg font-bold tracking-tight flex items-center gap-3">
                <ShieldUser className="w-5 h-5 text-primary" />
                Administrative Controls
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              {isPending ? (
                <div className="flex flex-col gap-4">
                  <Button
                    onClick={() => handleActionClick("approve")}
                    disabled={isUpdatingStatus}
                    className="w-full bg-green-600 hover:bg-green-700 text-white justify-between items-center group/action h-14 px-6 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] border border-white/10"
                  >
                    <div className="flex items-center gap-4">
                      <CheckCircle2 className="w-4 h-4" />
                      <span className="font-bold tracking-wide text-[11px]">Approve Slip</span>
                    </div>
                    <ArrowLeft className="w-4 h-4 rotate-180 opacity-0 group-hover/action:opacity-100 transition-all duration-300 -translate-x-2 group-hover/action:translate-x-0" />
                  </Button>

                  <Button
                    onClick={() => handleActionClick("revision")}
                    disabled={isUpdatingStatus}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white justify-between items-center group/action h-14 px-6 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] border border-white/10"
                  >
                    <div className="flex items-center gap-4">
                      <RefreshCw className="w-4 h-4" />
                      <span className="font-bold tracking-wide text-[11px]">Request Revision</span>
                    </div>
                    <ArrowLeft className="w-4 h-4 rotate-180 opacity-0 group-hover/action:opacity-100 transition-all duration-300 -translate-x-2 group-hover/action:translate-x-0" />
                  </Button>

                  <Button
                    onClick={() => handleActionClick("reject")}
                    disabled={isUpdatingStatus}
                    className="w-full bg-red-600 hover:bg-red-700 text-white justify-between items-center group/action h-14 px-6 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] border border-white/10"
                  >
                    <div className="flex items-center gap-4">
                      <Ban className="w-4 h-4" />
                      <span className="font-bold tracking-wide text-[11px]">Reject Slip</span>
                    </div>
                    <ArrowLeft className="w-4 h-4 rotate-180 opacity-0 group-hover/action:opacity-100 transition-all duration-300 -translate-x-2 group-hover/action:translate-x-0" />
                  </Button>
                </div>
              ) : (
                <div className="text-center py-12 space-y-4 bg-muted/10 rounded-3xl border border-glass-border/20 border-dashed">
                  <div className="p-4 bg-primary/10 rounded-full w-fit mx-auto border border-primary/20">
                    <CheckCircle2 className="w-8 h-8 text-primary/60" />
                  </div>
                  <p className="text-xs font-bold tracking-wide text-muted-foreground/60 italic">
                    Processed as {slip.status?.name}
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
                  <p className="text-[11px] font-bold tracking-wide leading-none text-foreground/80">Submission Received</p>
                  <p className="text-[10px] font-bold text-muted-foreground/60 bg-muted/30 px-2 py-0.5 rounded-full border border-glass-border/10 w-fit">
                    {formatDateShort(slip.createdAt)}
                  </p>
                </div>
              </div>
              {slip.updatedAt && slip.updatedAt !== slip.createdAt && (
                <div className="flex items-start gap-5 group">
                  <div className="h-4 w-4 rounded-full border-2 border-blue-500 bg-background shrink-0 shadow-sm" />
                  <div className="space-y-1.5">
                    <p className="text-[11px] font-bold tracking-wide leading-none text-foreground/80">System Activity Recorded</p>
                    <p className="text-[10px] font-bold text-muted-foreground/60 bg-muted/30 px-2 py-0.5 rounded-full border border-glass-border/10 w-fit">
                      {formatDateShort(slip.updatedAt)}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <AlertDialog
        open={isConfirming}
        onOpenChange={(open) => {
          if (!open) {
            setActionType(null);
            setReason("");
          }
          setIsConfirming(open);
        }}
      >
        <AlertDialogContent className="bg-background/90 backdrop-blur-2xl border border-white/10 rounded-2xl animate-in zoom-in-95 fade-in duration-200 shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold">
              {actionType === "approve"
                ? "Approve Excuse Slip"
                : actionType === "reject"
                  ? "Reject Excuse Slip"
                  : "Send for Revision"}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm font-medium text-muted-foreground leading-relaxed">
              {actionType === "approve"
                ? "Are you sure you want to approve this excuse slip? Student will be notified."
                : `Please provide a detailed reason for this ${actionType === "reject" ? "rejection" : "revision"}.`}
            </AlertDialogDescription>
          </AlertDialogHeader>

          {(actionType === "reject" || actionType === "revision") && (
            <div className="py-6">
              <Textarea
                placeholder={
                  actionType === "reject"
                    ? "Reason for rejection..."
                    : "Revision notes for student..."
                }
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="min-h-36 bg-muted/30 border-white/10 rounded-2xl focus:ring-primary/20 placeholder:text-muted-foreground/40 italic"
              />
            </div>
          )}

          <div className="flex gap-3 justify-end pt-6 border-t border-white/5">
            <AlertDialogCancel className="rounded-xl border-white/10 hover:bg-white/5 font-bold transition-all px-6">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleActionConfirm}
              disabled={isUpdatingStatus}
              className={cn(
                "rounded-xl px-8 font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02]",
                actionType === "reject"
                  ? "bg-red-600 hover:bg-red-700"
                  : actionType === "revision"
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-green-600 hover:bg-green-700"
              )}
            >
              {actionType === "approve" ? "Confirm Approval" : "Submit Action"}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
