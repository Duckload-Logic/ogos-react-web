import { Plus, Clock } from "lucide-react";

interface StudentRecordsHeaderProps {
  onAddClick: () => void;
}

export default function StudentRecordsHeader({
  onAddClick,
}: StudentRecordsHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-bold text-foreground">List of Students</h2>
      <div className="flex items-center gap-3">
        <button className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium">
          <Clock size={18} />
          History
        </button>
        <button
          onClick={onAddClick}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
        >
          <Plus size={18} />
          Add Student
        </button>
      </div>
    </div>
  );
}
