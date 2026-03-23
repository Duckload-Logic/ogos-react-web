import { useState } from "react";
import {
  Key,
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
} from "lucide-react";
import Layout from "@/components/layout/Layout";
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
import { useAPIKeys, useCreateAPIKey, useRevokeAPIKey } from "../hooks";
import type { APIKey } from "../types";

export default function APIManagement() {
  const [includeRevoked, setIncludeRevoked] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [revokeTarget, setRevokeTarget] = useState<APIKey | null>(null);
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyScopes, setNewKeyScopes] = useState("");
  const [newKeyExpiry, setNewKeyExpiry] = useState("");
  const [createdKey, setCreatedKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showKey, setShowKey] = useState(false);

  const { data: keys = [], isLoading } = useAPIKeys(includeRevoked);
  const createMutation = useCreateAPIKey();
  const revokeMutation = useRevokeAPIKey();

  const isPageLoading = isLoading || createMutation.isPending || revokeMutation.isPending;

  const activeKeys = keys.filter((k) => k.isActive);
  const revokedKeys = keys.filter((k) => !k.isActive);

  const handleCreate = async () => {
    if (!newKeyName.trim()) return;

    const scopes = newKeyScopes
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const result = await createMutation.mutateAsync({
      name: newKeyName.trim(),
      scopes: scopes.length > 0 ? scopes : undefined,
      expiresAt: newKeyExpiry || undefined,
    });

    setCreatedKey(result.key);
    setNewKeyName("");
    setNewKeyScopes("");
    setNewKeyExpiry("");
  };

  const handleRevoke = async () => {
    if (!revokeTarget) return;
    await revokeMutation.mutateAsync(revokeTarget.id);
    setRevokeTarget(null);
  };

  const handleCopyKey = async () => {
    if (!createdKey) return;

    try {
      await navigator.clipboard.writeText(createdKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy API key:", error);
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
      label: "Active Keys",
      value: activeKeys.length,
      icon: ShieldCheck,
      iconClass:
        "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    },
    {
      label: "Revoked Keys",
      value: revokedKeys.length,
      icon: Ban,
      iconClass:
        "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
    },
    {
      label: "Total Keys",
      value: keys.length,
      icon: Key,
      iconClass: "bg-primary/10 text-primary border-primary/20",
    },
  ];

  return (
    <Layout
      title="API Management"
      isLoading={false}
      badgeText="Integration Access Control"
      badgeIcon={<Sparkles className="h-3.5 w-3.5" />}
      description="Create and manage API keys for external integrations while keeping access secure and easy to monitor."
      headerActions={
        <Button
          onClick={() => setIsCreateOpen(true)}
          className="h-10 gap-2 rounded-xl px-4 shadow-sm"
        >
          <Plus size={16} />
          Create API Key
        </Button>
      }
    >
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
                      <p className="text-4xl font-bold tracking-tight tabular-nums text-foreground">
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
                    <Key className="h-5 w-5" />
                  </span>
                  API Keys
                </CardTitle>
                <p className="mt-2 text-sm text-muted-foreground">
                  Manage active credentials, scopes, and revocations.
                </p>
              </div>

              <label className="inline-flex cursor-pointer items-center gap-3 rounded-xl border border-white/30 bg-white/60 px-4 py-2 text-sm backdrop-blur-md dark:border-white/10 dark:bg-white/[0.05]">
                <input
                  type="checkbox"
                  checked={includeRevoked}
                  onChange={(e) => setIncludeRevoked(e.target.checked)}
                  className="rounded border-border"
                />
                Show revoked keys
              </label>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {keys.length === 0 ? (
              <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/30 bg-white/60 backdrop-blur-md dark:border-white/10 dark:bg-white/[0.05]">
                  <Key className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-lg font-semibold text-foreground">
                  No API keys yet
                </p>
                <p className="mt-2 max-w-md text-sm text-muted-foreground">
                  Create your first API key to start integrating external services
                  securely.
                </p>
                <Button
                  onClick={() => setIsCreateOpen(true)}
                  className="mt-5 h-10 rounded-xl px-4"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create API Key
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1100px] text-sm">
                  <thead>
                    <tr className="border-b border-white/20 bg-white/55 text-left backdrop-blur-md dark:border-white/10 dark:bg-white/[0.03]">
                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                        Name
                      </th>
                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                        Key Prefix
                      </th>
                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                        Scopes
                      </th>
                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                        Status
                      </th>
                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                        Last Used
                      </th>
                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                        Expires
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
                    {keys.map((apiKey) => (
                      <tr
                        key={apiKey.id}
                        className="border-b border-white/10 transition-colors duration-150 hover:bg-white/35 dark:hover:bg-white/[0.03]"
                      >
                        <td className="px-5 py-4">
                          <div className="font-medium text-foreground">
                            {apiKey.name}
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <code className="rounded-lg border border-white/20 bg-white/55 px-2.5 py-1 text-xs text-foreground dark:border-white/10 dark:bg-white/[0.04]">
                            {apiKey.keyPrefix}...
                          </code>
                        </td>

                        <td className="px-5 py-4">
                          {apiKey.scopes && apiKey.scopes.length > 0 ? (
                            <div className="flex flex-wrap gap-1.5">
                              {apiKey.scopes.map((scope) => (
                                <Badge
                                  key={scope}
                                  variant="secondary"
                                  className="rounded-full border border-white/20 bg-white/60 text-xs dark:border-white/10 dark:bg-white/[0.05]"
                                >
                                  {scope}
                                </Badge>
                              ))}
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground">
                              All scopes
                            </span>
                          )}
                        </td>

                        <td className="px-5 py-4">
                          <Badge
                            className={
                              apiKey.isActive
                                ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                                : "border-red-500/20 bg-red-500/10 text-red-700 dark:text-red-400"
                            }
                          >
                            {apiKey.isActive ? "Active" : "Revoked"}
                          </Badge>
                        </td>

                        <td className="px-5 py-4 text-xs text-muted-foreground">
                          {apiKey.lastUsedAt
                            ? formatDate(apiKey.lastUsedAt)
                            : "Never"}
                        </td>

                        <td className="px-5 py-4 text-xs text-muted-foreground">
                          {apiKey.expiresAt
                            ? formatDate(apiKey.expiresAt)
                            : "Never"}
                        </td>

                        <td className="px-5 py-4 text-xs text-muted-foreground">
                          {formatDate(apiKey.createdAt)}
                        </td>

                        <td className="px-5 py-4 text-right">
                          {apiKey.isActive && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setRevokeTarget(apiKey)}
                              className="rounded-xl text-destructive hover:bg-destructive/10 hover:text-destructive"
                            >
                              <Trash2 size={14} />
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        <Dialog
          open={isCreateOpen}
          onOpenChange={(open) => {
            if (!open) {
              setIsCreateOpen(false);
              setCreatedKey(null);
              setShowKey(false);
            }
          }}
        >
          <DialogContent className="border-white/20 bg-white/80 backdrop-blur-2xl dark:border-white/10 dark:bg-neutral-900/90 sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {createdKey ? "API Key Created" : "Create New API Key"}
              </DialogTitle>
              <DialogDescription>
                {createdKey
                  ? "Copy and save this key — it will not be shown again."
                  : "Give your API key a name and optional scopes."}
              </DialogDescription>
            </DialogHeader>

            {createdKey ? (
              <div className="space-y-4">
                <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-4">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600 dark:text-amber-400" />
                    <p className="text-sm text-amber-800 dark:text-amber-200">
                      Make sure to copy this key now. You will not be able to see
                      it again.
                    </p>
                  </div>
                </div>

                <div className="flex min-w-0 items-center gap-2">
                  <code className="flex min-w-0 flex-1 break-all rounded-xl border border-white/20 bg-white/60 p-3 font-mono text-xs dark:border-white/10 dark:bg-white/[0.04]">
                    {showKey ? createdKey : "•".repeat(40)}
                  </code>

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setShowKey(!showKey)}
                    className="rounded-xl"
                  >
                    {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
                  </Button>

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleCopyKey}
                    className="rounded-xl"
                  >
                    {copied ? (
                      <Check size={14} className="text-emerald-500" />
                    ) : (
                      <Copy size={14} />
                    )}
                  </Button>

                  {copied && (
                    <span className="text-xs text-emerald-500 ml-2">
                      Copied!
                    </span>
                  )}
                </div>

                {copied && (
                  <span
                    role="status"
                    aria-live="polite"
                    className="text-xs text-emerald-500"
                  >
                    Copied!
                  </span>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="keyName">Key Name</Label>
                  <Input
                    id="keyName"
                    placeholder="e.g., Production API Key"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    className="rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="keyScopes">
                    Scopes{" "}
                    <span className="text-muted-foreground">
                      (comma-separated, optional)
                    </span>
                  </Label>
                  <Input
                    id="keyScopes"
                    placeholder="e.g., read:students, write:appointments"
                    value={newKeyScopes}
                    onChange={(e) => setNewKeyScopes(e.target.value)}
                    className="rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="keyExpiry">
                    Expiration Date{" "}
                    <span className="text-muted-foreground">(optional)</span>
                  </Label>
                  <Input
                    id="keyExpiry"
                    type="datetime-local"
                    value={newKeyExpiry}
                    onChange={(e) => setNewKeyExpiry(e.target.value)}
                    className="rounded-xl"
                  />
                </div>
              </div>
            )}

            <DialogFooter>
              {createdKey ? (
                <Button
                  onClick={() => {
                    setIsCreateOpen(false);
                    setCreatedKey(null);
                    setShowKey(false);
                  }}
                  className="rounded-xl"
                >
                  Done
                </Button>
              ) : (
                <Button
                  onClick={handleCreate}
                  disabled={!newKeyName.trim() || createMutation.isPending}
                  className="rounded-xl"
                >
                  {createMutation.isPending ? "Creating..." : "Create Key"}
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <AlertDialog
          open={!!revokeTarget}
          onOpenChange={(open) => !open && setRevokeTarget(null)}
        >
          <AlertDialogContent className="border-white/20 bg-white/85 backdrop-blur-2xl dark:border-white/10 dark:bg-neutral-900/92">
            <AlertDialogHeader>
              <AlertDialogTitle>Revoke API Key</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to revoke the API key &quot;
                {revokeTarget?.name}&quot;? This action cannot be undone. Any
                applications using this key will lose access.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleRevoke}
                className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {revokeMutation.isPending ? "Revoking..." : "Revoke Key"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Layout>
  );
}