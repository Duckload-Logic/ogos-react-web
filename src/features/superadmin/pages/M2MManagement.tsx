import { useState } from "react";
import {
  Plus,
  Trash2,
  Copy,
  Check,
  Eye,
  EyeOff,
  AlertTriangle,
  Sparkles,
  ShieldCheck,
  Ban,
  RefreshCw,
  Fingerprint,
} from "lucide-react";
import { usePageMetadata } from "@/context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  useM2MClients,
  useCreateM2MClient,
  useRevokeM2MClient,
  useRotateM2MSecret,
  useVerifyM2MClient,
} from "../hooks";
import type { M2MClient } from "../types";

import M2MClientDialog from "../components/M2MClientDialog";

export default function M2MManagement() {
  const [selectedClient, setSelectedClient] = useState<M2MClient | null>(null);
  const [includeRevoked, setIncludeRevoked] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [revokeTarget, setRevokeTarget] = useState<M2MClient | null>(null);
  const [rotateTarget, setRotateTarget] = useState<M2MClient | null>(null);

  const [newClientName, setNewClientName] = useState("");
  const [newClientDesc, setNewClientDesc] = useState("");
  const [newClientScopes, setNewClientScopes] = useState("");
  const [newClientExpiry, setNewClientExpiry] = useState("");

  const [createdSecret, setCreatedSecret] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showSecret, setShowSecret] = useState(false);

  const { data: clients = [], isLoading } = useM2MClients(includeRevoked);
  const createMutation = useCreateM2MClient();
  const revokeMutation = useRevokeM2MClient();
  const rotateMutation = useRotateM2MSecret();
  const verifyMutation = useVerifyM2MClient();

  const isPageLoading =
    isLoading ||
    createMutation.isPending ||
    revokeMutation.isPending ||
    rotateMutation.isPending ||
    verifyMutation.isPending;

  const activeClients = clients.filter((c) => c.isActive);
  const revokedClients = clients.filter((c) => !c.isActive);

  const handleCreate = async () => {
    if (!newClientName.trim() || !newClientDesc.trim()) return;

    const scopes = newClientScopes
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const result = await createMutation.mutateAsync({
      clientName: newClientName.trim(),
      clientDescription: newClientDesc.trim(),
      scopes: scopes.length > 0 ? scopes : undefined,
      expiresAt: newClientExpiry || undefined,
    });

    setCreatedSecret(result.clientSecret);
    setNewClientName("");
    setNewClientDesc("");
    setNewClientScopes("");
    setNewClientExpiry("");
  };

  const handleRevoke = async () => {
    if (!revokeTarget) return;
    await revokeMutation.mutateAsync(revokeTarget.id);
    setRevokeTarget(null);
  };

  const handleRotate = async () => {
    if (!rotateTarget) return;
    const result = await rotateMutation.mutateAsync(rotateTarget.id);
    setCreatedSecret(result.clientSecret);
    setRotateTarget(null);
    setIsCreateOpen(true); // Re-use the "secret reveal" modal logic
  };

  const handleVerify = async (id: number) => {
    await verifyMutation.mutateAsync(id);
  };

  const handleCopySecret = async () => {
    if (!createdSecret) return;
    try {
      await navigator.clipboard.writeText(createdSecret);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy client secret:", error);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const statCards = [
    {
      label: "Active Clients",
      value: activeClients.length,
      icon: ShieldCheck,
      iconClass:
        "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    },
    {
      label: "Revoked Clients",
      value: revokedClients.length,
      icon: Ban,
      iconClass:
        "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
    },
    {
      label: "Total Clients",
      value: clients.length,
      icon: Fingerprint,
      iconClass: "bg-primary/10 text-primary border-primary/20",
    },
  ];

  usePageMetadata({
    title: "M2M Management",
    isLoading: isPageLoading,
    badgeText: "Infrastructure Access Control",
    badgeIcon: <Sparkles className="h-3.5 w-3.5" />,
    description:
      "Manage Machine-to-Machine clients for integration, automation, and infrastructure services.",
    headerActions: (
      <Button
        onClick={() => setIsCreateOpen(true)}
        className="h-10 gap-2 rounded-xl px-4 shadow-sm"
      >
        <Plus size={16} />
        Register Client
      </Button>
    ),
  });

  return (
    <>
      <div className="mx-auto w-full max-w-[1700px] space-y-5">
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <Card
                key={card.label}
                className="rounded-[18px] border border-white/20 bg-white/45 shadow-[0_8px_22px_rgba(15,23,42,0.06)] backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04]"
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        {card.label}
                      </p>
                      <p className="text-4xl font-bold tabular-nums tracking-tight text-foreground">
                        {card.value}
                      </p>
                    </div>

                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-xl border backdrop-blur-md ${card.iconClass}`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </section>

        <Card className="overflow-hidden rounded-[20px] border border-white/20 bg-white/45 shadow-[0_8px_22px_rgba(15,23,42,0.06)] backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04]">
          <CardHeader className="border-b border-white/20 pb-4 dark:border-white/10">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold tracking-tight">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/30 bg-white/70 backdrop-blur-md dark:border-white/10 dark:bg-white/[0.05]">
                    <Fingerprint className="h-5 w-5 text-primary" />
                  </span>
                  M2M Clients
                </CardTitle>
                <p className="mt-2 text-sm text-muted-foreground">
                  View and manage machine access to the platform.
                </p>
              </div>

              <label className="inline-flex cursor-pointer items-center gap-3 rounded-xl border border-white/30 bg-white/60 px-4 py-2 text-sm backdrop-blur-md dark:border-white/10 dark:bg-white/[0.05]">
                <input
                  type="checkbox"
                  checked={includeRevoked}
                  onChange={(e) => setIncludeRevoked(e.target.checked)}
                  className="rounded border-border"
                />
                Show revoked clients
              </label>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {clients.length === 0 ? (
              <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/30 bg-white/60 backdrop-blur-md dark:border-white/10 dark:bg-white/[0.05]">
                  <Fingerprint className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-lg font-semibold text-foreground">
                  No M2M clients registered
                </p>
                <p className="mt-2 max-w-md text-sm text-muted-foreground">
                  Register your first machine client to allow external system
                  integrations.
                </p>
                <Button
                  onClick={() => setIsCreateOpen(true)}
                  className="mt-5 h-10 rounded-xl px-4"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Register Client
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1200px] text-sm">
                  <thead>
                    <tr className="border-b border-white/20 bg-white/55 text-left backdrop-blur-md dark:border-white/10 dark:bg-white/[0.03]">
                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                        Client
                      </th>
                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                        Client ID
                      </th>
                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                        Status / Verification
                      </th>
                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                        Scopes
                      </th>
                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                        Last Activity
                      </th>
                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                        Created
                      </th>
                      <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {clients.map((client) => (
                      <tr
                        key={client.id}
                        onClick={() => setSelectedClient(client)}
                        className="cursor-pointer border-b border-white/10 transition-colors duration-150 hover:bg-white/35 dark:hover:bg-white/[0.03]"
                      >
                        <td className="px-5 py-4">
                          <div className="space-y-0.5">
                            <div className="font-medium text-foreground">
                              {client.clientName}
                            </div>
                            <div className="max-w-[200px] truncate text-[11px] text-muted-foreground">
                              {client.clientDescription}
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <code className="rounded-lg border border-white/20 bg-white/55 px-2.5 py-1 font-mono text-[11px] text-foreground dark:border-white/10 dark:bg-white/[0.04]">
                              {client.clientId}
                            </code>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 rounded-md"
                              onClick={() => {
                                navigator.clipboard.writeText(client.clientId);
                              }}
                            >
                              <Copy size={12} />
                            </Button>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
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
                        </td>

                        <td className="px-5 py-4">
                          {client.scopes && client.scopes.length > 0 ? (
                            <div className="flex flex-wrap gap-1.5">
                              {client.scopes.map((scope) => (
                                <Badge
                                  key={scope}
                                  variant="outline"
                                  className="rounded-full border-muted-foreground/20 px-2 py-0 text-[10px]"
                                >
                                  {scope}
                                </Badge>
                              ))}
                            </div>
                          ) : (
                            <span className="text-xs italic text-muted-foreground">
                              admin:full
                            </span>
                          )}
                        </td>

                        <td className="px-5 py-4 text-xs text-muted-foreground">
                          {client.lastUsedAt
                            ? formatDate(client.lastUsedAt)
                            : "Never"}
                        </td>

                        <td className="px-5 py-4 text-xs text-muted-foreground">
                          {formatDate(client.createdAt)}
                        </td>

                        <td className="px-5 py-4 text-right">
                          <div className="flex justify-end gap-1">
                            {client.isActive && (
                              <>
                                {!client.isVerified && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleVerify(client.id);
                                    }}
                                    className="h-8 w-8 rounded-xl p-0 text-blue-600 hover:bg-blue-600/10 hover:text-blue-600"
                                    title="Verify Client"
                                    disabled={verifyMutation.isPending}
                                  >
                                    <Check
                                      size={14}
                                      strokeWidth={3}
                                    />
                                  </Button>
                                )}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setRotateTarget(client);
                                  }}
                                  className="h-8 w-8 rounded-xl p-0"
                                  title="Rotate Client Secret"
                                >
                                  <RefreshCw
                                    size={14}
                                    className="text-muted-foreground"
                                  />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setRevokeTarget(client);
                                  }}
                                  className="h-8 w-8 rounded-xl p-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
                                  title="Revoke Client"
                                >
                                  <Trash2 size={14} />
                                </Button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Secret Reveal Modal */}
        <Dialog
          open={isCreateOpen}
          onOpenChange={(open) => {
            if (!open) {
              setIsCreateOpen(false);
              setCreatedSecret(null);
              setShowSecret(false);
            }
          }}
        >
          <DialogContent className="border-white/20 bg-white/80 backdrop-blur-2xl dark:border-white/10 dark:bg-neutral-900/90 sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {createdSecret ? "Client Secret Issued" : "Register M2M Client"}
              </DialogTitle>
              <DialogDescription>
                {createdSecret
                  ? "Store this secret securely — it will never be shown again."
                  : "M2M clients use Client ID and Secret to authenticate services."}
              </DialogDescription>
            </DialogHeader>

            {createdSecret ? (
              <div className="space-y-4">
                <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-4">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600 dark:text-amber-400" />
                    <p className="text-sm text-amber-800 dark:text-amber-200">
                      Copy this secret now. You will not be able to retrieve it
                      later. If you lose it, you must rotate the secret.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Label className="text-[10px] uppercase text-muted-foreground">
                    Client Secret
                  </Label>
                  <div className="flex min-w-0 items-center gap-2">
                    <code className="flex min-w-0 flex-1 break-all rounded-xl border border-white/20 bg-white/60 p-3 font-mono text-xs dark:border-white/10 dark:bg-white/[0.04]">
                      {showSecret ? createdSecret : "•".repeat(48)}
                    </code>

                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setShowSecret(!showSecret)}
                      className="rounded-xl"
                    >
                      {showSecret ? <EyeOff size={14} /> : <Eye size={14} />}
                    </Button>

                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleCopySecret}
                      className="rounded-xl"
                    >
                      {copied ? (
                        <Check
                          size={14}
                          className="text-emerald-500"
                        />
                      ) : (
                        <Copy size={14} />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="clientName">Client Name</Label>
                  <Input
                    id="clientName"
                    placeholder="e.g., Billing Service"
                    value={newClientName}
                    onChange={(e) => setNewClientName(e.target.value)}
                    className="rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="clientDesc">Client Description</Label>
                  <Input
                    id="clientDesc"
                    placeholder="Briefly describe what this client is for"
                    value={newClientDesc}
                    onChange={(e) => setNewClientDesc(e.target.value)}
                    className="rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="clientScopes">
                    Scopes{" "}
                    <span className="text-[10px] font-normal text-muted-foreground">
                      (comma-separated, optional)
                    </span>
                  </Label>
                  <Input
                    id="clientScopes"
                    placeholder="e.g., read:reports, write:logs"
                    value={newClientScopes}
                    onChange={(e) => setNewClientScopes(e.target.value)}
                    className="rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="clientExpiry">
                    Expiration Date{" "}
                    <span className="text-[10px] font-normal text-muted-foreground">
                      (optional)
                    </span>
                  </Label>
                  <Input
                    id="clientExpiry"
                    type="datetime-local"
                    value={newClientExpiry}
                    onChange={(e) => setNewClientExpiry(e.target.value)}
                    className="rounded-xl"
                  />
                </div>
              </div>
            )}

            <DialogFooter>
              {createdSecret ? (
                <Button
                  onClick={() => {
                    setIsCreateOpen(false);
                    setCreatedSecret(null);
                    setShowSecret(false);
                  }}
                  className="rounded-xl"
                >
                  Done
                </Button>
              ) : (
                <Button
                  onClick={handleCreate}
                  disabled={
                    !newClientName.trim() ||
                    !newClientDesc.trim() ||
                    createMutation.isPending
                  }
                  className="rounded-xl"
                >
                  {createMutation.isPending
                    ? "Registering..."
                    : "Register Client"}
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Revoke Confirmation */}
        <AlertDialog
          open={!!revokeTarget}
          onOpenChange={(open) => !open && setRevokeTarget(null)}
        >
          <AlertDialogContent className="dark:bg-neutral-900/92 border-white/20 bg-white/85 backdrop-blur-2xl dark:border-white/10">
            <AlertDialogHeader>
              <AlertDialogTitle>Revoke M2M Client</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to revoke the client &quot;
                {revokeTarget?.clientName}&quot;? This action cannot be undone.
                Any services using this Client ID and Secret will lose access
                immediately.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="rounded-xl">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleRevoke}
                className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {revokeMutation.isPending ? "Revoking..." : "Revoke Client"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Rotate Secret Confirmation */}
        <AlertDialog
          open={!!rotateTarget}
          onOpenChange={(open) => !open && setRotateTarget(null)}
        >
          <AlertDialogContent className="dark:bg-neutral-900/92 border-white/20 bg-white/85 backdrop-blur-2xl dark:border-white/10 sm:max-w-md">
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <RefreshCw
                  size={18}
                  className="text-amber-500"
                />
                Rotate Client Secret
              </AlertDialogTitle>
              <AlertDialogDescription>
                Rotating the secret for &quot;{rotateTarget?.clientName}&quot;
                will generate a new secret and **immediately invalidate** the
                old one. Applications will need to be updated with the new
                secret.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="rounded-xl">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleRotate}
                className="rounded-xl bg-amber-500 text-white hover:bg-amber-600"
              >
                {rotateMutation.isPending ? "Rotating..." : "Rotate Secret"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <M2MClientDialog
          client={selectedClient}
          isOpen={!!selectedClient}
          onClose={() => setSelectedClient(null)}
          onRotateSecret={() => {
            setRotateTarget(selectedClient);
            setSelectedClient(null);
          }}
        />
      </div>
    </>
  );
}
