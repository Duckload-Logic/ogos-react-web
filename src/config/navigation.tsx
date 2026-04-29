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
  Calendar,
  FileText,
  Timer,
  TrendingUp,
  User,
  GraduationCap,
  Activity,
  Code,
  BookOpen,
  Settings,
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
      admin: [
        {
          label: "Dashboard",
          href: "/admin",
          icon: <Home size={ICON_SIZE} />,
        },
        {
          label: "Student Records",
          href: "/admin/student-records",
          icon: <Users size={ICON_SIZE} />,
        },
        {
          label: "Appointments",
          href: "/admin/appointments",
          icon: <Calendar size={ICON_SIZE} />,
        },
        {
          label: "Admission Slips",
          href: "/admin/slips",
          icon: <FileText size={ICON_SIZE} />,
        },
        {
          label: "Reports & Analytics",
          href: "/admin/analytics",
          icon: <TrendingUp size={ICON_SIZE} />,
        },
        {
          label: "Records Lifecycle",
          href: "/admin/lifecycle",
          icon: <GraduationCap size={ICON_SIZE} />,
        },
      ],
  },
  {
    label: "Audit Logs",
    href: "/superadmin/audit-logs",
    icon: <ClipboardList size={ICON_SIZE} />,
  },
  {
    superadmin: [
      {
        label: "System Dashboard",
        href: "/superadmin",
        icon: <Home size={ICON_SIZE} />,
      },
      {
        label: "M2M Clients",
        href: "/superadmin/m2m-management",
        icon: <Server size={ICON_SIZE} />,
      },
      {
        label: "User Accounts",
        href: "/superadmin/users",
        icon: <Users size={ICON_SIZE} />,
      },
      {
        label: "System Analytics",
        href: "/superadmin/analytics",
        icon: <TrendingUp size={ICON_SIZE} />,
      },
      {
        label: "Audit Logs",
        href: "/superadmin/audit-logs",
        icon: <FileText size={ICON_SIZE} />,
      },
      {
        label: "Security Events",
        href: "/superadmin/security-logs",
        icon: <Shield size={ICON_SIZE} />,
      },
      {
        label: "Health Monitor",
        href: "/superadmin/system-logs",
        icon: <Activity size={ICON_SIZE} />,
      },
    ],
  },
  {
    developer: [
      {
        label: "Developer Hub",
        href: "/developer",
        icon: <Code size={ICON_SIZE} />,
      },
      {
        label: "API Documentation",
        href: "/developer/docs",
        icon: <BookOpen size={ICON_SIZE} />,
      },
      {
        label: "Dev Guides",
        href: "/developer/guides",
        icon: <FileText size={ICON_SIZE} />,
      },
    ],
  },
];
