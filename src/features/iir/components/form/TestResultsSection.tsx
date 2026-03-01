import { forwardRef, useImperativeHandle, useState } from "react";
import { Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

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

  // Ensure testResults is an array with at least 3 rows
  const rows = testResults || [{}, {}, {}];
  const preparedRows = [...rows];
  while (preparedRows.length < 3) {
    preparedRows.push({});
  }

  return (
    <Card className="bg-white border border-gray-200">
      <CardContent className="pt-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-300">
                <th className="px-4 py-3 text-left text-sm font-bold text-foreground w-48">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-sm font-bold text-foreground min-w-44">
                  Name of Test
                </th>
                <th className="px-4 py-3 text-left text-sm font-bold text-foreground w-20">
                  RS
                </th>
                <th className="px-4 py-3 text-left text-sm font-bold text-foreground w-20">
                  PR
                </th>
                <th className="px-4 py-3 text-left text-sm font-bold text-foreground">
                  Description
                </th>
              </tr>
            </thead>
            <tbody>
              {preparedRows.map((row: any, idx: number) => (
                <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                  {/* Date Column */}
                  <td className="px-4 py-3">
                    <div className="relative">
                      <input
                        type="date"
                        value={row?.date || ""}
                        onChange={(e) =>
                          handleInputChange(
                            `testResults.${idx}.date`,
                            e.target.value
                          )
                        }
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors duration-200 text-sm ${
                          row?.date
                            ? "bg-white border-green-500 focus:border-green-500 focus:ring-green-200"
                            : "bg-white border-red-500 focus:border-red-500 focus:ring-red-200"
                        }`}
                      />
                      {row?.date && (
                        <Check
                          size={16}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500"
                          strokeWidth={2.5}
                        />
                      )}
                    </div>
                  </td>

                  {/* Name of Test Column */}
                  <td className="px-4 py-3">
                    <div className="relative">
                      <input
                        type="text"
                        value={row?.nameOfTest || ""}
                        onChange={(e) =>
                          handleInputChange(
                            `testResults.${idx}.nameOfTest`,
                            e.target.value
                          )
                        }
                        placeholder="e.g., SAT"
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors duration-200 text-sm ${
                          row?.nameOfTest
                            ? "bg-white border-green-500 focus:border-green-500 focus:ring-green-200"
                            : "bg-white border-red-500 focus:border-red-500 focus:ring-red-200"
                        }`}
                      />
                      {row?.nameOfTest && (
                        <Check
                          size={16}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500"
                          strokeWidth={2.5}
                        />
                      )}
                    </div>
                  </td>

                  {/* RS (Raw Score) Column */}
                  <td className="px-4 py-3">
                    <div className="relative">
                      <input
                        type="number"
                        value={row?.rs ?? ""}
                        onChange={(e) =>
                          handleInputChange(`testResults.${idx}.rs`, e.target.value)
                        }
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors duration-200 text-sm ${
                          row?.rs !== undefined && row?.rs !== ""
                            ? "bg-white border-green-500 focus:border-green-500 focus:ring-green-200"
                            : "bg-white border-red-500 focus:border-red-500 focus:ring-red-200"
                        }`}
                      />
                      {row?.rs !== undefined && row?.rs !== "" && (
                        <Check
                          size={16}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500"
                          strokeWidth={2.5}
                        />
                      )}
                    </div>
                  </td>

                  {/* PR (Percentile Rank) Column */}
                  <td className="px-4 py-3">
                    <div className="relative">
                      <input
                        type="number"
                        value={row?.pr ?? ""}
                        onChange={(e) =>
                          handleInputChange(`testResults.${idx}.pr`, e.target.value)
                        }
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors duration-200 text-sm ${
                          row?.pr !== undefined && row?.pr !== ""
                            ? "bg-white border-green-500 focus:border-green-500 focus:ring-green-200"
                            : "bg-white border-red-500 focus:border-red-500 focus:ring-red-200"
                        }`}
                      />
                      {row?.pr !== undefined && row?.pr !== "" && (
                        <Check
                          size={16}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500"
                          strokeWidth={2.5}
                        />
                      )}
                    </div>
                  </td>

                  {/* Description Column */}
                  <td className="px-4 py-3">
                    <div className="relative">
                      <input
                        type="text"
                        value={row?.description || ""}
                        onChange={(e) =>
                          handleInputChange(
                            `testResults.${idx}.description`,
                            e.target.value
                          )
                        }
                        placeholder="Notes"
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors duration-200 text-sm ${
                          row?.description
                            ? "bg-white border-green-500 focus:border-green-500 focus:ring-green-200"
                            : "bg-white border-red-500 focus:border-red-500 focus:ring-red-200"
                        }`}
                      />
                      {row?.description && (
                        <Check
                          size={16}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500"
                          strokeWidth={2.5}
                        />
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
});
