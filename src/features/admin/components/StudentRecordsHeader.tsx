import { Plus, Clock } from "lucide-react";

interface StudentRecordsHeaderProps {
  onAddClick: () => void;
  showRecords: number;
  totalRecords: number;
}

export default function StudentRecordsHeader({
  onAddClick,
  showRecords,
  totalRecords,
}: StudentRecordsHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold text-foreground">
          Students IIR Page
        </h2>
        <p className="text-sm text-muted-foreground">
          {showRecords} of {totalRecords} student record
          {totalRecords !== 1 && "s"}
        </p>
      </div>
    </div>
  );
}
