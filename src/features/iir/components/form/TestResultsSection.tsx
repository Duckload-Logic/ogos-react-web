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

  // Always show exactly 3 rows, filling from existing data
  const preparedRows = Array.from({ length: 3 }, (_, i) => (testResults || [])[i] || {});

  return (
    <Card className="bg-card border border-border overflow-hidden">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            {/* Header Row */}
            <thead>
              <tr className="bg-muted">
                <th className="w-36 border-b border-r border-border px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Date
                </th>
                <th className="border-b border-r border-border px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Name of Test
                </th>
                <th className="w-20 border-b border-r border-border px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  RS
                </th>
                <th className="w-20 border-b border-r border-border px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  PR
                </th>
                <th className="border-b border-border px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Description
                </th>
              </tr>
            </thead>

            {/* Data Rows */}
            <tbody>
              {preparedRows.map((row: any, idx: number) => (
                <tr key={idx} className={idx % 2 === 0 ? "bg-card" : "bg-muted/30"}>
                  {/* Date Cell */}
                  <td className="border-b border-r border-border p-0 h-12">
                    <div className="relative h-full">
                      <input
                        type="date"
                        value={row?.date || ""}
                        onChange={(e) =>
                          handleInputChange(`testResults.${idx}.date`, e.target.value)
                        }
                        className="w-full h-full px-3 py-2 bg-transparent text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary/30 transition-colors"
                      />
                      {row?.date && (
                        <Check size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-green-500 pointer-events-none" strokeWidth={2.5} />
                      )}
                    </div>
                  </td>

                  {/* Name of Test Cell */}
                  <td className="border-b border-r border-border p-0 h-12">
                    <div className="relative h-full">
                      <input
                        type="text"
                        value={row?.nameOfTest || ""}
                        placeholder="Enter test name"
                        onChange={(e) =>
                          handleInputChange(`testResults.${idx}.nameOfTest`, e.target.value)
                        }
                        className="w-full h-full px-3 py-2 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary/30 transition-colors"
                      />
                      {row?.nameOfTest && (
                        <Check size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-green-500 pointer-events-none" strokeWidth={2.5} />
                      )}
                    </div>
                  </td>

                  {/* RS Cell */}
                  <td className="border-b border-r border-border p-0 h-12">
                    <div className="relative h-full">
                      <input
                        type="text"
                        inputMode="numeric"
                        value={row?.rs ?? ""}
                        placeholder="0"
                        onChange={(e) =>
                          handleInputChange(`testResults.${idx}.rs`, e.target.value.replace(/[^0-9]/g, ""))
                        }
                        className="w-full h-full px-3 py-2 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary/30 transition-colors"
                      />
                      {row?.rs !== undefined && row?.rs !== "" && (
                        <Check size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-green-500 pointer-events-none" strokeWidth={2.5} />
                      )}
                    </div>
                  </td>

                  {/* PR Cell */}
                  <td className="border-b border-r border-border p-0 h-12">
                    <div className="relative h-full">
                      <input
                        type="text"
                        inputMode="numeric"
                        value={row?.pr ?? ""}
                        placeholder="0"
                        onChange={(e) =>
                          handleInputChange(`testResults.${idx}.pr`, e.target.value.replace(/[^0-9]/g, ""))
                        }
                        className="w-full h-full px-3 py-2 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary/30 transition-colors"
                      />
                      {row?.pr !== undefined && row?.pr !== "" && (
                        <Check size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-green-500 pointer-events-none" strokeWidth={2.5} />
                      )}
                    </div>
                  </td>

                  {/* Description Cell */}
                  <td className="border-b border-border p-0 h-12">
                    <div className="relative h-full">
                      <input
                        type="text"
                        value={row?.description || ""}
                        placeholder="Enter description"
                        onChange={(e) =>
                          handleInputChange(`testResults.${idx}.description`, e.target.value)
                        }
                        className="w-full h-full px-3 py-2 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary/30 transition-colors"
                      />
                      {row?.description && (
                        <Check size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-green-500 pointer-events-none" strokeWidth={2.5} />
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
