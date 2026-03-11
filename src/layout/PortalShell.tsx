import { ReactNode, useEffect, useState } from "react";
import TermsAndConditionsModal from "@/components/common/TermsAndConditionsModal";

type Role = "student" | "admin";

type PortalShellProps = {
  role: Role;
  children: ReactNode;
};

export default function PortalShell({
  role,
  children,
}: PortalShellProps) {
  const [termsOpen, setTermsOpen] = useState(false);

  useEffect(() => {
    const termsKey = `terms-accepted-${role}`;
    const hasAccepted = localStorage.getItem(termsKey) === "true";

    if (!hasAccepted) {
      setTermsOpen(true);
    }
  }, [role]);

  const handleAcceptTerms = () => {
    const termsKey = `terms-accepted-${role}`;
    localStorage.setItem(termsKey, "true");
    setTermsOpen(false);
  };

  return (
    <>
      <TermsAndConditionsModal
        open={termsOpen}
        role={role}
        onAccept={handleAcceptTerms}
      />

      {children}
    </>
  );
}
