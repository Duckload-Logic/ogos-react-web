import { forwardRef, useImperativeHandle, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { InputField } from "@/components/form";

interface FormErrors {
  [key: string]: string;
}

interface TestResultsSectionRef {
  validate: () => { isValid: boolean; errors: FormErrors };
}

export const TestResultsSection = forwardRef<
  TestResultsSectionRef,
  {
    testResults: any[];
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
  return (
    <div className="space-y-4">
      {testResults?.map((test: any, idx: number) => (
        <Card key={idx} className="bg-gray-50 border-l-4 border-l-indigo-500">
          <CardContent className="pt-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="Test Name"
                value={test.testName || ""}
                onChange={(val) =>
                  handleInputChange(`testResults.${idx}.testName`, val)
                }
                placeholder="e.g., SAT, ACE"
              />
              <InputField
                label="Test Date"
                type="date"
                value={test.testDate || ""}
                onChange={(val) =>
                  handleInputChange(`testResults.${idx}.testDate`, val)
                }
              />
              <InputField
                label="Raw Score"
                value={test.rawScore || ""}
                onChange={(val) =>
                  handleInputChange(`testResults.${idx}.rawScore`, val)
                }
                placeholder="Score"
              />
              <InputField
                label="Percentile"
                value={test.percentile || ""}
                onChange={(val) =>
                  handleInputChange(`testResults.${idx}.percentile`, val)
                }
                placeholder="Percentile"
              />
              <InputField
                label="Description"
                isTextarea
                value={test.description || ""}
                onChange={(val) =>
                  handleInputChange(`testResults.${idx}.description`, val)
                }
                placeholder="Test description or notes"
              />
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="text-red-600 hover:bg-red-50"
              onClick={() => {
                const updated = testResults.filter(
                  (_: any, i: number) => i !== idx,
                );
                handleInputChange("testResults", updated);
              }}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Remove
            </Button>
          </CardContent>
        </Card>
      ))}
      <Button
        variant="outline"
        className="w-full"
        onClick={() =>
          handleInputChange("testResults", [
            ...(testResults || []),
            {
              testDate: "",
              testName: "",
              rawScore: "",
              percentile: "",
              description: "",
            },
          ])
        }
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Test Result
      </Button>
    </div>
  );
});
