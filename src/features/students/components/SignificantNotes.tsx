import { FormData } from "@/types";

interface SignificantNotesProps {
  formData: FormData;
  handleInputChange: (field: string, value: string | boolean) => void;
}

export function SignificantNotes({
  formData,
  handleInputChange,
}: SignificantNotesProps) {
  return (
    <div className="space-y-6">
      <div className="border rounded-lg p-4 bg-gray-50">
        <h3 className="font-semibold text-gray-900 mb-4">
          VI. Significant Notes (For Guidance Counselors Only)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input
            type="date"
            placeholder="Date"
            value={formData.significantNotesDate}
            onChange={(e) =>
              handleInputChange(
                "significantNotesDate",
                e.target.value,
              )
            }
            className="px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            type="text"
            placeholder="Incident e.g., Counseling"
            value={formData.incident}
            onChange={(e) =>
              handleInputChange("incident", e.target.value)
            }
            className="px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            type="text"
            placeholder="Remarks e.g., Follow-up required"
            value={formData.remarks}
            onChange={(e) =>
              handleInputChange("remarks", e.target.value)
            }
            className="px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>
    </div>
  );
}
