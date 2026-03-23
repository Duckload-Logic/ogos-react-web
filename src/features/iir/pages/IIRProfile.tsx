import { useState } from "react";
import { useParams } from "react-router-dom";
import { LoadingSpinner } from "@/components/shared";
import { useIIRProfile, useUserIIR } from "@/features/iir/hooks";
import { useMe } from "@/features/users/hooks/useMe";
import { TabId } from "../constants";
import { asText } from "../utils";
import { Trash, Edit } from "lucide-react";
import { BioCard, InfoContent, InfoNavigation } from "../components/profile";
import BackwardNavigation from "@/components/layout/BackwardNavigation";
import Layout from "@/components/layout/Layout";

const ICON_SIZE = 20;

export default function IIRProfile() {
  const { studentId, iirId: paramIirId } = useParams();
  const targetRecordId = studentId || paramIirId;

  const { data: me, isLoading: isMeLoading } = useMe({});

  const {
    data: sessionIir,
    isLoading: isSessionIirLoading,
    isFetched: isSessionIirFetched
  } = useUserIIR(!targetRecordId && me?.id ? me.id : "");

  const finalIirId = targetRecordId || sessionIir?.id;

  const {
    data: studentData,
    isLoading: isProfileLoading,
    isError,
    error,
  } = useIIRProfile(finalIirId || "");

  const [activeTab, setActiveTab] = useState<TabId>("personal");

  const isWaitingForMe = !targetRecordId && isMeLoading;
  const isWaitingForIirId = !targetRecordId && !!me?.id && (isSessionIirLoading || !isSessionIirFetched);
  const isWaitingForProfile = !!finalIirId && isProfileLoading;

  const isLoading = isWaitingForMe || isWaitingForIirId || isWaitingForProfile;

  const isAdminOrSuper = me?.roles?.some((r) => {
    const role = r.toLowerCase().replace(/\s+/g, "");
    return role === "admin" || role === "superadmin";
  });

  // Handle final state where no ID can be resolved
  if (!finalIirId) {
    return (
      <Layout title={isAdminOrSuper ? "Individual Inventory Record" : "My IIR Profile"} isLoading={isLoading}>
        <div className="rounded-2xl border border-border bg-card p-6 text-sm text-card-foreground">
          No record ID discovered. Please ensure you have submitted your form.
        </div>
      </Layout>
    );
  }

  // Handle errors from the profile query
  if (isError || !studentData)
    return (
      <Layout title={isAdminOrSuper ? "Individual Inventory Record" : "My IIR Profile"} isLoading={isLoading}>
        <div className="rounded-2xl border border-border bg-card p-6 text-sm text-card-foreground">
          {asText(error) || "Error loading student profile data."}
        </div>
      </Layout>
    );

  const showSignificantNotes = isAdminOrSuper;

  return (
    <Layout title={isAdminOrSuper ? "Individual Inventory Record" : "My IIR Profile"} isLoading={isLoading}>
      <div className="flex flex-col gap-8 w-full">
        <div className="flex items-center justify-between">
          {isAdminOrSuper && (
            <>
              <BackwardNavigation />
            </>
          )}
          {isAdminOrSuper ? (
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
    </Layout>
  );
}
