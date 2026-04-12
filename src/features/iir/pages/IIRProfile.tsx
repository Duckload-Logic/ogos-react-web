import { useEffect, useState } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import { Spinner } from "@/components/shared";
import { useIIRProfile, useUserIIR, useIIRDownload } from "@/features/iir/hooks";
import { useMe } from "@/features/users/hooks/useMe";
import { TabId } from "../constants";
import { asText } from "../utils";
import { Trash, Edit, User, Printer, Loader2 } from "lucide-react";
import { BioCard, InfoContent, InfoNavigation } from "../components/profile";
import Layout, { usePageMetadata } from "@/components/layout/Layout";

const ICON_SIZE = 20;

export default function IIRProfile() {
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

  const { downloadPDF, isDownloading } = useIIRDownload();
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

  const isAdmin = me?.role.name.toLowerCase() === "admin";
  const isCounselor = me?.role.name.toLowerCase() === "counselor";
  const showSignificantNotes = isAdmin || isCounselor;

  usePageMetadata({
    title: isAdmin || isCounselor ? "Individual Inventory Record" : "My IIR Profile",
    description: isAdmin || isCounselor
      ? "Comprehensive student record review for guidance purposes"
      : "Manage your personal guidance information and student record",
    badgeText: isAdmin || isCounselor ? "Admin Audit" : "Student Profile",
    badgeIcon: <User size={16} />,
    isLoading,
    headerActions: (
      <div className="flex items-center gap-2">
        <button
          onClick={() => finalIirId && downloadPDF(finalIirId)}
          disabled={isDownloading || !finalIirId}
          className="flex items-center justify-center h-10 w-10 p-0 hover:bg-emerald-500/10 disabled:opacity-50 disabled:hover:bg-transparent transition-colors rounded-xl border border-emerald-500/20 group"
          title="Download PDF"
        >
          {isDownloading ? (
            <Loader2 size={ICON_SIZE} className="text-emerald-500 animate-spin" />
          ) : (
            <Printer
              size={ICON_SIZE}
              className="text-emerald-500 group-hover:scale-110 transition-transform"
            />
          )}
        </button>

        {isAdmin ? (
          <button className="flex items-center justify-center h-10 w-10 p-0 hover:bg-red-500/10 transition-colors rounded-xl border border-red-500/20 group">
            <Trash
              size={ICON_SIZE}
              className="text-red-500 group-hover:scale-110 transition-transform"
            />
          </button>
        ) : (
          <button className="flex items-center justify-center h-10 w-10 p-0 hover:bg-primary/10 transition-colors rounded-xl border border-primary/20 group">
            <Edit
              size={ICON_SIZE}
              className="text-primary group-hover:scale-110 transition-transform"
            />
          </button>
        )}
      </div>
    ),
  });

  // Handle final state where no ID can be resolved
  if (!finalIirId) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-border bg-card">
        <h2 className="text-xl font-semibold mb-2">No IIR Record Found</h2>
        <p className="text-muted-foreground mb-6">
          You haven't filled out your Individual Inventory Record form yet.
          Please submit the form to access your profile.
        </p>
        <Link
          to="/student/iir/form"
          className="bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
        >
          Go to IIR Form
        </Link>
      </div>
    );
  }

  // Handle errors from the profile query
  if (isError || !studentData)
    return (
      <div className="rounded-2xl border border-border bg-card p-6 text-sm text-card-foreground">
        {asText(error) || "Error loading student profile data."}
      </div>
    );


  return (
    <>
      <div className="flex flex-col gap-8 w-full mt-4">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 h-full">
          <BioCard data={studentData?.student} />

          <div className="xl:col-span-3 h-full flex flex-col gap-0">
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
    </>
  );
}
