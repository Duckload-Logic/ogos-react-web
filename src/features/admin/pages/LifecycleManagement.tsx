import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  GraduationCap,
  Archive,
  UserCheck,
  CheckSquare,
  Square,
  Search,
  ChevronDown,
  AlertTriangle,
  X,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCourses, useIIRPagination, useStudentStatuses } from "@/features/iir/hooks";
import { Course, IIRProfileView } from "@/features/iir/types";
import { iirService } from "@/features/iir/services/service";
import { useDebounce } from "@/hooks/useDebounce";
import { Spinner } from "@/components/shared";
import { Pagination } from "@/components/shared";
import Layout, { usePageMetadata } from "@/components/layout/Layout";
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
import { Input } from "@/components/ui/input";

// --- Constants ---------------------------------------------------------------

const CURRENT_YEAR = new Date().getFullYear();
const DIPLOMA_PREFIX = ["DIT", "DOMT"]; // codes from the seed

type SelectionMode = "none" | "page" | "all";

interface PendingAction {
  type: "graduate" | "archive" | "active";
  label: string;
  statusId: number;
  needsYear: boolean;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function isEligibleForGraduation(student: IIRProfileView): boolean {
  const code = student.course?.code?.toUpperCase() ?? "";
  const isDiploma = DIPLOMA_PREFIX.some((p) => code.startsWith(p));
  const isBachelor = code.startsWith("BS");
  return (
    (isDiploma && student.yearLevel === 3) ||
    (isBachelor && student.yearLevel === 4)
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function SelectionBanner({
  mode,
  pageCount,
  totalCount,
  onSelectAll,
  onClearAll,
}: {
  mode: SelectionMode;
  pageCount: number;
  totalCount: number;
  onSelectAll: () => void;
  onClearAll: () => void;
}) {
  if (mode === "none") return null;

  return (
    <div className="flex items-center justify-between px-4 py-2.5 rounded-2xl bg-primary/5 border border-primary/20 text-sm font-medium mb-2 animate-in fade-in duration-300">
      <span className="text-primary">
        {mode === "all"
          ? `All ${totalCount} matching students selected`
          : `${pageCount} students on this page selected`}
      </span>
      <div className="flex items-center gap-3">
        {mode === "page" && totalCount > pageCount && (
          <button
            onClick={onSelectAll}
            className="text-xs font-bold text-primary underline-offset-2 hover:underline"
          >
            Select all {totalCount} matching students
          </button>
        )}
        <button onClick={onClearAll} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors">
          <X size={12} /> Clear
        </button>
      </div>
    </div>
  );
}

function StudentRow({
  student,
  isSelected,
  onToggle,
}: {
  student: IIRProfileView;
  isSelected: boolean;
  onToggle: () => void;
}) {
  const navigate = useNavigate();

  const statusColors: Record<number, string> = {
    1: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20",
    2: "text-purple-600 bg-purple-500/10 border-purple-500/20",
    3: "text-amber-600 bg-amber-500/10 border-amber-500/20",
    4: "text-slate-500 bg-slate-500/10 border-slate-500/20",
    5: "text-red-600 bg-red-500/10 border-red-500/20",
  };

  return (
    <div
      className={cn(
        "grid grid-cols-[auto_1fr_auto] gap-4 items-center px-5 py-4 rounded-2xl border transition-all duration-200 cursor-pointer hover:bg-glass-bg/40",
        isSelected
          ? "border-primary/30 bg-primary/[0.02]"
          : "border-glass-border bg-glass-bg/20"
      )}
      onClick={onToggle}
    >
      {/* Checkbox */}
      <div
        className={cn(
          "h-5 w-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200",
          isSelected
            ? "bg-primary border-primary"
            : "border-glass-border bg-white/5"
        )}
      >
        {isSelected && (
          <div className="h-2 w-2 rounded-[2px] bg-white" />
        )}
      </div>

      {/* Student info */}
      <div className="grid grid-cols-[2fr_1.5fr_1fr_1fr] gap-3 min-w-0">
        <div className="min-w-0">
          <p className="font-semibold text-sm truncate">
            {student.lastName}, {student.firstName}{" "}
            {student.middleName ?? ""}
          </p>
          <p className="text-[11px] text-muted-foreground truncate">
            {student.email}
          </p>
        </div>
        <p className="text-xs text-muted-foreground self-center truncate">
          {student.course?.name ?? "—"}
        </p>
        <p className="text-xs text-center self-center text-muted-foreground">
          Year {student.yearLevel}
        </p>
        <div className="self-center flex justify-center">
          <span
            className={cn(
              "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
              statusColors[student.status?.id ?? 1]
            )}
          >
            {student.status?.name ?? "Active"}
          </span>
        </div>
      </div>

      {/* View link — stops propagation so clicking it doesn't toggle selection */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/admin/student-records/${student.iirId}`, {
            state: { student },
          });
        }}
        className="text-[11px] font-bold text-primary/50 hover:text-primary transition-colors uppercase tracking-wider"
      >
        View
      </button>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function LifecycleManagement() {
  const { data: courses } = useCourses();

  // Filters
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [courseId, setCourseId] = useState(0);
  const [yearLevel, setYearLevel] = useState(0);
  const [enrollYear, setEnrollYear] = useState(0);
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const { data, isLoading } = useIIRPagination({
    page,
    pageSize,
    search: debouncedSearch,
    courseId,
    yearLevel,
    statusId: 1, // Default: Active students only for lifecycle management
  });

  const students: IIRProfileView[] = data?.students ?? [];
  const total: number = data?.total ?? 0;
  const totalPages: number = data?.meta?.totalPages ?? 1;

  // Selection state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [excludedIds, setExcludedIds] = useState<Set<string>>(new Set());
  const [selectionMode, setSelectionMode] = useState<SelectionMode>("none");

  const effectivelySelectedCount =
    selectionMode === "all" ? total - excludedIds.size : selectedIds.size;

  function toggleStudent(id: string) {
    if (selectionMode === "all") {
      // In "select all total" mode, toggling removes from selection (exclusion)
      setExcludedIds((prev) => {
        const next = new Set(prev);
        next.has(id) ? next.delete(id) : next.add(id);
        return next;
      });
      return;
    }
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      const nextMode =
        next.size === students.length ? "page" : next.size > 0 ? "page" : "none";
      setSelectionMode(nextMode);
      return next;
    });
  }

  function selectPage() {
    setSelectedIds(new Set(students.map((s) => s.iirId)));
    setSelectionMode("page");
    setExcludedIds(new Set());
  }

  function selectAllTotal() {
    setSelectionMode("all");
    setSelectedIds(new Set());
    setExcludedIds(new Set());
  }

  function clearAll() {
    setSelectedIds(new Set());
    setExcludedIds(new Set());
    setSelectionMode("none");
  }

  function isStudentSelected(id: string): boolean {
    if (selectionMode === "all") return !excludedIds.has(id);
    return selectedIds.has(id);
  }

  // Graduation eligibility check on current selection
  const ineligibleCount = useMemo(() => {
    const visible = students.filter((s) => isStudentSelected(s.iirId));
    return visible.filter((s) => !isEligibleForGraduation(s)).length;
  }, [students, selectedIds, excludedIds, selectionMode]); // eslint-disable-line

  // Bulk action flow
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);
  const [graduationYear, setGraduationYear] = useState(CURRENT_YEAR);
  const [isProcessing, setIsProcessing] = useState(false);
  const [destructiveWarning, setDestructiveWarning] = useState(false);

  function initiateAction(action: PendingAction) {
    if (action.type === "graduate" && ineligibleCount > 0) {
      setPendingAction(action);
      setDestructiveWarning(true);
      return;
    }
    setPendingAction(action);
  }

  async function confirmAction() {
    if (!pendingAction) return;
    setIsProcessing(true);
    setDestructiveWarning(false);

    try {
      await iirService.bulkUpdateStudentStatus({
        iirIds: selectionMode === "all" ? undefined : [...selectedIds],
        excludedIirIds: selectionMode === "all" ? [...excludedIds] : undefined,
        selectAllMatching: selectionMode === "all",
        statusId: pendingAction.statusId,
        graduationYear:
          pendingAction.needsYear ? graduationYear : undefined,
        filters: {
          search: debouncedSearch,
          courseId,
          yearLevel,
          enrollYear,
        },
      });
      clearAll();
      setPage(1);
    } catch {
      alert("Failed to update students. Please try again.");
    } finally {
      setIsProcessing(false);
      setPendingAction(null);
    }
  }

  usePageMetadata({
    title: "Records Lifecycle",
    description: "Bulk manage student record statuses — graduation, archival, and more.",
    badgeText: "Admin Management",
    badgeIcon: <GraduationCap className="h-4 w-4" />,
    isLoading,
  });

  const enrollYears = Array.from({ length: 6 }, (_, i) => CURRENT_YEAR - i);

  return (
    <>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">

        {/* ── Filters ─────────────────────────────────────── */}
        <div className="bg-glass-bg backdrop-blur-glass rounded-3xl border border-glass-border p-6 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative sm:col-span-2 lg:col-span-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by name or student number…"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="w-full pl-9 pr-4 h-11 rounded-xl border border-glass-border bg-white/5 text-sm focus:outline-none focus:border-primary/30 transition-colors"
              />
            </div>

            {/* Course */}
            <div className="relative">
              <select
                value={courseId}
                onChange={(e) => { setCourseId(Number(e.target.value)); setPage(1); }}
                className="w-full h-11 rounded-xl border border-glass-border bg-white/5 text-sm px-3 pr-8 appearance-none focus:outline-none focus:border-primary/30 transition-colors"
              >
                <option value={0}>All Courses</option>
                {courses?.map((c: Course) => (
                  <option key={c.id} value={c.id}>{c.code}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>

            {/* Year Level */}
            <div className="relative">
              <select
                value={yearLevel}
                onChange={(e) => { setYearLevel(Number(e.target.value)); setPage(1); }}
                className="w-full h-11 rounded-xl border border-glass-border bg-white/5 text-sm px-3 pr-8 appearance-none focus:outline-none focus:border-primary/30 transition-colors"
              >
                <option value={0}>All Year Levels</option>
                <option value={1}>1st Year</option>
                <option value={2}>2nd Year</option>
                <option value={3}>3rd Year</option>
                <option value={4}>4th Year</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>

            {/* Enrollment year */}
            <div className="relative">
              <select
                value={enrollYear}
                onChange={(e) => { setEnrollYear(Number(e.target.value)); setPage(1); }}
                className="w-full h-11 rounded-xl border border-glass-border bg-white/5 text-sm px-3 pr-8 appearance-none focus:outline-none focus:border-primary/30 transition-colors"
              >
                <option value={0}>All Enrollment Years</option>
                {enrollYears.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>
        </div>

        {/* ── List ────────────────────────────────────────── */}
        <div className="relative min-h-[400px]">
          {isLoading && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-glass-bg/5 backdrop-blur-[2px] rounded-[32px]">
              <Spinner size="lg" />
            </div>
          )}

          <div className={cn("space-y-2 transition-all duration-500", isLoading && "opacity-40 blur-[1px] pointer-events-none")}>
            {/* Header row */}
            <div className="grid grid-cols-[auto_1fr_auto] gap-4 items-center px-5 py-2">
              {/* Select All Page toggle */}
              <button
                onClick={selectionMode === "page" && selectedIds.size === students.length ? clearAll : selectPage}
                className="h-5 w-5 flex items-center justify-center"
              >
                {selectionMode !== "none" && selectedIds.size === students.length ? (
                  <CheckSquare size={16} className="text-primary" />
                ) : (
                  <Square size={16} className="text-muted-foreground" />
                )}
              </button>

              <div className="grid grid-cols-[2fr_1.5fr_1fr_1fr] gap-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Student</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Course</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground text-center">Year</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground text-center">Status</p>
              </div>

              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-0 select-none">View</p>
            </div>

            <SelectionBanner
              mode={selectionMode}
              pageCount={selectedIds.size}
              totalCount={total}
              onSelectAll={selectAllTotal}
              onClearAll={clearAll}
            />

            {students.length === 0 && !isLoading ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <Users className="h-16 w-16 text-muted-foreground/20 mb-4" />
                <p className="text-lg font-bold text-muted-foreground">No students found</p>
                <p className="text-sm text-muted-foreground/60 mt-1">Try adjusting your filters</p>
              </div>
            ) : (
              students.map((s) => (
                <StudentRow
                  key={s.iirId}
                  student={s}
                  isSelected={isStudentSelected(s.iirId)}
                  onToggle={() => toggleStudent(s.iirId)}
                />
              ))
            )}

            {/* Pagination */}
            <div className="flex justify-between items-center pt-4 px-1">
              <p className="text-xs text-muted-foreground">
                {total} total records
              </p>
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Floating Bulk Action Bar ─────────────────────── */}
      {effectivelySelectedCount > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-xl px-4 animate-in fade-in slide-in-from-bottom-6 duration-400">
          <div className="bg-glass-bg/90 backdrop-blur-xl border border-primary/20 rounded-3xl shadow-2xl overflow-hidden">
            <div className="px-5 py-3 border-b border-glass-border/40 flex items-center gap-3">
              <div className="h-7 w-7 rounded-xl bg-primary flex items-center justify-center text-white text-xs font-bold">
                {effectivelySelectedCount > 99 ? "99+" : effectivelySelectedCount}
              </div>
              <p className="text-sm font-bold">
                {selectionMode === "all" ? "All matching" : effectivelySelectedCount} students selected
              </p>
              <button onClick={clearAll} className="ml-auto text-muted-foreground hover:text-destructive transition-colors">
                <X size={14} />
              </button>
            </div>

            <div className="flex items-center justify-center gap-2 p-3">
              <button
                onClick={() => initiateAction({ type: "graduate", label: "Graduate", statusId: 2, needsYear: true })}
                disabled={isProcessing}
                className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500 text-emerald-600 hover:text-white border border-emerald-500/20 transition-all duration-300 text-xs font-bold uppercase tracking-wider disabled:opacity-40"
              >
                <GraduationCap size={15} />
                Graduate
              </button>

              <button
                onClick={() => initiateAction({ type: "archive", label: "Archive", statusId: 4, needsYear: false })}
                disabled={isProcessing}
                className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-500/10 hover:bg-amber-500 text-amber-600 hover:text-white border border-amber-500/20 transition-all duration-300 text-xs font-bold uppercase tracking-wider disabled:opacity-40"
              >
                <Archive size={15} />
                Archive
              </button>

              <button
                onClick={() => initiateAction({ type: "active", label: "Set Active", statusId: 1, needsYear: false })}
                disabled={isProcessing}
                className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-primary/10 hover:bg-primary text-primary hover:text-white border border-primary/20 transition-all duration-300 text-xs font-bold uppercase tracking-wider disabled:opacity-40"
              >
                <UserCheck size={15} />
                Set Active
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Destructive Warning Modal ────────────────────── */}
      <AlertDialog open={destructiveWarning} onOpenChange={setDestructiveWarning}>
        <AlertDialogContent className="rounded-3xl border-amber-500/20 bg-glass-bg backdrop-blur-xl max-w-md">
          <AlertDialogHeader>
            <div className="flex items-start gap-4 mb-2">
              <div className="h-12 w-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 flex-shrink-0">
                <AlertTriangle size={26} />
              </div>
              <div>
                <AlertDialogTitle className="text-lg font-bold leading-tight">
                  Some students aren't ready to graduate
                </AlertDialogTitle>
              </div>
            </div>
            <AlertDialogDescription asChild>
              <div className="space-y-3 text-sm leading-relaxed">
                <p>
                  Your selection includes <strong className="text-amber-600">{ineligibleCount} student{ineligibleCount !== 1 ? "s" : ""}</strong> who have not yet reached their final year.
                </p>
                <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-3 text-xs text-amber-700">
                  <p className="font-semibold mb-1">Graduation is only valid for:</p>
                  <ul className="list-disc list-inside space-y-0.5">
                    <li>Diploma programs — 3rd Year students</li>
                    <li>Bachelor's programs — 4th Year students</li>
                  </ul>
                </div>
                <p className="text-muted-foreground">
                  If you continue, <strong>only eligible students</strong> will be graduated.
                  Ineligible students will be skipped automatically. This action <strong>cannot be undone</strong> — graduated records are permanently locked.
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>

          {pendingAction?.needsYear && (
            <div className="py-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">
                Graduation Year
              </label>
              <Input
                type="number"
                value={graduationYear}
                onChange={(e) => setGraduationYear(Number(e.target.value))}
                min={2000}
                max={2100}
                className="h-11 rounded-xl border-primary/10 bg-white/5 focus:border-primary/30"
              />
            </div>
          )}

          <AlertDialogFooter className="gap-2 mt-2">
            <AlertDialogCancel className="rounded-xl border-glass-border hover:bg-glass-bg/50">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmAction}
              disabled={isProcessing}
              className="rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold px-6 shadow-lg shadow-amber-500/20"
            >
              {isProcessing ? "Processing…" : "Graduate Eligible Students"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ── Confirm Modal (Archive / Active) ─────────────── */}
      <AlertDialog
        open={!!pendingAction && !destructiveWarning}
        onOpenChange={(open) => !open && setPendingAction(null)}
      >
        <AlertDialogContent className="rounded-3xl border-glass-border bg-glass-bg backdrop-blur-xl max-w-sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm — {pendingAction?.label}</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to mark{" "}
              <strong>{effectivelySelectedCount} student{effectivelySelectedCount !== 1 ? "s" : ""}</strong> as{" "}
              <strong>{pendingAction?.label}</strong>.
              {pendingAction?.type === "archive" && (
                <> This will lock their records from further edits.</>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>

          {pendingAction?.needsYear && (
            <div className="py-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">
                Graduation Year
              </label>
              <Input
                type="number"
                value={graduationYear}
                onChange={(e) => setGraduationYear(Number(e.target.value))}
                min={2000}
                max={2100}
                className="h-11 rounded-xl border-primary/10 bg-white/5 focus:border-primary/30"
              />
            </div>
          )}

          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="rounded-xl border-glass-border hover:bg-glass-bg/50">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmAction}
              disabled={isProcessing}
              className="rounded-xl bg-primary text-white font-bold"
            >
              {isProcessing ? "Processing…" : "Confirm"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
