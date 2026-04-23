import { ClipboardList } from "lucide-react";
import LogsTable from "@/features/system-admin/components/LogsTable";
import { useAuditLogs } from "@/features/system-admin/hooks";

const AUDIT_ACTIONS = [
  "USER_CREATED",
  "USER_UPDATED",
  "USER_DELETED",
  "ROLE_CHANGED",
  "SLIP_CREATED",
  "SLIP_STATUS_UPDATED",
  "APPOINTMENT_CREATED",
  "APPOINTMENT_UPDATED",
  "STUDENT_RECORD_CREATED",
  "STUDENT_RECORD_UPDATED",
];

export default function AuditLogs() {
  return (
    <LogsTable
      title="Audit Logs"
      icon={<ClipboardList className="h-5 w-5" />}
      description="Review data changes and trace important actions across the system."
      useLogsHook={useAuditLogs}
      actionOptions={AUDIT_ACTIONS}
    />
  );
}