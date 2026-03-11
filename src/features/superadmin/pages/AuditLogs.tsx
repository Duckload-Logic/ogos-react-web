import { ClipboardList } from "lucide-react";
import LogsTable from "../components/LogsTable";
import { useAuditLogs } from "../hooks";

const AUDIT_ACTIONS = [
  "USER_CREATED",
  "USER_UPDATED",
  "USER_DELETED",
  "ROLE_CHANGED",
  "APPOINTMENT_CREATED",
  "APPOINTMENT_UPDATED",
  "SLIP_CREATED",
  "SLIP_STATUS_UPDATED",
  "STUDENT_RECORD_CREATED",
  "STUDENT_RECORD_UPDATED",
];

export default function AuditLogs() {
  return (
    <LogsTable
      title="Audit Logs"
      icon={<ClipboardList className="h-5 w-5" />}
      description="Track data changes, user modifications, and administrative operations"
      useLogsHook={useAuditLogs}
      actionOptions={AUDIT_ACTIONS}
    />
  );
}
