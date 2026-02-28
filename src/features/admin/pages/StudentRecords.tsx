import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { hashId } from "@/lib/hash";
import StudentRecordsHeader from "../components/StudentRecordsHeader";
import StudentSearchAndFilter from "../components/StudentSearchAndFilter";
import StudentCardsGrid from "../components/StudentCardsGrid";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useCourses, useGenders, useIIRPagination } from "@/features/iir/hooks";
import { IIRProfileView } from "@/features/iir/types/studentProfileView";
import { useDebounce } from "@/hooks/useDebounce";
import { LoadingSpinner } from "@/components/shared";
import { Pagination } from "@/components/Pagination";

export default function StudentRecords() {
  const {
    data: courses,
    isLoading: isCoursesLoading,
    isError: isCoursesError,
  } = useCourses();
  const {
    data: genders,
    isLoading: isGendersLoading,
    isError: isGendersError,
  } = useGenders();
  const yearLevels = [
    { id: 1, name: "1st Year" },
    { id: 2, name: "2nd Year" },
    { id: 3, name: "3rd Year" },
    { id: 4, name: "4th Year" },
  ];

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [selectedCourseId, setSelectedCourseId] = useState(0);
  const [selectedGenderId, setSelectedGenderId] = useState(0);
  const [selectedYearLevelId, setSelectedYearLevelId] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);

  const {
    data,
    isLoading: isStudentsLoading,
    isError: isStudentsError,
    error: studentsError,
  } = useIIRPagination({
    page,
    pageSize,
    search: debouncedSearch,
    courseId: selectedCourseId,
    genderId: selectedGenderId,
    yearLevel: selectedYearLevelId,
  });

  const allStudents = data?.students || [];
  const totalRecords = data?.total || 0;

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<IIRProfileView | null>(
    null,
  );
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const navigate = useNavigate();

  if (isCoursesLoading || isGendersLoading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <div className="space-y-6">
        <StudentRecordsHeader
          onAddClick={() => setShowAdd(true)}
          showRecords={allStudents.length}
          totalRecords={totalRecords}
        />
        <StudentSearchAndFilter
          searchTerm={searchTerm}
          onSearchChange={(value) => {
            if (value === searchTerm) return;
            setSearchTerm(value);
            setPage(1);
          }}
          courses={courses}
          selectedCourseId={selectedCourseId}
          onCourseChange={(id) => {
            if (id === selectedCourseId) return;
            setSelectedCourseId(id);
            setPage(1);
          }}
          genders={genders}
          selectedGenderId={selectedGenderId}
          onGenderChange={(id) => {
            if (id === selectedGenderId) return;
            setSelectedGenderId(id);
            setPage(1);
          }}
          yearLevels={yearLevels}
          selectedYearLevelId={selectedYearLevelId}
          onYearLevelChange={(level) => {
            if (level === selectedYearLevelId) return;
            setSelectedYearLevelId(level);
            setPage(1);
          }}
        />
        {isStudentsLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            <StudentCardsGrid
              students={allStudents}
              isStudentsLoading={isStudentsLoading}
              onViewClick={(student) => {
                const hashedId = encodeURIComponent(
                  hashId(String(student.iirId)),
                );
                navigate(`/admin/student-records/${hashedId}`, {
                  state: { student },
                });
              }}
              onDeleteClick={(student) => {
                setStudentToDelete(student);
                setDeleteConfirmOpen(true);
              }}
              yearLevels={yearLevels}
            />
            <Pagination
              currentPage={page}
              totalPages={data?.totalPages || 1}
              onPageChange={setPage}
            />
          </>
        )}
      </div>
      {/* <AddStudentModal
        isOpen={showAdd}
        onClose={() => {
          setShowAdd(false);
          form.reset();
        }}
        onSubmit={onSubmit}
        courses={courses}
      /> */}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Student Record</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the student record for{" "}
              {studentToDelete?.firstName} {studentToDelete?.lastName}? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          {deleteError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{deleteError}</AlertDescription>
            </Alert>
          )}

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              // onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
