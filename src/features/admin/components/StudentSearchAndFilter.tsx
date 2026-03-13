import { DropdownField, SearchInput } from "@/components/form";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@radix-ui/react-label";
import { ChevronDownIcon, X } from "lucide-react";

interface SearchFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  // Specific course props
  courses: any[];
  selectedCourseId: number;
  onCourseChange: (id: number) => void;
  // Specific gender props
  genders: any[];
  selectedGenderId: number;
  onGenderChange: (id: number) => void;
  // Specific year props
  yearLevels: any[];
  selectedYearLevelId: number;
  onYearLevelChange: (level: number) => void;
}

export default function StudentSearchAndFilter({
  searchTerm,
  onSearchChange,
  courses,
  selectedCourseId,
  onCourseChange,
  genders,
  selectedGenderId,
  onGenderChange,
  yearLevels,
  selectedYearLevelId,
  onYearLevelChange,
}: SearchFilterProps) {
  return (
    <div className="bg-card rounded-lg shadow border border-border p-6 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
        <SearchInput
          className="md:col-span-2"
          searchTerm={searchTerm}
          onSearchChange={onSearchChange}
          placeholder="Search by name, email, or student number..."
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 w-full md:col-span-1 items-center justify-center">
          <DropdownField
            label="Course"
            value={selectedCourseId}
            onChange={onCourseChange}
            options={[{ id: 0, name: "All Courses" }, ...courses]}
          />
          <DropdownField
            label="Gender"
            value={selectedGenderId}
            onChange={onGenderChange}
            options={[{ id: 0, name: "All Genders" }, ...genders]}
          />
          <DropdownField
            label="Year Level"
            value={selectedYearLevelId}
            onChange={onYearLevelChange}
            options={[{ id: 0, name: "All Year Levels" }, ...yearLevels]}
          />
        </div>
      </div>
    </div>
  );
}
