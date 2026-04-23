import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useGetSlipById,
  useUpdateSlipStatus,
  useGetSlipAttachments,
} from "@/features/slips/hooks";
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
import { AttachmentsGrid } from "@/features/slips/components/AttachmentsGrid";
import { usePageMetadata } from "@/context";
import { cn } from "@/lib/utils";

type ActionType = "approve" | "reject" | "revision" | null;

export default function SlipDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: slip, isLoading, isError, refetch } = useGetSlipById(id || "");
  const { data: attachments } = useGetSlipAttachments(id || "");
  const { mutate: updateSlipStatus, isPending: isUpdatingStatus } =
    useUpdateSlipStatus();

  const [actionType, setActionType] = useState<ActionType>(null);
  const [reason, setReason] = useState("");
  const [isConfirming, setIsConfirming] = useState(false);

  const fullName = slip
    ? [
        slip.user?.firstName,
        slip.user?.middleName ? `${slip.user.middleName[0]}.` : "",
        slip.user?.lastName,
      ]
        .filter(Boolean)
        .join(" ")
    : "";

  const initials = slip?.user
    ? `${slip.user.firstName[0]}${slip.user.lastName[0]}`
    : "??";

  usePageMetadata({
    title: "Excuse Slip Details",
    description: `Reviewing submission for ${fullName || "Student"}`,
    badgeText: "Admin Management",
    badgeIcon: <FileText className="h-4 w-4" />,
    isLoading: isLoading && !slip,
    headerActions: null,
  });

  if (isError) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center space-y-4">
        <p className="font-medium text-destructive">
          Error loading excuse slip
        </p>
        <Button
          onClick={() => navigate("/admin/slips")}
          variant="outline"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to List
        </Button>
      </div>
    );
  }

  if (!slip && !isLoading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center space-y-4">
        <p className="text-muted-foreground">Excuse slip not found</p>
        <Button
          onClick={() => navigate("/admin/slips")}
          variant="outline"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
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

    const status =
      actionType === "approve"
        ? "Approved"
        : actionType === "reject"
          ? "Rejected"
          : "For Revision";

    if (
      (actionType === "reject" || actionType === "revision") &&
      !reason.trim()
    ) {
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
      },
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
    <div className="animate-in fade-in slide-in-from-bottom-6 space-y-8 duration-700">
      {/* Top Row: Identity & Information */}
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
                src={slip.user?.profilePicture}
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
                {slip.user?.email}
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              className={cn(
                "group/btn w-full gap-2 rounded-xl border-primary/20",
                "bg-primary/5 font-bold text-primary shadow-sm transition-all",
                "duration-300 hover:bg-primary hover:text-white",
              )}
              onClick={() => navigate(`/admin/student-records/${slip.iirId}`)}
            >
              <User className="h-3.5 w-3.5" />
              Access Record
            </Button>
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
              Submission Profile
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
                    {slip.studentNumber || "N/A"}
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
                  Student Email
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
                    {slip.user?.email || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content Row: Submission Details & Actions */}
      <div className="grid grid-cols-1 gap-8 pb-12 lg:grid-cols-12">
        {/* Left: Submission Details (Col-span 8) */}
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
                    Submission Context
                  </CardTitle>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    ID: {slip.id?.substring(0, 8)}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {slip.status && (
                  <Badge
                    className={cn(
                      "rounded-full border px-4 py-1.5 text-[10px] font-bold tracking-wide shadow-sm",
                      STATUS_COLORS[slip.status.colorKey || "info"],
                    )}
                  >
                    {slip.status.name}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-12 p-10">
              {/* Reason for Absence Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl border border-primary/20 bg-primary/10 p-2">
                    <MessageSquare className="h-4 w-4 text-primary" />
                  </div>
                  <h3 className="text-sm font-bold tracking-tight text-foreground/80">
                    Reason for Absence
                  </h3>
                </div>

                <div
                  className={cn(
                    "border-glass-border/20 rounded-[24px] border bg-muted/20 p-8",
                    "shadow-inner backdrop-blur-sm",
                  )}
                >
                  <p className="text-base font-medium italic leading-relaxed text-foreground/80">
                    "{slip.reason || "No specific reason provided."}"
                  </p>
                </div>
              </div>

              {/* Date Info Grid */}
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                <div
                  className={cn(
                    "border-glass-border/30 hover:bg-glass-bg/40 group relative",
                    "space-y-3 rounded-3xl border bg-muted/10 p-6 shadow-sm",
                    "transition-all duration-300 hover:border-primary/30",
                  )}
                >
                  <div className="flex items-center gap-3 text-muted-foreground/70">
                    <Calendar className="h-5 w-5 text-primary/60" />
                    <span className="text-[10px] font-bold tracking-wide text-muted-foreground/60">
                      Date of Absence
                    </span>
                  </div>
                  <p className="text-lg font-bold tracking-tight text-foreground/90">
                    {formatDateShort(slip.dateOfAbsence)}
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
                      Date Needed
                    </span>
                  </div>
                  <p className="text-lg font-bold tracking-tight text-foreground/90">
                    {formatDateShort(slip.dateNeeded)}
                  </p>
                </div>
              </div>

              {/* Attachments Section */}
              <div className="space-y-6 pt-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl border border-primary/20 bg-primary/10 p-2">
                    <ShieldUser className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-sm font-bold tracking-tight text-foreground/80">
                    Supporting Documents
                  </h3>
                </div>
                <div className="border-glass-border/20 rounded-3xl border bg-muted/10 p-6 shadow-inner">
                  {attachments && attachments.length > 0 ? (
                    <AttachmentsGrid
                      slipId={slip.id || ""}
                      files={attachments}
                    />
                  ) : (
                    <p className="py-8 text-center text-sm italic text-muted-foreground">
                      No attachments provided
                    </p>
                  )}
                </div>
              </div>

              {slip.adminNotes && (
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
                      {slip.adminNotes}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right: Actions & History (Col-span 4) */}
        <div className="space-y-8 lg:col-span-4">
          <Card className="bg-glass-bg/40 overflow-hidden border-glass-border shadow-xl backdrop-blur-2xl">
            <CardHeader className="border-glass-border/30 border-b bg-muted/10 px-8 py-6">
              <CardTitle className="flex items-center gap-3 text-lg font-bold tracking-tight">
                <ShieldUser className="h-5 w-5 text-primary" />
                Administrative Controls
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              {isPending ? (
                <div className="flex flex-col gap-4">
                  <Button
                    onClick={() => handleActionClick("approve")}
                    disabled={isUpdatingStatus}
                    className={cn(
                      "group/action h-14 w-full items-center justify-between",
                      "rounded-2xl border border-white/10 bg-green-600 px-6",
                      "text-white shadow-lg transition-all duration-300",
                      "hover:scale-[1.02] hover:bg-green-700 hover:shadow-xl",
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <CheckCircle2 className="h-4 w-4" />
                      <span className="text-[11px] font-bold tracking-wide">
                        Approve Slip
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

                  <Button
                    onClick={() => handleActionClick("revision")}
                    disabled={isUpdatingStatus}
                    className={cn(
                      "group/action h-14 w-full items-center justify-between",
                      "rounded-2xl border border-white/10 bg-blue-600 px-6",
                      "text-white shadow-lg transition-all duration-300",
                      "hover:scale-[1.02] hover:bg-blue-700 hover:shadow-xl",
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <RefreshCw className="h-4 w-4" />
                      <span className="text-[11px] font-bold tracking-wide">
                        Request Revision
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

                  <Button
                    onClick={() => handleActionClick("reject")}
                    disabled={isUpdatingStatus}
                    className={cn(
                      "group/action h-14 w-full items-center justify-between",
                      "rounded-2xl border border-white/10 bg-red-600 px-6 text-white",
                      "shadow-lg transition-all duration-300 hover:scale-[1.02]",
                      "hover:bg-red-700 hover:shadow-xl",
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <Ban className="h-4 w-4" />
                      <span className="text-[11px] font-bold tracking-wide">
                        Reject Slip
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
                </div>
              ) : (
                <div
                  className={cn(
                    "border-glass-border/20 space-y-4 rounded-3xl border",
                    "border-dashed bg-muted/10 py-12 text-center",
                  )}
                >
                  <div className="mx-auto w-fit rounded-full border border-primary/20 bg-primary/10 p-4">
                    <CheckCircle2 className="h-8 w-8 text-primary/60" />
                  </div>
                  <p className="text-xs font-bold italic tracking-wide text-muted-foreground/60">
                    Processed as {slip.status?.name}
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
                    Submission Received
                  </p>
                  <p
                    className={cn(
                      "border-glass-border/10 w-fit rounded-full border bg-muted/30",
                      "px-2 py-0.5 text-[10px] font-bold text-muted-foreground/60",
                    )}
                  >
                    {formatDateShort(slip.createdAt)}
                  </p>
                </div>
              </div>
              {slip.updatedAt && slip.updatedAt !== slip.createdAt && (
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
        <AlertDialogContent
          className={cn(
            "animate-in zoom-in-95 fade-in rounded-2xl border",
            "border-white/10 bg-background/90 shadow-2xl backdrop-blur-2xl",
            "duration-200",
          )}
        >
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold">
              {actionType === "approve"
                ? "Approve Excuse Slip"
                : actionType === "reject"
                  ? "Reject Excuse Slip"
                  : "Send for Revision"}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm font-medium leading-relaxed text-muted-foreground">
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
                className={cn(
                  "min-h-36 rounded-2xl border-white/10 bg-muted/30 italic",
                  "placeholder:text-muted-foreground/40 focus:ring-primary/20",
                )}
              />
            </div>
          )}

          <div className="flex justify-end gap-3 border-t border-white/5 pt-6">
            <AlertDialogCancel className="rounded-xl border-white/10 px-6 font-bold transition-all hover:bg-white/5">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleActionConfirm}
              disabled={isUpdatingStatus}
              className={cn(
                "rounded-xl px-8 font-bold shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl",
                actionType === "reject"
                  ? "bg-red-600 hover:bg-red-700"
                  : actionType === "revision"
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-green-600 hover:bg-green-700",
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
