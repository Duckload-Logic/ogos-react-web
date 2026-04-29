import { Shield } from "lucide-react";
import LogsTable from "../components/LogsTable";
import { useSecurityLogs } from "../hooks";

const SECURITY_ACTIONS = [
  "LOGIN_SUCCESS",
  "LOGIN_FAILED",
  "ACCESS_DENIED",
  "RATE_LIMIT_EXCEEDED",
  "INVALID_TOKEN",
  "API_KEY_INVALID",
  "LOGOUT",
  "TOKEN_REFRESHED",
  "API_KEY_USED",
];

export default function SecurityLogs() {
  return (
    <LogsTable
      title="Security Logs"
      icon={<Shield className="h-5 w-5" />}
      description="Monitor authentication, authorization, and access-related security events."
      useLogsHook={useSecurityLogs}
      actionOptions={SECURITY_ACTIONS}
      showIPAddress
    />
  );
}