import { Server } from "lucide-react";
import LogsTable from "../components/LogsTable";
import { useSystemLogs } from "../hooks";

const SYSTEM_ACTIONS = [
  "API_KEY_CREATED",
  "API_KEY_REVOKED",
  "SETTING_CHANGED",
];

export default function SystemLogs() {
  return (
    <LogsTable
      title="System Logs"
      icon={<Server className="h-5 w-5" />}
      description="Track system-level events such as API key operations and settings changes"
      useLogsHook={useSystemLogs}
      actionOptions={SYSTEM_ACTIONS}
    />
  );
}
