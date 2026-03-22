import { useState } from "react";
import { useMe } from "@/features/users/hooks/useMe";
import { useParams, useLocation } from "react-router-dom";
import { unhashId } from "@/lib/hash";
import { useUserIIR } from "../../hooks";
import SignificantNotes from "@/features/notes/components/SignificantNotes";
import EmptyState from "./EmptyState";

export default function SignificantNotesView({ data }: { data: any }) {
  const [toasts, setToasts] = useState<string[]>([]);
  const { data: me } = useMe({});
  const location = useLocation();
  const { iirId: hashedId } = useParams();
  const { data: iir } = useUserIIR(!hashedId && me?.id ? me.id : "");

  // Determine which resolved ID to use
  const resolvedId =
    location.state?.student?.iirId ||
    (hashedId ? unhashId(decodeURIComponent(hashedId)) : undefined) ||
    iir?.id;

  // Check if user has authorized role
  const userRole = me?.roles?.[0]?.toLowerCase();
  const isAuthorized = userRole === "admin" || userRole === "counselor";

  // Toast handler
  const addToast = (message: string) => {
    setToasts((prev) => [...prev, message]);
    setTimeout(() => {
      setToasts((prev) => prev.slice(1));
    }, 3000);
  };

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
      <SignificantNotes iirId={resolvedId} onToast={addToast} />

      {/* Toast notifications */}
      {toasts.length > 0 && (
        <div className="fixed top-6 right-6 z-[99999] flex flex-col gap-3">
          {toasts.map((toast, index) => (
            <div
              key={index}
              className="bg-card border border-border rounded-lg shadow-lg p-4 text-sm animate-in slide-in-from-right"
            >
              {toast}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
