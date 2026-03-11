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
} from "lucide-react";
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

  const handleCopyKey = () => {
    if (createdKey) {
      navigator.clipboard.writeText(createdKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
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

  return (
    <div className="max-w-[1600px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">API Key Management</h1>
          <p className="text-sm text-muted-foreground">
            Create and manage API keys for external integrations
          </p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)} className="gap-2">
          <Plus size={16} />
          Create API Key
        </Button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Active Keys
                </p>
                <p className="text-3xl font-bold">{activeKeys.length}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <Key className="size-5 text-emerald-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Revoked Keys
                </p>
                <p className="text-3xl font-bold">{revokedKeys.length}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                <Trash2 className="size-5 text-red-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Total Keys
                </p>
                <p className="text-3xl font-bold">{keys.length}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Key className="size-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Keys Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              API Keys
            </CardTitle>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={includeRevoked}
                onChange={(e) => setIncludeRevoked(e.target.checked)}
                className="rounded border-border"
              />
              Show revoked
            </label>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : keys.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Key className="mx-auto mb-3 h-10 w-10 opacity-30" />
              <p className="font-medium">No API keys found</p>
              <p className="text-sm">
                Create your first API key to get started
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-3 font-medium text-muted-foreground">
                      Name
                    </th>
                    <th className="pb-3 font-medium text-muted-foreground">
                      Key Prefix
                    </th>
                    <th className="pb-3 font-medium text-muted-foreground">
                      Scopes
                    </th>
                    <th className="pb-3 font-medium text-muted-foreground">
                      Status
                    </th>
                    <th className="pb-3 font-medium text-muted-foreground">
                      Last Used
                    </th>
                    <th className="pb-3 font-medium text-muted-foreground">
                      Expires
                    </th>
                    <th className="pb-3 font-medium text-muted-foreground">
                      Created
                    </th>
                    <th className="pb-3 font-medium text-muted-foreground text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {keys.map((apiKey) => (
                    <tr
                      key={apiKey.id}
                      className="hover:bg-muted/50 transition-colors"
                    >
                      <td className="py-3 font-medium">{apiKey.name}</td>
                      <td className="py-3">
                        <code className="text-xs bg-muted px-2 py-1 rounded">
                          {apiKey.keyPrefix}...
                        </code>
                      </td>
                      <td className="py-3">
                        {apiKey.scopes && apiKey.scopes.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {apiKey.scopes.map((scope) => (
                              <Badge
                                key={scope}
                                variant="secondary"
                                className="text-xs"
                              >
                                {scope}
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-xs">
                            All
                          </span>
                        )}
                      </td>
                      <td className="py-3">
                        <Badge
                          variant={apiKey.isActive ? "default" : "destructive"}
                          className="text-xs"
                        >
                          {apiKey.isActive ? "Active" : "Revoked"}
                        </Badge>
                      </td>
                      <td className="py-3 text-xs text-muted-foreground">
                        {apiKey.lastUsedAt
                          ? formatDate(apiKey.lastUsedAt)
                          : "Never"}
                      </td>
                      <td className="py-3 text-xs text-muted-foreground">
                        {apiKey.expiresAt
                          ? formatDate(apiKey.expiresAt)
                          : "Never"}
                      </td>
                      <td className="py-3 text-xs text-muted-foreground">
                        {formatDate(apiKey.createdAt)}
                      </td>
                      <td className="py-3 text-right">
                        {apiKey.isActive && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setRevokeTarget(apiKey)}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
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

      {/* Create API Key Dialog */}
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
        <DialogContent className="sm:max-w-lg">
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
              <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-amber-800 dark:text-amber-200">
                    Make sure to copy this key now. You will not be able to see
                    it again.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 min-w-0">
                <code className="flex-1 min-w-0 text-xs bg-muted p-3 rounded-md break-all font-mono overflow-x-auto">
                  {showKey ? createdKey : "•".repeat(40)}
                </code>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowKey(!showKey)}
                >
                  {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
                </Button>
                <Button variant="outline" size="icon" onClick={handleCopyKey}>
                  {copied ? (
                    <Check size={14} className="text-emerald-500" />
                  ) : (
                    <Copy size={14} />
                  )}
                </Button>
              </div>
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
              >
                Done
              </Button>
            ) : (
              <Button
                onClick={handleCreate}
                disabled={!newKeyName.trim() || createMutation.isPending}
              >
                {createMutation.isPending ? "Creating..." : "Create Key"}
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
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Revoke API Key</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to revoke the API key &quot;
              {revokeTarget?.name}&quot;? This action cannot be undone. Any
              applications using this key will lose access.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRevoke}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {revokeMutation.isPending ? "Revoking..." : "Revoke Key"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
