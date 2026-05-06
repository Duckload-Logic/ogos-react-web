import { useState } from "react";
import {
  ShieldAlert,
  Plus,
  Trash2,
  Mail,
  ShieldCheck,
  Sparkles,
  Info,
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
  useWhitelist,
  useAddWhitelist,
  useRemoveWhitelist,
} from "../hooks/useWhitelist";

export interface WhitelistEntry {
  email: string;
  roleId: number;
  roleName: string;
  createdAt: string;
}

export default function AdminWhitelist() {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [revokeTarget, setRevokeTarget] = useState<WhitelistEntry | null>(null);

  const [newEmail, setNewEmail] = useState("");
  const [selectedRoleId, setSelectedRoleId] = useState<string>("1");

  const { data: whitelist = [], isLoading } = useWhitelist();
  const addMutation = useAddWhitelist();
  const removeMutation = useRemoveWhitelist();

  const handleAdd = async () => {
    if (!newEmail.trim()) return;

    await addMutation.mutateAsync({
      email: newEmail,
      roleId: Number(selectedRoleId),
    });

    setIsAddOpen(false);
    setNewEmail("");
    setSelectedRoleId("1");
  };

  const handleRevoke = async () => {
    if (!revokeTarget) return;
    setRevokeTarget(null);
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

  usePageMetadata({
    title: "Access Whitelist",
    isLoading: isLoading,
    badgeText: "IDP Intercept Control",
    badgeIcon: <Sparkles className="h-3.5 w-3.5" />,
    description:
      "Manage pre-approved administrative access for IDP (Google) logins.",
    headerActions: (
      <Button
        onClick={() => setIsAddOpen(true)}
        className="h-10 gap-2 rounded-xl px-4 shadow-sm"
      >
        <Plus size={16} /> Add to Whitelist
      </Button>
    ),
  });

  return (
    <div className="mx-auto w-full max-w-[1700px] space-y-5">
      {/* Information Banner */}
      <div className="rounded-[18px] border border-blue-500/20 bg-blue-500/10 p-4 backdrop-blur-md">
        <div className="flex items-start gap-3">
          <Info className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600 dark:text-blue-400" />
          <div>
            <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-200">
              How the Whitelist Works
            </h4>
            <p className="mt-1 max-w-4xl text-xs leading-relaxed text-blue-700 dark:text-blue-300"></p>
          </div>
        </div>
      </div>

      <Card className="overflow-hidden rounded-[20px] border border-white/20 bg-white/45 shadow-[0_8px_22px_rgba(15,23,42,0.06)] backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04]">
        <CardHeader className="border-b border-white/20 pb-4 dark:border-white/10">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold tracking-tight">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/30 bg-white/70 backdrop-blur-md dark:border-white/10 dark:bg-white/[0.05]">
              <ShieldAlert className="h-5 w-5 text-primary" />
            </span>
            Whitelisted Accounts
          </CardTitle>
        </CardHeader>

        <CardContent className="p-0">
          {whitelist.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/30 bg-white/60 backdrop-blur-md dark:border-white/10 dark:bg-white/[0.05]">
                <Mail className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-lg font-semibold text-foreground">
                No whitelisted accounts
              </p>
              <p className="mt-2 max-w-md text-sm text-muted-foreground">
                Add an email address to pre-approve them for administrative
                access.
              </p>
              <Button
                onClick={() => setIsAddOpen(true)}
                className="mt-5 h-10 rounded-xl px-4"
              >
                <Plus className="mr-2 h-4 w-4" /> Add to Whitelist
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] text-sm">
                <thead>
                  <tr className="border-b border-white/20 bg-white/55 text-left backdrop-blur-md dark:border-white/10 dark:bg-white/[0.03]">
                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                      Email Address
                    </th>
                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                      Target Role
                    </th>
                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                      Added On
                    </th>
                    <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {whitelist.map((entry) => (
                    <tr
                      key={entry.email}
                      className="border-b border-white/10 transition-colors duration-150 hover:bg-white/35 dark:hover:bg-white/[0.03]"
                    >
                      <td className="px-5 py-4 font-medium text-foreground">
                        {entry.email}
                      </td>
                      <td className="px-5 py-4">
                        <Badge
                          className={
                            entry.roleId === 1
                              ? "border-purple-500/20 bg-purple-500/10 text-purple-700 dark:text-purple-400"
                              : "border-blue-500/20 bg-blue-500/10 text-blue-700 dark:text-blue-400"
                          }
                        >
                          <ShieldCheck className="mr-1 h-3 w-3" />{" "}
                          {entry.roleName}
                        </Badge>
                      </td>
                      <td className="px-5 py-4 text-xs text-muted-foreground">
                        {formatDate(entry.createdAt)}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setRevokeTarget(entry);
                          }}
                          className="h-8 w-8 rounded-xl p-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
                          title="Remove from Whitelist"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Whitelist Modal */}
      <Dialog
        open={isAddOpen}
        onOpenChange={setIsAddOpen}
      >
        <DialogContent className="border-white/20 bg-white/80 backdrop-blur-2xl dark:border-white/10 dark:bg-neutral-900/90 sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add to Whitelist</DialogTitle>
            <DialogDescription>
              Grant administrative privileges to an email address upon their
              next IDP login.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Email Address</Label>
              <Input
                placeholder="e.g., administrator@dllbsit2027.com"
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label>Target Role</Label>
              <select
                value={selectedRoleId}
                onChange={(e) => setSelectedRoleId(e.target.value)}
                className="flex h-10 w-full rounded-xl border border-white/30 bg-white/60 px-3 py-2 text-sm outline-none backdrop-blur-md focus:border-primary/50 dark:border-white/10 dark:bg-white/[0.05]"
              >
                <option value="1">Superadmin (Role ID: 1)</option>
                <option value="2">Admin (Role ID: 2)</option>
                {/* Add any other elevated roles you have here */}
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={handleAdd}
              disabled={!newEmail || addMutation.isPending}
              className="rounded-xl"
            >
              {addMutation.isPending ? "Adding..." : "Add to Whitelist"}
            </Button>
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
            <AlertDialogTitle>Remove from Whitelist</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove{" "}
              <strong>{revokeTarget?.email}</strong> from the whitelist? This
              will NOT delete their account, but if they log out and log back
              in, they may lose their elevated privileges.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRevoke}
              className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
