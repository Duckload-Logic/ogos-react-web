import { useState } from "react";
import { useMe } from "@/features/users/hooks/useMe";
import { useParams, useLocation } from "react-router-dom";
import { unhashId } from "@/lib/hash";
import { useUserIIR } from "../../hooks";
import { useToast } from "@/context";
import SignificantNotes from "@/features/notes/components/SignificantNotes";
import EmptyState from "./EmptyState";

export default function NotesView({ data }: { data: any }) {
  const { data: me } = useMe({});
  const location = useLocation();
  const { iirId: hashedId } = useParams();
  const { data: iir } = useUserIIR(!hashedId && me?.id ? me.id : "");
  const { triggerToast } = useToast();

  // Determine which resolved ID to use
  const resolvedId =
    location.state?.student?.iirId ||
    (hashedId ? unhashId(decodeURIComponent(hashedId)) : undefined) ||
    iir?.id;

  // Check if user has authorized role
  const userRole = me?.roles?.[0]?.toLowerCase();
  const isAuthorized = userRole === "admin" || userRole === "counselor";

  // Don't render for unauthorized users
  if (!isAuthorized) {
    return null;
  }

  // Don't render if no IIR ID
  if (!resolvedId) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <EmptyState label="No student ID found" />
      </div>
    );
  }

  return (
    <>
      <SignificantNotes iirId={resolvedId} />
    </>
  );
}
