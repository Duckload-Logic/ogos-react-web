import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import BackwardNavigation from "./BackwardNavigation";

const PATH_LABELS: Record<string, string> = {
  home: "Dashboard",
  appointments: "Appointments",
  "admission-slips": "Admission Slips",
  "student-records": "Student Records",
  reports: "Reports",
  analytics: "Analytics",
  slips: "Admission Slips",
  "api-management": "API Management",
  "security-logs": "Security Logs",
  "system-logs": "System Logs",
  "audit-logs": "Audit Logs",
  schedule: "Schedule",
  logs: "Logs",
  submit: "Submit",
  form: "IIR Form",
  iir: "IIR Profile",
  profile: "Profile",
};

export default function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  // Don't show breadcrumbs on main dashboard pages
  const isMainPage =
    pathnames.length <= 1 ||
    (pathnames.length === 2 && pathnames[1] === "home");
  if (isMainPage) return null;

  const getLabel = (path: string) => {
    // Check if it's a UUID/ID (heuristic: contains numbers or is long)
    if (
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        path,
      ) ||
      /^\d+$/.test(path)
    ) {
      return "Details";
    }
    return (
      PATH_LABELS[path] ||
      path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, " ")
    );
  };

  const parentPath = "/" + pathnames.slice(0, -1).join("/");

  return (
    <nav
      aria-label="Breadcrumb"
      className="w-full mb-4 flex flex-wrap items-center gap-2 sm:gap-3"
    >
      <BackwardNavigation to={parentPath} className="" />

      <div className="h-4 w-[1px] bg-border mx-1 hidden sm:block" />

      <ol className="flex items-center gap-2 overflow-hidden text-sm font-medium">
        <li className="flex items-center">
          <Link
            to={
              pathnames[0] === "admin"
                ? "/admin"
                : pathnames[0] === "superadmin"
                  ? "/superadmin"
                  : "/student"
            }
            className="flex items-center text-muted-foreground hover:text-primary transition-colors"
          >
            <Home size={14} className="mr-1.5" />
            <span className="hidden xs:inline">Home</span>
          </Link>
        </li>

        {pathnames.map((value, index) => {
          // Skip first segment if it's just the role prefix
          if (index === 0 && ["admin", "student", "superadmin"].includes(value))
            return null;

          const last = index === pathnames.length - 1;
          const to = `/${pathnames.slice(0, index + 1).join("/")}`;

          return (
            <React.Fragment key={to}>
              <li className="flex items-center text-muted-foreground/50">
                <ChevronRight size={14} strokeWidth={3} />
              </li>
              <li className="flex items-center">
                {last ? (
                  <span className="text-foreground font-semibold truncate max-w-[150px] sm:max-w-[250px]">
                    {getLabel(value)}
                  </span>
                ) : (
                  <Link
                    to={to}
                    className="text-muted-foreground hover:text-primary transition-colors truncate max-w-[100px] sm:max-w-[150px]"
                  >
                    {getLabel(value)}
                  </Link>
                )}
              </li>
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
