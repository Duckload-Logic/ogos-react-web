import { SearchInput } from "@/components/form";
import { Pagination } from "@/components/shared";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePageMetadata, useToast } from "@/context";
import { getErrorMessage } from "@/lib/api";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  Calendar,
  Mail,
  MoreVertical,
  Shield,
  ShieldAlert,
  UserCheck,
  UserMinus,
  UserPlus,
  Users,
  UserX,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useAddUserToWhitelist,
  useRemoveUserFromWhitelist,
  useToggleUserStatus,
  useUpdateUserRoles,
  useUsers,
  useWhitelist,
} from "@/features/system-admin/hooks";
import type {
  UserAccount,
  WhitelistEntry,
} from "@/features/system-admin/types";
import { RoleManagementModal } from "./RoleManagementModal";
import { WhitelistModal } from "./WhitelistModal";
import { useDebounce } from "@/hooks/useDebounce";

export default function UserManagement() {
  const [activeTab, setActiveTab] = useState<"users" | "whitelist">("users");
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<number | undefined>();
  const [userToToggle, setUserToToggle] = useState<UserAccount | null>(null);
  const [userToManageRoles, setUserToManageRoles] =
    useState<UserAccount | null>(null);
  const [editingWhitelistEntry, setEditingWhitelistEntry] =
    useState<WhitelistEntry | null>(null);
  const debounceSearch = useDebounce(search, 500);
  const navigate = useNavigate();
  const { triggerToast } = useToast();

  const { data, isLoading } = useUsers({
    page,
    page_size: 10,
    search: debounceSearch,
    role_id: roleFilter,
  });

  const { data: whitelistData, isLoading: isWhitelistLoading } = useWhitelist();

  const filteredWhitelist =
    whitelistData?.filter((entry) => {
      const matchesSearch = entry.email
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesRole =
        roleFilter === undefined ||
        entry.roles.some((r) => r.id === roleFilter);
      return matchesSearch && matchesRole;
    }) || [];

  const toggleStatusMutation = useToggleUserStatus();
  const updateRolesMutation = useUpdateUserRoles();
  const addWhitelistMutation = useAddUserToWhitelist();
  const removeWhitelistMutation = useRemoveUserFromWhitelist();

  const [isWhitelistOpen, setIsWhitelistOpen] = useState(false);
  const [userToRemoveWhitelist, setUserToRemoveWhitelist] = useState<
    string | null
  >(null);

  const handleWhitelist = async (email: string, roleIds: number[]) => {
    try {
      await addWhitelistMutation.mutateAsync({ email, roleIds });
      triggerToast(
        editingWhitelistEntry
          ? "Whitelist roles updated successfully"
          : "Email added to whitelist successfully",
      );
      setIsWhitelistOpen(false);
      setEditingWhitelistEntry(null);
    } catch (err: any) {
      triggerToast(getErrorMessage(err));
    }
  };

  const handleRemoveFromWhitelist = async () => {
    if (!userToRemoveWhitelist) return;
    try {
      await removeWhitelistMutation.mutateAsync(userToRemoveWhitelist);
      triggerToast("Email removed from whitelist successfully");
      setUserToRemoveWhitelist(null);
    } catch (err: any) {
      triggerToast(getErrorMessage(err));
    }
  };

  usePageMetadata({
    title: "User Management",
    badgeText: "System-wide Accounts",
    badgeIcon: <Users className="h-3 w-3" />,
    description:
      "Manage, audit, and secure all user accounts across the platform.",
  });

  const handleToggleStatus = async () => {
    if (!userToToggle) return;
    const action = userToToggle.isActive ? "block" : "unblock";
    try {
      await toggleStatusMutation.mutateAsync({ id: userToToggle.id, action });
      triggerToast(`User successfully ${action}ed`);
      setUserToToggle(null);
    } catch (err: any) {
      triggerToast(getErrorMessage(err));
    }
  };

  const handleUpdateRoles = async (
    roleIds: number[],
    reason: string,
    referenceId: string,
  ) => {
    if (!userToManageRoles) return;
    try {
      await updateRolesMutation.mutateAsync({
        userId: userToManageRoles.id,
        roleIds,
        reason,
        referenceId,
      });
      triggerToast("User roles updated successfully");
      setUserToManageRoles(null);
    } catch (err: any) {
      triggerToast(getErrorMessage(err));
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getRoleBadgeColor = (roleName: string) => {
    switch (roleName.toLowerCase()) {
      case "superadmin":
        return "bg-primary/10 text-primary border-primary/20";
      case "admin":
      case "counselor":
        return "bg-indigo-500/10 text-indigo-600 border-indigo-500/20";
      case "student":
        return "bg-secondary/10 text-secondary border-secondary/20";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const menuActions = (user: UserAccount) => [
    {
      id: "activity",
      label: "View Activity",
      icon: ArrowRight,
      onAction: () => navigate(`/superadmin/users/${user.id}/activity`),
    },
    {
      id: "sessions",
      label: "Audit Sessions",
      icon: ShieldAlert,
      onAction: () => navigate(`/superadmin/users/${user.id}/sessions`),
    },
    {
      id: "roles",
      label: "Manage Roles",
      icon: Shield,
      onAction: () => setUserToManageRoles(user),
    },
    {
      id: "status",
      label: user.isActive ? "Block Account" : "Unlock Account",
      icon: user.isActive ? UserX : UserCheck,
      onAction: () => setUserToToggle(user),
    },
    {
      id: "remove-whitelist",
      label: "Remove from Whitelist",
      icon: UserMinus,
      onAction: () => setUserToRemoveWhitelist(user.email),
    },
  ];

  return (
    <div className="mx-auto w-full max-w-[1700px] space-y-6">
      {/* Tabs */}
      <div className="flex border-b border-white/10 pb-1">
        <button
          onClick={() => setActiveTab("users")}
          className={cn(
            "border-b-2 px-6 py-2.5 text-sm font-semibold",
            "transition-all duration-200",
            activeTab === "users"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground " +
                  "hover:text-foreground",
          )}
        >
          Registered Users
        </button>
        <button
          onClick={() => setActiveTab("whitelist")}
          className={cn(
            "border-b-2 px-6 py-2.5 text-sm font-semibold",
            "transition-all duration-200",
            activeTab === "whitelist"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground " +
                  "hover:text-foreground",
          )}
        >
          Pending Whitelist
        </button>
      </div>

      {/* Search & Filters */}
      <div
        className={cn(
          "flex flex-col gap-4 lg:flex-row",
          "lg:items-center lg:justify-between",
        )}
      >
        <div
          className={cn(
            "flex flex-1 flex-col gap-3",
            "sm:flex-row sm:items-center",
          )}
        >
          <SearchInput
            hasHeader={false}
            placeholder="Search by name or email..."
            className="h-10 rounded-xl"
            searchTerm={search}
            onSearchChange={(e) => setSearch(e)}
          />

          <div
            className={cn(
              "flex items-center gap-2 rounded-xl",
              "border-glass-border bg-glass-bg p-2 shadow-md",
            )}
          >
            {[
              { roleId: undefined, label: "All Roles" },
              { roleId: 1, label: "Student" },
              { roleId: 2, label: "Admin" },
              { roleId: 3, label: "Superadmin" },
              { roleId: 4, label: "Developer" },
            ].map((role) => (
              <Button
                variant="outline"
                size="sm"
                key={role.label}
                onClick={() => setRoleFilter(role.roleId)}
                className={cn(
                  "h-10 rounded-xl border-none transition-all",
                  "duration-300 hover:text-foreground",
                  roleFilter === role.roleId
                    ? "bg-secondary text-secondary-foreground " +
                        "hover:bg-secondary hover:text-secondary-foreground" +
                        "hover:brightness-125"
                    : "hover:bg-white/10",
                )}
              >
                {role.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => setIsWhitelistOpen(true)}
            className={cn(
              "h-10 rounded-xl bg-primary text-primary-foreground",
              "flex items-center gap-2 hover:brightness-110",
            )}
          >
            <UserPlus size={16} />
            Whitelist Account
          </Button>
        </div>
      </div>

      {activeTab === "users" ? (
        <Card className="overflow-hidden">
          <CardHeader className="border-b border-white/10 pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Shield size={18} />
                </span>
                User Accounts
              </CardTitle>
              {data && (
                <Badge className="rounded-lg border border-border bg-card text-muted-foreground">
                  Total: {data?.meta?.total}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px] text-left text-sm">
                <thead>
                  <tr className="border-b border-white/10 bg-muted/30 px-6 py-4 text-xs font-semibold uppercase text-muted-foreground backdrop-blur-md">
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Joined Date</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <tr
                        key={i}
                        className="animate-pulse border-b border-white/5"
                      >
                        <td
                          colSpan={5}
                          className="h-10 bg-white/5 px-6 py-8"
                        />
                      </tr>
                    ))
                  ) : data?.users.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="py-20 text-center text-muted-foreground"
                      >
                        No users found matching your search.
                      </td>
                    </tr>
                  ) : (
                    data?.users.map((user) => (
                      <tr
                        key={user.id}
                        className="group border-b border-white/5 transition-colors hover:bg-white/20 dark:hover:bg-white/[0.02]"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3 text-left">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20 text-xs font-bold uppercase text-primary">
                              {user.firstName[0]}
                              {user.lastName[0]}
                            </div>
                            <div className="space-y-0.5">
                              <div className="font-semibold text-foreground">
                                {user.firstName} {user.lastName}{" "}
                                {user.suffixName && (
                                  <span> {user.suffixName}</span>
                                )}
                              </div>
                              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                <Mail size={12} />
                                {user.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {user.roles.map((role) => (
                              <Badge
                                key={role.id}
                                variant="outline"
                                className={cn(
                                  "rounded-full px-3 font-medium transition-all",
                                  getRoleBadgeColor(role.name),
                                )}
                              >
                                {role.name}
                              </Badge>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5 font-bold tracking-tight">
                            <div
                              className={cn(
                                "h-2 w-2 rounded-full",
                                user.isActive ? "bg-emerald-500" : "bg-primary",
                              )}
                            />
                            <span>{user.isActive ? "Active" : "Blocked"}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">
                          <div className="flex items-center gap-1.5">
                            <Calendar size={14} />
                            {formatDate(user.createdAt)}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-5 w-5 rounded-full hover:bg-muted hover:text-muted-foreground"
                              >
                                <MoreVertical size={16} />
                              </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent
                              align="end"
                              className="w-48 rounded-xl bg-card backdrop-blur-2xl"
                            >
                              {menuActions(user).map((item) => (
                                <DropdownMenuItem
                                  key={item.id}
                                  className="cursor-pointer gap-2 text-foreground focus:bg-muted focus:text-primary"
                                  onClick={item.onAction}
                                >
                                  <item.icon size={14} />
                                  {item.label}
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>

          {/* Pagination Section */}
          {data && data.meta.totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={data.meta.totalPages}
              onPageChange={setPage}
              isLoading={isLoading}
            />
          )}
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <CardHeader className="border-b border-white/10 pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Shield size={18} />
                </span>
                Pending Whitelist
              </CardTitle>
              <Badge
                variant="secondary"
                className="rounded-lg"
              >
                Total: {filteredWhitelist.length}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] text-left text-sm">
                <thead>
                  <tr
                    className={cn(
                      "border-b border-white/10 bg-muted/30 px-6 py-4",
                      "text-xs font-semibold uppercase text-muted-foreground",
                      "backdrop-blur-md",
                    )}
                  >
                    <th className="px-6 py-4">Email Address</th>
                    <th className="px-6 py-4">Pre-approved Roles</th>
                    <th className="px-6 py-4">Date Whitelisted</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {isWhitelistLoading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <tr
                        key={i}
                        className="animate-pulse border-b border-white/5"
                      >
                        <td className="px-6 py-4">
                          <div className="h-4 w-48 rounded bg-muted" />
                        </td>
                        <td className="px-6 py-4">
                          <div className="h-4 w-24 rounded bg-muted" />
                        </td>
                        <td className="px-6 py-4">
                          <div className="h-4 w-32 rounded bg-muted" />
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="ml-auto h-6 w-6 rounded bg-muted" />
                        </td>
                      </tr>
                    ))
                  ) : filteredWhitelist.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="py-20 text-center text-muted-foreground"
                      >
                        No pending whitelisted accounts found.
                      </td>
                    </tr>
                  ) : (
                    filteredWhitelist.map((entry) => (
                      <tr
                        key={entry.email}
                        className="border-b border-white/5 transition-colors hover:bg-muted/10"
                      >
                        <td className="px-6 py-4 font-medium text-foreground">
                          <div className="flex items-center gap-2">
                            <Mail
                              size={14}
                              className="text-muted-foreground"
                            />
                            {entry.email}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {entry.roles.map((role) => (
                              <Badge
                                key={role.id}
                                variant="outline"
                                className={cn(
                                  "rounded-full px-3 font-medium",
                                  "transition-all",
                                  getRoleBadgeColor(role.name),
                                )}
                              >
                                {role.name}
                              </Badge>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">
                          <div className="flex items-center gap-1.5">
                            <Calendar size={14} />
                            {formatDate(entry.createdAt)}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className={cn(
                                  "h-5 w-5 rounded-full hover:bg-muted",
                                  "hover:text-muted-foreground",
                                )}
                              >
                                <MoreVertical size={16} />
                              </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent
                              align="end"
                              className="w-48 rounded-xl bg-card backdrop-blur-2xl"
                            >
                              <DropdownMenuItem
                                className={cn(
                                  "cursor-pointer gap-2 text-foreground",
                                  "focus:bg-muted focus:text-primary",
                                )}
                                onClick={() => {
                                  setEditingWhitelistEntry(entry);
                                  setIsWhitelistOpen(true);
                                }}
                              >
                                <Shield size={14} />
                                Edit Roles
                              </DropdownMenuItem>
                              <DropdownMenuSeparator className="bg-white/10" />
                              <DropdownMenuItem
                                className={cn(
                                  "cursor-pointer gap-2 text-red-500",
                                  "hover:text-red-500 focus:bg-red-500/10",
                                  "focus:text-red-500",
                                )}
                                onClick={() =>
                                  setUserToRemoveWhitelist(entry.email)
                                }
                              >
                                <UserMinus size={14} />
                                Remove Whitelist
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Confirmation Dialog */}
      <AlertDialog
        open={!!userToToggle}
        onOpenChange={(open) => !open && setUserToToggle(null)}
      >
        <AlertDialogContent className="border-card bg-card">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {userToToggle?.isActive ? "Block" : "Unlock"} User Account?
            </AlertDialogTitle>
            <AlertDialogDescription>
              {userToToggle?.isActive
                ? `Blocking "${userToToggle.firstName} ${userToToggle.lastName}" will prevent them from accessing any platform features immediately.`
                : `Unlocking "${userToToggle?.firstName} ${userToToggle?.lastName}" will restore their full access to the platform.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleToggleStatus}
              className={cn(
                "rounded-xl text-white",
                userToToggle?.isActive
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-emerald-500 hover:bg-emerald-600",
              )}
            >
              {toggleStatusMutation.isPending
                ? "Processing..."
                : userToToggle?.isActive
                  ? "Block Account"
                  : "Unlock Account"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Role Management Modal */}
      <RoleManagementModal
        user={userToManageRoles}
        isOpen={!!userToManageRoles}
        onClose={() => setUserToManageRoles(null)}
        onUpdate={handleUpdateRoles}
        isUpdating={updateRolesMutation.isPending}
      />

      {/* Whitelist Modal */}
      <WhitelistModal
        isOpen={isWhitelistOpen}
        onClose={() => {
          setIsWhitelistOpen(false);
          setEditingWhitelistEntry(null);
        }}
        onWhitelist={handleWhitelist}
        isProcessing={addWhitelistMutation.isPending}
        initialEmail={editingWhitelistEntry?.email}
        initialRoleIds={editingWhitelistEntry?.roles.map((r) => r.id)}
      />

      {/* Remove Whitelist Alert Dialog */}
      <AlertDialog
        open={!!userToRemoveWhitelist}
        onOpenChange={(open) => !open && setUserToRemoveWhitelist(null)}
      >
        <AlertDialogContent className="border-card bg-card">
          <AlertDialogHeader>
            <AlertDialogTitle>Remove from Whitelist?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove "{userToRemoveWhitelist}" from the
              registration whitelist?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemoveFromWhitelist}
              className="rounded-xl bg-red-500 text-white hover:bg-red-600"
            >
              {removeWhitelistMutation.isPending ? "Removing..." : "Remove"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
