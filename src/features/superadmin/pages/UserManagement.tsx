import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Users,
  ShieldAlert,
  MoreVertical,
  UserCheck,
  UserX,
  Mail,
  Calendar,
  Filter,
  Shield,
  ArrowRight,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { usePageMetadata } from "@/context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
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
import { useUsers, useToggleUserStatus } from "../hooks";
import type { UserAccount } from "../types";
import { SearchInput } from "@/components/form";
import { useDebounce } from "@/hooks/useDebounce";

export default function UserManagement() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<number | undefined>();
  const [userToToggle, setUserToToggle] = useState<UserAccount | null>(null);
  const debounceSearch = useDebounce(search, 500);
  const navigate = useNavigate();

  const { data, isLoading } = useUsers({
    page,
    page_size: 10,
    search: debounceSearch,
    role_id: roleFilter,
  });

  const toggleStatusMutation = useToggleUserStatus();

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
    await toggleStatusMutation.mutateAsync({ id: userToToggle.id, action });
    setUserToToggle(null);
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
      case "counselor":
        return "bg-indigo-500/10 text-indigo-600 border-indigo-500/20";
      case "student":
        return "bg-secondary/10 text-secondary border-secondary/20";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <div className="mx-auto w-full max-w-[1700px] space-y-6">
      {/* Search & Filters */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          <SearchInput
            hasHeader={false}
            placeholder="Search by name or email..."
            className="h-10 rounded-xl"
            searchTerm={debounceSearch}
            onSearchChange={setSearch}
          />

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setRoleFilter(undefined)}
              className={`h-10 rounded-xl border-white/20 backdrop-blur-md ${!roleFilter ? "bg-white/60" : ""}`}
            >
              All Roles
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setRoleFilter(1)} // 1 is Student
              className={`h-10 rounded-xl border-white/20 backdrop-blur-md ${roleFilter === 1 ? "bg-white/60" : ""}`}
            >
              Students
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setRoleFilter(2)} // 2 is Counselor
              className={`h-10 rounded-xl border-white/20 backdrop-blur-md ${roleFilter === 2 ? "bg-white/60" : ""}`}
            >
              Counselors
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setRoleFilter(3)} // 3 is Superadmin
              className={`h-10 rounded-xl border-white/20 backdrop-blur-md ${roleFilter === 3 ? "bg-white/60" : ""}`}
            >
              Superadmins
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setRoleFilter(4)} // 4 is Developer
              className={`h-10 rounded-xl border-white/20 backdrop-blur-md ${roleFilter === 4 ? "bg-white/60" : ""}`}
            >
              Developers
            </Button>
          </div>
        </div>
      </div>

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
              <Badge
                variant="secondary"
                className="rounded-lg"
              >
                Total: {data.total}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/30 px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground backdrop-blur-md">
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
                        <Badge
                          variant="outline"
                          className={`rounded-full px-3 font-medium transition-all ${getRoleBadgeColor(user.role.name)}`}
                        >
                          {user.role.name}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 font-bold tracking-tight">
                          <div
                            className={`h-2 w-2 rounded-full ${user.isActive ? "bg-emerald-500" : "bg-primary"}`}
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
                              className="h-9 w-9 rounded-xl"
                            >
                              <MoreVertical size={16} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="w-48 rounded-xl border-white/20 backdrop-blur-2xl"
                          >
                            <DropdownMenuItem
                              className="gap-2 focus:bg-primary/10"
                              onClick={() =>
                                navigate(
                                  `/superadmin/users/${user.id}/activity`,
                                )
                              }
                            >
                              <ArrowRight size={14} />
                              View Activity
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="gap-2 focus:bg-primary/10"
                              onClick={() =>
                                navigate(
                                  `/superadmin/users/${user.id}/sessions`,
                                )
                              }
                            >
                              <ShieldAlert size={14} />
                              Audit Sessions
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-white/10" />
                            <DropdownMenuItem
                              className={`gap-2 focus:bg-${user.isActive ? "red" : "emerald"}-500/10 text-${user.isActive ? "red" : "emerald"}-500 font-medium`}
                              onClick={() => setUserToToggle(user)}
                            >
                              {user.isActive ? (
                                <>
                                  <UserX size={14} />
                                  Block Account
                                </>
                              ) : (
                                <>
                                  <UserCheck size={14} />
                                  Unlock Account
                                </>
                              )}
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

        {/* Pagination Section */}
        {data && data.total > 10 && (
          <div className="flex items-center justify-between border-t border-white/10 px-6 py-4 backdrop-blur-md">
            <p className="text-xs italic text-muted-foreground">
              Showing page {page} of {Math.ceil(data.total / 10)}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-9 rounded-xl border-white/20"
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeft size={16} />
              </Button>

              {Array.from({ length: Math.ceil(data.total / 10) }).map(
                (_, i) => (
                  <Button
                    key={i}
                    variant={page === i + 1 ? "default" : "outline"}
                    size="sm"
                    className={`h-9 w-9 rounded-xl ${page === i + 1 ? "shadow-lg" : "border-white/20"}`}
                    onClick={() => setPage(i + 1)}
                  >
                    {i + 1}
                  </Button>
                ),
              )}

              <Button
                variant="outline"
                size="sm"
                className="h-9 rounded-xl border-white/20"
                disabled={page === Math.ceil(data.total / 10)}
                onClick={() =>
                  setPage((p) => Math.min(Math.ceil(data.total / 10), p + 1))
                }
              >
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Confirmation Dialog */}
      <AlertDialog
        open={!!userToToggle}
        onOpenChange={(open) => !open && setUserToToggle(null)}
      >
        <AlertDialogContent className="dark:bg-neutral-900/92 border-white/20 bg-white/85 backdrop-blur-2xl dark:border-white/10">
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
              className={`rounded-xl ${userToToggle?.isActive ? "bg-red-500 hover:bg-red-600" : "bg-emerald-500 hover:bg-emerald-600"} text-white`}
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
    </div>
  );
}
