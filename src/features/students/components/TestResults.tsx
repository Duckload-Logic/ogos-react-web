import { StudentRecord } from "@/types";

interface TestResultsProps {
  formData: StudentRecord;
  handleInputChange: (field: string, value: string | boolean) => void;
}

export function TestResults({
  formData,
  handleInputChange,
}: TestResultsProps) {
  return (
    <div className="space-y-6">
      <div className="border rounded-lg p-4 bg-gray-50">
        <h3 className="font-semibold text-gray-900 mb-4">
          Test Results
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <input
            type="date"
            placeholder="Date"
            value={formData.dateTest}
            onChange={(e) =>
              handleInputChange("dateTest", e.target.value)
            }
            className="px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            type="text"
            placeholder="Test Administered"
            value={formData.testAdministered}
            onChange={(e) =>
              handleInputChange(
                "testAdministered",
                e.target.value,
              )
            }
            className="px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            type="text"
            placeholder="RS"
            value={formData.rs}
            onChange={(e) =>
              handleInputChange("rs", e.target.value)
            }
            className="px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            type="text"
            placeholder="PR"
            value={formData.pr}
            onChange={(e) =>
              handleInputChange("pr", e.target.value)
            }
            className="px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            type="text"
            placeholder="Description"
            value={formData.description}
            onChange={(e) =>
              handleInputChange("description", e.target.value)
            }
            className="px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>
    </div>
  );
}
