import { useState } from "react";
import {
  X,
  Copy,
  Check,
  Shield,
  Key,
  RefreshCw,
  Activity,
  CalendarClock,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { M2MClient } from "../types";

interface M2MClientDialogProps {
  client: M2MClient | null;
  isOpen: boolean;
  onClose: () => void;
  onRotateSecret: () => void;
}

export default function M2MClientDialog({
  client,
  isOpen,
  onClose,
  onRotateSecret,
}: M2MClientDialogProps) {
  const [copiedId, setCopiedId] = useState(false);

  if (!isOpen || !client) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      <div
        className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div className="fixed left-1/2 top-1/2 z-[110] flex w-full max-w-lg -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-[20px] border border-white/20 bg-white/90 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-neutral-900/95">
        <div className="flex items-center justify-between border-b border-white/20 bg-white/50 p-6 dark:border-white/10 dark:bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="rounded-xl border border-primary/20 bg-primary/10 p-2">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold">{client.clientName}</h2>
              <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                <Activity className="h-3 w-3" /> M2M Integration
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 transition-colors hover:bg-black/5 dark:hover:bg-white/10"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6 p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-1.5">
              <p className="text-[10px] font-semibold uppercase text-muted-foreground">
                Status
              </p>
              <div className="flex gap-2">
                <Badge
                  className={
                    client.isActive
                      ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                      : "border-red-500/20 bg-red-500/10 text-red-700 dark:text-red-400"
                  }
                >
                  {client.isActive ? "Active" : "Revoked"}
                </Badge>
                {client.isVerified && (
                  <Badge className="border-blue-500/20 bg-blue-500/10 text-blue-700 dark:text-blue-400">
                    Verified
                  </Badge>
                )}
              </div>
            </div>
            <div className="space-y-1.5 text-right">
              <p className="text-[10px] font-semibold uppercase text-muted-foreground">
                Last Used
              </p>
              <p className="flex items-center justify-end gap-1.5 text-sm text-foreground">
                <CalendarClock className="h-3.5 w-3.5 text-muted-foreground" />
                {client.lastUsedAt ? formatDate(client.lastUsedAt) : "Never"}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-[10px] font-semibold uppercase text-muted-foreground">
              Description
            </p>
            <p className="rounded-xl border border-white/20 bg-white/50 p-3 text-sm text-foreground dark:border-white/10 dark:bg-white/5">
              {client.clientDescription || "No description provided."}
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-[10px] font-semibold uppercase text-muted-foreground">
              Permitted Scopes
            </p>
            <div className="flex flex-wrap gap-2">
              {client.scopes && client.scopes.length > 0 ? (
                client.scopes.map((scope) => (
                  <Badge
                    key={scope}
                    variant="outline"
                    className="bg-white/50 font-mono text-[10px] dark:bg-white/5"
                  >
                    {scope}
                  </Badge>
                ))
              ) : (
                <span className="text-sm italic text-muted-foreground">
                  admin:full
                </span>
              )}
            </div>
          </div>

          <div className="space-y-4 rounded-xl border border-white/20 bg-white/40 p-5 dark:border-white/10 dark:bg-black/20">
            <h3 className="flex items-center gap-2 border-b border-white/20 pb-3 text-sm font-bold dark:border-white/10">
              <Key className="h-4 w-4" /> API Credentials
            </h3>

            <div className="space-y-2">
              <label className="text-[10px] font-medium uppercase text-muted-foreground">
                Client ID
              </label>
              <div className="flex items-center gap-2">
                <code className="flex-1 select-all truncate rounded-xl border border-white/30 bg-white/60 p-2.5 font-mono text-sm dark:border-white/10 dark:bg-white/5">
                  {client.clientId}
                </code>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 rounded-xl"
                  onClick={() => handleCopy(client.clientId)}
                >
                  {copiedId ? (
                    <Check className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <label className="text-[10px] font-medium uppercase text-muted-foreground">
                Client Secret
              </label>
              <div className="flex items-center gap-2">
                <code className="flex-1 select-none rounded-xl border border-white/30 bg-white/60 p-2.5 font-mono text-sm text-muted-foreground dark:border-white/10 dark:bg-white/5">
                  ****************************************
                </code>
                <Button
                  variant="outline"
                  onClick={onRotateSecret}
                  className="h-10 w-[110px] rounded-xl"
                  disabled={!client.isActive}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Rotate
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
