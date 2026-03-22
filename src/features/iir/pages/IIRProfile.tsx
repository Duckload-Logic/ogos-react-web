import { useState } from "react";
import { unhashId } from "@/lib/hash";
import { Link, useLocation, useParams } from "react-router-dom";
import { LoadingSpinner } from "@/components/shared";
import { useIIRProfile, useUserIIR } from "@/features/iir/hooks";
import { useMe } from "@/features/users/hooks/useMe";
import { TabId } from "../constants";
import { asText } from "../utils";
import { CircleChevronLeft, Edit, Trash } from "lucide-react";
import { BioCard, InfoContent, InfoNavigation } from "../components/profile";
import BackwardNavigation from "@/components/layout/BackwardNavigation";

const ICON_SIZE = 20;

export default function IIRProfile() {
  const location = useLocation();
  const { data: me } = useMe({});
  const isAdmin = me?.roles?.[0]?.toLowerCase() === "admin";
  const { data: iir } = useUserIIR(me?.id || "");

  // Determine which resolved ID to use
  const iirId = iir?.id

  // Only fetch student profile if we have a valid ID
  const {
    data: studentData,
    isLoading,
    isError,
    error,
  } = useIIRProfile(iirId || "");

  const [activeTab, setActiveTab] = useState<TabId>("personal");

  // Early return: Check for missing student ID first
  if (!iirId) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6 text-sm text-card-foreground">
        No student ID found.
      </div>
    );
  }

  // Show loading state
  if (isLoading) return <LoadingSpinner />;

  // Show error state
  if (isError || !studentData)
    return (
      <div className="rounded-2xl border border-border bg-card p-6 text-sm text-card-foreground">
        {asText(error) || "Error loading student profile."}
      </div>
    );

  const showSignificantNotes = isAdmin

  return (
    <div className="flex flex-col gap-8 w-full">
      <div className="flex items-center justify-between">
        {isAdmin && (<>
          <BackwardNavigation />
        </>)}
        {isAdmin ? (
          <button className="flex items-center gap-1 hover:bg-red-500/30 aspect-square transition-colors rounded-full duration-300">
            <Trash size={ICON_SIZE} className="text-red-500" />
          </button>
        ) : (
          <button className="flex items-center gap-1 hover:bg-muted-foreground/30 aspect-square transition-colors rounded-full duration-300">
            <Edit size={ICON_SIZE} className="text-muted-foreground" />
          </button>
        )}
      </div>

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
          />
        </div>
      </div>
    </div>
  );
}
