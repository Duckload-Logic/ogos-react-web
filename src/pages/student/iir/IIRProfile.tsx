import { useEffect, useState } from "react";
import { useParams, Link, useNavigate, useSearchParams } from "react-router-dom";
import { Spinner } from "@/components/shared";
import {
  useIIRProfile,
  useUserIIR,
  useIIRDownload,
} from "@/features/iir/hooks";
import { useMe } from "@/features/users/hooks/useMe";
import type { TabId } from "@/features/iir/constants";
import { asText } from "@/features/iir/utils";
import { Trash, Edit, User, Printer, Loader2 } from "lucide-react";
import { BioCard, InfoContent, InfoNavigation } from "@/features/iir/components/profile";
import Layout from "@/components/layout/Layout";
import { usePageMetadata } from "@/context";
import { cn } from "@/lib/utils";
import {
  ResponsiveModal,
  ResponsiveModalContent,
  ResponsiveModalHeader,
  ResponsiveModalTitle,
} from "@/components/ui/responsive-modal";
import { Download } from "lucide-react";

const ICON_SIZE = 20;

export default function IIRProfile() {
  const navigate = useNavigate();
  const { studentId, iirId: paramIirId } = useParams();
  const targetRecordId = studentId || paramIirId;

  const { data: me, isLoading: isMeLoading } = useMe({});

  const {
    data: sessionIir,
    isLoading: isSessionIirLoading,
    isFetched: isSessionIirFetched,
  } = useUserIIR(targetRecordId || me?.id || undefined);

  const finalIirId = targetRecordId || sessionIir?.id;

  const {
    data: studentData,
    isLoading: isProfileLoading,
    isError,
    error,
  } = useIIRProfile(finalIirId || "");

  const { generatePreview, downloadFromPreview, clearPreview, pdfUrl, isDownloading } = useIIRDownload();
  const [searchParams] = useSearchParams();

  const [activeTab, setActiveTab] = useState<TabId>("personal");

  // Switch to significantNotes tab if prompted by URL
  useEffect(() => {
    if (searchParams.get("addNote") === "true") {
      setActiveTab("significantNotes");
    }
  }, [searchParams]);

  const isWaitingForMe = !targetRecordId && isMeLoading;
  const isWaitingForIirId =
    !targetRecordId &&
    !!me?.id &&
    (isSessionIirLoading || !isSessionIirFetched);
  const isWaitingForProfile = !!finalIirId && isProfileLoading;

  const isLoading = isWaitingForMe || isWaitingForIirId || isWaitingForProfile;

  const isAdmin = me?.roles?.some(r => r.name.toLowerCase() === "admin") || false;
  const showSignificantNotes = isAdmin;

  usePageMetadata({
    title: isAdmin ? "Individual Inventory Record" : "My IIR Profile",
    description: isAdmin
      ? "Comprehensive student record review for guidance purposes"
      : "Manage your personal guidance information and student record",
    badgeText: isAdmin ? "Admin Audit" : "Student Profile",
    badgeIcon: <User size={16} />,
    isLoading,
    headerActions: (
      <div className="flex items-center gap-2">
        <button
          onClick={() => finalIirId && generatePreview(finalIirId)}
          disabled={isDownloading || !finalIirId}
          className={cn(
            "group flex h-10 w-10 items-center justify-center rounded-xl",
            "border border-emerald-500/20 p-0 transition-colors",
            "hover:bg-emerald-500/10 disabled:opacity-50",
            "disabled:hover:bg-transparent",
          )}
          title="Download PDF"
        >
          {isDownloading ? (
            <Loader2
              size={ICON_SIZE}
              className="animate-spin text-emerald-500"
            />
          ) : (
            <Printer
              size={ICON_SIZE}
              className={cn(
                "text-emerald-500 transition-transform",
                "group-hover:scale-110",
              )}
            />
          )}
        </button>

        {isAdmin ? (
          <button
            className={cn(
              "group flex h-10 w-10 items-center justify-center rounded-xl",
              "border border-red-500/20 p-0 transition-colors",
              "hover:bg-red-500/10",
            )}
          >
            <Trash
              size={ICON_SIZE}
              className="text-red-500 transition-transform group-hover:scale-110"
            />
          </button>
        ) : (
          <button
            onClick={() =>
              finalIirId && navigate(`/student/iir/form?edit=true&iirId=${finalIirId}`)
            }
            className={cn(
              "group flex h-10 w-10 items-center justify-center rounded-xl",
              "border border-primary/20 p-0 transition-colors",
              "hover:bg-primary/10",
            )}
            title="Edit IIR profile"
          >
            <Edit
              size={ICON_SIZE}
              className={cn(
                "text-primary transition-transform",
                "group-hover:scale-110",
              )}
            />
          </button>
        )}
      </div>
    ),
  });

  if (isLoading || isMeLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Spinner
          size="lg"
          message="Loading record..."
        />
      </div>
    );
  }

  // Handle final state where no ID can be resolved (after loading)
  if (!finalIirId && isSessionIirFetched) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center rounded-2xl border",
          "border-border bg-card p-12 text-center",
        )}
      >
        <h2 className="mb-2 text-xl font-semibold">No IIR Record Found</h2>
        <p className="mb-6 text-muted-foreground">
          You haven't filled out your Individual Inventory Record form yet.
          Please submit the form to access your profile.
        </p>
        <Link
          to="/student/iir/form"
          className={cn(
            "rounded-lg bg-primary px-6 py-2.5 font-semibold",
            "text-primary-foreground transition-colors hover:bg-primary/90",
          )}
        >
          Go to IIR Form
        </Link>
      </div>
    );
  }

  // Handle errors from the profile query
  if (isError || !studentData)
    return (
      <div
        className={cn(
          "rounded-2xl border border-border bg-card p-6",
          "text-sm text-card-foreground",
        )}
      >
        {asText(error) || "Error loading student profile data."}
      </div>
    );

  return (
    <>
      <div className="mt-4 flex w-full flex-col gap-8">
        <div className="grid h-full grid-cols-1 gap-4 xl:grid-cols-4">
          <BioCard data={studentData?.student} />

          <div className="flex h-full flex-col gap-0 xl:col-span-3">
            <InfoNavigation
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              showSignificantNotes={showSignificantNotes}
            />
            <InfoContent
              activeTab={activeTab}
              studentData={studentData}
              showSignificantNotes={showSignificantNotes}
              iirId={finalIirId}
            />
          </div>
        </div>
      </div>

      <ResponsiveModal
        open={!!pdfUrl}
        onOpenChange={(open) => !open && clearPreview()}
      >
        <ResponsiveModalContent className="flex h-[90vh] max-h-[90vh] flex-col p-0 sm:max-w-4xl">
          <ResponsiveModalHeader className="px-4 py-3 sm:px-6">
            <div className="flex items-center justify-between">
              <ResponsiveModalTitle>IIR PDF Preview</ResponsiveModalTitle>
              <button
                onClick={downloadFromPreview}
                className={cn(
                  "flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2",
                  "text-sm font-semibold text-white transition-colors hover:bg-emerald-600",
                )}
              >
                <Download size={16} />
                Download PDF
              </button>
            </div>
          </ResponsiveModalHeader>
          <div className="flex-1 overflow-hidden bg-muted/20">
            {pdfUrl && (
              <iframe
                src={`${pdfUrl}#toolbar=0`}
                className="h-full w-full rounded-b-lg border-0"
                title="PDF Preview"
              />
            )}
          </div>
        </ResponsiveModalContent>
      </ResponsiveModal>
    </>
  );
}
