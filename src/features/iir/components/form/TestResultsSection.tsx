import { forwardRef, useImperativeHandle, useState } from "react";
import { Check } from "lucide-react";

interface FormErrors {
  [key: string]: string;
}

interface TestResultsSectionRef {
  validate: () => { isValid: boolean; errors: FormErrors };
}

export const TestResultsSection = forwardRef<
  TestResultsSectionRef,
  {
    testResults: any;
    onChange: (path: string, value: any) => void;
  }
>(function TestResultsSection({ testResults, onChange }, ref) {
  const [errors, setErrors] = useState<FormErrors>({});

  const validate = (): { isValid: boolean; errors: FormErrors } => {
    // Test results section has no required validation
    const sectionErrors: FormErrors = {};
    setErrors(sectionErrors);
    return {
      isValid: true,
      errors: sectionErrors,
    };
  };

  useImperativeHandle(ref, () => ({
    validate,
  }));

  const clearError = (field: string) => {
    setErrors((prev) => {
      const updated = { ...prev };
      delete updated[field];
      return updated;
    });
  };

  const handleInputChange = (fieldPath: string, value: any) => {
    onChange(fieldPath, value);
    clearError(fieldPath);
  };

  // Pre-populate exactly 3 empty rows
  const preparedRows = (testResults || []).length > 0 
    ? testResults 
    : [{}, {}, {}];

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border border-black dark:border-foreground">
        {/* Header Row */}
        <thead>
          <tr>
            <th className="w-32 border border-black dark:border-foreground bg-gray-300 dark:bg-gray-700 px-3 py-2 text-left text-xs font-bold text-black dark:text-white uppercase">
              DATE
            </th>
            <th className="w-48 border border-black dark:border-foreground bg-gray-300 dark:bg-gray-700 px-3 py-2 text-left text-xs font-bold text-black dark:text-white uppercase">
              NAME OF TEST
            </th>
            <th className="w-16 border border-black dark:border-foreground bg-gray-300 dark:bg-gray-700 px-3 py-2 text-left text-xs font-bold text-black dark:text-white uppercase">
              RS
            </th>
            <th className="w-16 border border-black dark:border-foreground bg-gray-300 dark:bg-gray-700 px-3 py-2 text-left text-xs font-bold text-black dark:text-white uppercase">
              PR
            </th>
            <th className="flex-1 border border-black dark:border-foreground bg-gray-300 dark:bg-gray-700 px-3 py-2 text-left text-xs font-bold text-black dark:text-white uppercase">
              DESCRIPTION
            </th>
          </tr>
        </thead>

        {/* Data Rows */}
        <tbody>
          {preparedRows.map((row: any, idx: number) => (
            <tr key={idx}>
              {/* Date Cell */}
              <td className="border border-black dark:border-foreground p-0 h-12">
                <div className="relative h-full">
                  <input
                    type="date"
                    value={row?.date || ""}
                    onChange={(e) =>
                      handleInputChange(`testResults.${idx}.date`, e.target.value)
                    }
                    className="w-full h-full px-2 py-1 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500"
                  />
                  {row?.date && (
                    <Check
                      size={14}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-teal-600 dark:text-teal-400 pointer-events-none"
                      strokeWidth={3}
                    />
                  )}
                </div>
              </td>

              {/* Name of Test Cell */}
              <td className="border border-black dark:border-foreground p-0 h-12">
                <div className="relative h-full">
                  <input
                    type="text"
                    value={row?.nameOfTest || ""}
                    onChange={(e) =>
                      handleInputChange(
                        `testResults.${idx}.nameOfTest`,
                        e.target.value
                      )
                    }
                    className="w-full h-full px-2 py-1 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500"
                  />
                  {row?.nameOfTest && (
                    <Check
                      size={14}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-teal-600 dark:text-teal-400 pointer-events-none"
                      strokeWidth={3}
                    />
                  )}
                </div>
              </td>

              {/* RS Cell */}
              <td className="border border-black dark:border-foreground p-0 h-12">
                <div className="relative h-full">
                  <input
                    type="number"
                    value={row?.rs ?? ""}
                    onChange={(e) =>
                      handleInputChange(`testResults.${idx}.rs`, e.target.value)
                    }
                    className="w-full h-full px-2 py-1 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500"
                  />
                  {row?.rs !== undefined && row?.rs !== "" && (
                    <Check
                      size={14}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-teal-600 dark:text-teal-400 pointer-events-none"
                      strokeWidth={3}
                    />
                  )}
                </div>
              </td>

              {/* PR Cell */}
              <td className="border border-black dark:border-foreground p-0 h-12">
                <div className="relative h-full">
                  <input
                    type="number"
                    value={row?.pr ?? ""}
                    onChange={(e) =>
                      handleInputChange(`testResults.${idx}.pr`, e.target.value)
                    }
                    className="w-full h-full px-2 py-1 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500"
                  />
                  {row?.pr !== undefined && row?.pr !== "" && (
                    <Check
                      size={14}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-teal-600 dark:text-teal-400 pointer-events-none"
                      strokeWidth={3}
                    />
                  )}
                </div>
              </td>

              {/* Description Cell */}
              <td className="border border-black dark:border-foreground p-0 h-12">
                <div className="relative h-full">
                  <input
                    type="text"
                    value={row?.description || ""}
                    onChange={(e) =>
                      handleInputChange(
                        `testResults.${idx}.description`,
                        e.target.value
                      )
                    }
                    className="w-full h-full px-2 py-1 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500"
                  />
                  {row?.description && (
                    <Check
                      size={14}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-teal-600 dark:text-teal-400 pointer-events-none"
                      strokeWidth={3}
                    />
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});
