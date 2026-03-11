import { ReactNode } from "react";

type Role = "student" | "admin";

type PortalShellProps = {
  role: Role;
  children: ReactNode;
};

export default function PortalShell({
  children,
}: PortalShellProps) {
  return <>{children}</>;
}