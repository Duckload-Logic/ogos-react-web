import { X, Server, Clock, Fingerprint, Activity } from "lucide-react";
import { LogEntry } from "../../activity-meta/services/logService";

interface LogMetadataDrawerProps {
  log: LogEntry | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function LogMetadataDrawer({
  log,
  isOpen,
  onClose,
}: LogMetadataDrawerProps) {
  if (!isOpen || !log) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div
        className={`fixed right-0 top-0 z-[110] h-full w-full max-w-lg transform border-l border-border bg-background shadow-2xl transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"} overflow-y-auto`}
      >
        <div className="flex items-center justify-between border-b border-border bg-muted/20 p-6">
          <div>
            <h2 className="flex items-center gap-2 text-lg font-bold">
              <Server className="h-5 w-5 text-primary" />
              Log Details
            </h2>
            <p className="mt-1 font-mono text-xs text-muted-foreground">
              {log.id}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 transition-colors hover:bg-muted"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6 p-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="flex items-center gap-1 text-xs font-semibold uppercase text-muted-foreground">
                <Activity className="h-3 w-3" /> Action
              </p>
              <p className="font-medium">{log.action}</p>
            </div>
            <div className="space-y-1">
              <p className="flex items-center gap-1 text-xs font-semibold uppercase text-muted-foreground">
                <Clock className="h-3 w-3" /> Timestamp
              </p>
              <p className="text-sm">
                {new Date(log.createdAt).toLocaleString()}
              </p>
            </div>
            <div className="col-span-2 space-y-1">
              <p className="flex items-center gap-1 text-xs font-semibold uppercase text-muted-foreground">
                <Fingerprint className="h-3 w-3" /> Trace ID
              </p>
              <p className="truncate rounded-md bg-muted p-2 font-mono text-sm">
                {log.traceId || "N/A"}
              </p>
            </div>
          </div>

          <div className="border-t border-border pt-6">
            <h3 className="mb-3 text-sm font-bold uppercase text-muted-foreground">
              System Message
            </h3>
            <p className="rounded-lg border border-primary/20 bg-primary/10 p-4 text-sm text-primary">
              {log.message}
            </p>
          </div>

          <div className="border-t border-border pt-6">
            <h3 className="mb-3 text-sm font-bold uppercase text-muted-foreground">
              Raw Metadata
            </h3>
            {log.metadata ? (
              <div className="overflow-x-auto rounded-xl border border-border bg-black p-4 font-mono text-xs text-green-400 shadow-inner">
                <pre>
                  <code>{JSON.stringify(log.metadata, null, 2)}</code>
                </pre>
              </div>
            ) : (
              <p className="rounded-lg bg-muted p-4 text-center text-sm italic text-muted-foreground">
                No metadata attached to this event.
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
