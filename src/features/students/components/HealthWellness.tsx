import { FormData } from "@/types";

interface HealthWellnessProps {
  formData: FormData;
  handleInputChange: (field: string, value: string | boolean) => void;
}

export function HealthWellness({
  formData,
  handleInputChange,
}: HealthWellnessProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-gray-900 mb-4">
          A. Physical
        </h3>
        <div className="border rounded-lg p-4 overflow-x-auto">
          <table className="w-full text-sm">
            <tbody>
              {[
                { key: "vision", label: "Vision" },
                { key: "hearing", label: "Hearing" },
                {
                  key: "mobility",
                  label: "Mobility/Physical Disability",
                },
                { key: "speech", label: "Speech" },
                { key: "generalHealth", label: "General Health" },
              ].map(({ key, label }) => (
                <tr key={key} className={`border-b ${
                  formData[key as keyof typeof formData] === "" ||
                  formData[key as keyof typeof formData] === undefined
                    ? "bg-red-50"
                    : ""
                }`}>
                  <td className="py-3 px-2 font-semibold text-gray-900">
                    {label} {(formData[key as keyof typeof formData] === "" ||
                    formData[key as keyof typeof formData] === undefined) && (
                      <span className="text-red-500">*</span>
                    )}
                  </td>
                  <td className="py-3 px-2 text-center">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={key}
                        value="No problem"
                        checked={
                          formData[
                            key as keyof typeof formData
                          ] === "No problem"
                        }
                        onChange={(e) =>
                          handleInputChange(key, e.target.value)
                        }
                        className="w-4 h-4"
                      />
                      <span className="text-sm">No problem</span>
                    </label>
                  </td>
                  <td className="py-3 px-2 text-center">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={key}
                        value="Issue"
                        checked={
                          formData[
                            key as keyof typeof formData
                          ] === "Issue"
                        }
                        onChange={(e) =>
                          handleInputChange(key, e.target.value)
                        }
                        className="w-4 h-4"
                      />
                      <span className="text-sm">Issue</span>
                    </label>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="border rounded-lg p-4 bg-gray-50">
        <h3 className="font-semibold text-gray-900 mb-4">
          B. Psychological Consultations (Only if applicable)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Consulted With e.g., Dr. Smith"
            value={formData.consultedWith}
            onChange={(e) =>
              handleInputChange("consultedWith", e.target.value)
            }
            className="px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            type="text"
            placeholder="What Reason e.g., Stress"
            value={formData.consultReason}
            onChange={(e) =>
              handleInputChange("consultReason", e.target.value)
            }
            className="px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            type="text"
            placeholder="When Started"
            value={formData.whenStarted}
            onChange={(e) =>
              handleInputChange("whenStarted", e.target.value)
            }
            className="px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            type="number"
            min="0"
            placeholder="Number of Sessions"
            value={formData.numSessions}
            onChange={(e) => {
              const val = e.target.value;
              if (val === "" || !val.startsWith("-")) {
                handleInputChange("numSessions", val);
              }
            }}
            className="px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>
    </div>
  );
}
