import React from "react";
import {
  Home,
  Key,
  Shield,
  Server,
  ClipboardList,
  Mail,
  Fingerprint,
  Users,
  BarChart,
  ShieldAlert,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}
const ICON_SIZE = "1.25rem";

export const NAV_CONFIG: NavItem[] = [
  {
    label: "Dashboard",
    href: "/superadmin",
    icon: <Home size={ICON_SIZE} />,
  },
  {
    label: "M2M Management",
    href: "/superadmin/m2m-management",
    icon: <Fingerprint size={ICON_SIZE} />,
  },
  {
    label: "User Management",
    href: "/superadmin/users",
    icon: <Users size={ICON_SIZE} />,
  },
  {
    label: "Access Whitelist",
    href: "/superadmin/whitelist",
    icon: <ShieldAlert size={ICON_SIZE} />,
  },
  {
    label: "Deep Analytics",
    href: "/superadmin/analytics",
    icon: <BarChart size={ICON_SIZE} />,
  },
  {
    label: "Security Logs",
    href: "/superadmin/security-logs",
    icon: <Shield size={ICON_SIZE} />,
  },
  {
    label: "System Logs",
    href: "/superadmin/system-logs",
    icon: <Server size={ICON_SIZE} />,
  },
  {
    label: "Audit Logs",
    href: "/superadmin/audit-logs",
    icon: <ClipboardList size={ICON_SIZE} />,
  },
];
