interface Student {
  id: string;
  studentId: string;
  name: string;
  course: string;
  email: string;
  phone: string;
  dateEnrolled: string;
  institutionType?: "Private" | "Public";
  numberOfSiblings?: number;
}

interface StudentDetailsModalProps {
  student: Student | null;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onClose: () => void;
}

export default function StudentDetailsModal({
  student,
  activeTab,
  onTabChange,
  onClose,
}: StudentDetailsModalProps) {
  if (!student) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-foreground hover:bg-gray-100 rounded transition-colors"
          >
            ← Back
          </button>
          <h2 className="text-lg font-semibold">{student.name}</h2>
          <div className="w-16"></div>
        </div>

        {/* Student Info Section */}
        <div className="p-6 border-b border-gray-200">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">Name</p>
              <p className="text-sm font-medium text-foreground">{student.name}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">Student ID</p>
              <p className="text-sm font-medium text-foreground">{student.studentId}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 bg-gray-50">
          {[
            { id: "personal", label: "Personal Info" },
            { id: "education", label: "Education" },
            { id: "family", label: "Family" },
            { id: "health", label: "Health" },
            { id: "notes", label: "Significant Notes" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-white border-b-2 border-primary text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === "personal" && (
            <div className="space-y-4">
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">Email</p>
                <p className="text-sm text-foreground">{student.email}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">Phone</p>
                <p className="text-sm text-foreground">{student.phone}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">Date Enrolled</p>
                <p className="text-sm text-foreground">{student.dateEnrolled}</p>
              </div>
            </div>
          )}

          {activeTab === "education" && (
            <div className="space-y-4">
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">Course</p>
                <p className="text-sm text-foreground">{student.course}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">Institution Type</p>
                <p className="text-sm text-foreground">{student.institutionType || "N/A"}</p>
              </div>
            </div>
          )}

          {activeTab === "family" && (
            <div className="space-y-4">
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">Number of Siblings</p>
                <p className="text-sm text-foreground">{student.numberOfSiblings ?? "N/A"}</p>
              </div>
              <p className="text-sm text-muted-foreground italic">More family information can be added here</p>
            </div>
          )}

          {activeTab === "health" && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground italic">Health information can be added here</p>
            </div>
          )}

          {activeTab === "notes" && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground italic">Significant notes can be added here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
