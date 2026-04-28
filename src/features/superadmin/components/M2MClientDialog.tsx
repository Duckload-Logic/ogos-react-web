import { useState } from "react";
import { X, Copy, Check, Shield, Key, RefreshCw, Activity, CalendarClock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { M2MClient } from "../types";

interface M2MClientDialogProps {
  client: M2MClient | null;
  isOpen: boolean;
  onClose: () => void;
  onRotateSecret: () => void;
}

export default function M2MClientDialog({ client, isOpen, onClose, onRotateSecret }: M2MClientDialogProps) {
  const [copiedId, setCopiedId] = useState(false);

  if (!isOpen || !client) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString("en-US", {
      month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit",
    });
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] transition-opacity" onClick={onClose} />
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white/90 dark:bg-neutral-900/95 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-[20px] shadow-2xl z-[110] overflow-hidden flex flex-col">
        
        <div className="flex items-center justify-between p-6 border-b border-white/20 dark:border-white/10 bg-white/50 dark:bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl border border-primary/20">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold">{client.clientName}</h2>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                <Activity className="h-3 w-3" /> M2M Integration
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex justify-between items-start">
            <div className="space-y-1.5">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Status</p>
              <div className="flex gap-2">
                <Badge className={client.isActive ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" : "border-red-500/20 bg-red-500/10 text-red-700 dark:text-red-400"}>
                  {client.isActive ? "Active" : "Revoked"}
                </Badge>
                {client.isVerified && (
                  <Badge className="border-blue-500/20 bg-blue-500/10 text-blue-700 dark:text-blue-400">Verified</Badge>
                )}
              </div>
            </div>
            <div className="space-y-1.5 text-right">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Last Used</p>
              <p className="text-sm flex items-center justify-end gap-1.5 text-foreground">
                <CalendarClock className="h-3.5 w-3.5 text-muted-foreground" />
                {client.lastUsedAt ? formatDate(client.lastUsedAt) : "Never"}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Description</p>
            <p className="text-sm text-foreground bg-white/50 dark:bg-white/5 p-3 rounded-xl border border-white/20 dark:border-white/10">
              {client.clientDescription || "No description provided."}
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Permitted Scopes</p>
            <div className="flex flex-wrap gap-2">
              {client.scopes && client.scopes.length > 0 ? client.scopes.map(scope => (
                <Badge key={scope} variant="outline" className="bg-white/50 dark:bg-white/5 font-mono text-[10px]">
                  {scope}
                </Badge>
              )) : (
                <span className="text-sm text-muted-foreground italic">admin:full</span>
              )}
            </div>
          </div>

          <div className="p-5 bg-white/40 dark:bg-black/20 border border-white/20 dark:border-white/10 rounded-xl space-y-4">
            <h3 className="text-sm font-bold flex items-center gap-2 border-b border-white/20 dark:border-white/10 pb-3">
              <Key className="h-4 w-4" /> API Credentials
            </h3>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground">Client ID</label>
              <div className="flex items-center gap-2">
                <code className="flex-1 p-2.5 bg-white/60 dark:bg-white/5 border border-white/30 dark:border-white/10 rounded-xl text-sm font-mono truncate select-all">
                  {client.clientId}
                </code>
                <Button variant="outline" size="icon" className="rounded-xl h-10 w-10" onClick={() => handleCopy(client.clientId)}>
                  {copiedId ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <label className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground">Client Secret</label>
              <div className="flex items-center gap-2">
                <code className="flex-1 p-2.5 bg-white/60 dark:bg-white/5 border border-white/30 dark:border-white/10 rounded-xl text-sm font-mono text-muted-foreground select-none">
                  ****************************************
                </code>
                <Button variant="outline" onClick={onRotateSecret} className="w-[110px] rounded-xl h-10" disabled={!client.isActive}>
                  <RefreshCw className="h-4 w-4 mr-2" />
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