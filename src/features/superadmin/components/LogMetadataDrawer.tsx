import { X, Server, Clock, Fingerprint, Activity } from "lucide-react";
import { LogEntry } from "../../activity-meta/services/logService";

interface LogMetadataDrawerProps {
  log: LogEntry | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function LogMetadataDrawer({ log, isOpen, onClose }: LogMetadataDrawerProps) {
  if (!isOpen || !log) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] transition-opacity" 
        onClick={onClose}
      />

      <div className={`fixed top-0 right-0 h-full w-full max-w-lg bg-background border-l border-border shadow-2xl z-[110] transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"} overflow-y-auto`}>
        
        <div className="flex items-center justify-between p-6 border-b border-border bg-muted/20">
          <div>
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Server className="h-5 w-5 text-primary" />
              Log Details
            </h2>
            <p className="text-xs text-muted-foreground mt-1 font-mono">{log.id}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-muted transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1"><Activity className="h-3 w-3"/> Action</p>
              <p className="font-medium">{log.action}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1"><Clock className="h-3 w-3"/> Timestamp</p>
              <p className="text-sm">{new Date(log.createdAt).toLocaleString()}</p>
            </div>
            <div className="space-y-1 col-span-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1"><Fingerprint className="h-3 w-3"/> Trace ID</p>
              <p className="text-sm font-mono bg-muted p-2 rounded-md truncate">{log.traceId || "N/A"}</p>
            </div>
          </div>

          <div className="border-t border-border pt-6">
            <h3 className="text-sm font-bold mb-3 uppercase tracking-wider text-muted-foreground">System Message</h3>
            <p className="text-sm bg-primary/10 text-primary p-4 rounded-lg border border-primary/20">
              {log.message}
            </p>
          </div>

          <div className="border-t border-border pt-6">
            <h3 className="text-sm font-bold mb-3 uppercase tracking-wider text-muted-foreground">Raw Metadata</h3>
            {log.metadata ? (
              <div className="bg-black text-green-400 p-4 rounded-xl overflow-x-auto text-xs font-mono border border-border shadow-inner">
                <pre>
                  <code>{JSON.stringify(log.metadata, null, 2)}</code>
                </pre>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic bg-muted p-4 rounded-lg text-center">
                No metadata attached to this event.
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}