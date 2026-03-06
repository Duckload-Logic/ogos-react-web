import React from "react";
import {
  Home,
  Users,
  Calendar,
  FileText,
  BarChart3,
  Timer,
  TrendingUp,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const ICON_SIZE = 20;

export const roleMap: Record<number, string> = {
  1: "student",
  2: "admin",
  3: "frontdesk",
};

export const NAV_CONFIG: Record<string, NavItem[]>[] = [
  {
    admin: [
      {
        label: "Dashboard",
        href: "/admin/home",
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
        href: "/admin/admission-slips",
        icon: <FileText size={ICON_SIZE} />,
      },
      {
        label: "Reports",
        href: "/admin/reports",
        icon: <BarChart3 size={ICON_SIZE} />,
      },
      {
        label: "Analytics",
        href: "/admin/analytics",
        icon: <TrendingUp size={ICON_SIZE} />,
      },
    ],
  },
  {
    student: [
      {
        label: "Home",
        href: "/student/home",
        icon: <Home size={ICON_SIZE} />,
      },
      {
        label: "Appointments",
        href: "/student/appointments",
        icon: <Timer size={ICON_SIZE} />,
      },
      {
        label: "Admission Slips",
        href: "/student/slips",
        icon: <FileText size={ICON_SIZE} />,
      },
    ],
  },
];