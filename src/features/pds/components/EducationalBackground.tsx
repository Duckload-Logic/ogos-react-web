import { FormData } from "@/features/pds/types";

interface EducationalBackgroundProps {
  formData: FormData;
  handleInputChange: (field: string, value: string | boolean, section?: string) => void;
  clearError: (field: string) => void;
}

export function EducationalBackground({
  formData,
  handleInputChange,
  clearError,
}: EducationalBackgroundProps) {
  return (
    <div className="space-y-6">
      {[
        { key: "elementary", label: "Elementary" },
        { key: "juniorHS", label: "Junior HS" },
        { key: "seniorHS", label: "Senior HS" },
      ].map((level) => (
        <div
          key={level.key}
          className="border rounded-lg p-4 bg-gray-50"
        >
          <h3 className="font-semibold text-gray-900 mb-4">
            {level.label}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                School Name{" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g., ABC School"
                value={
                  (formData.education[
                    level.key as keyof typeof formData.education
                  ] as any).school
                }
                onChange={(e) => {
                  handleInputChange(
                    "school",
                    e.target.value,
                    level.key,
                  );
                  clearError(`${level.key}_school`);
                }}
                className={`w-full px-3 py-2 border rounded text-sm focus:outline-none focus:ring-2 transition ${
                  !(formData.education[
                    level.key as keyof typeof formData.education
                  ] as any).school
                    ? "border-red-400 focus:ring-red-500 focus:ring-2"
                    : "border-gray-300 focus:ring-primary"
                }`}
              />
              {!(formData.education[
                level.key as keyof typeof formData.education
              ] as any).school && (
                <p className="text-red-500 text-xs mt-1 font-medium">
                  Required
                </p>
              )}
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Location <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g., Manila"
                value={
                  (formData.education[
                    level.key as keyof typeof formData.education
                  ] as any).location
                }
                onChange={(e) => {
                  handleInputChange(
                    "location",
                    e.target.value,
                    level.key,
                  );
                  clearError(`${level.key}_location`);
                }}
                className={`w-full px-3 py-2 border rounded text-sm focus:outline-none focus:ring-2 transition ${
                  !(formData.education[
                    level.key as keyof typeof formData.education
                  ] as any).location
                    ? "border-red-400 focus:ring-red-500 focus:ring-2"
                    : "border-gray-300 focus:ring-primary"
                }`}
              />
              {!(formData.education[
                level.key as keyof typeof formData.education
              ] as any).location && (
                <p className="text-red-500 text-xs mt-1 font-medium">
                  Required
                </p>
              )}
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                School Type{" "}
                <span className="text-red-500">*</span>
              </label>
              <select
                value={
                  (formData.education[
                    level.key as keyof typeof formData.education
                  ] as any).public
                }
                onChange={(e) => {
                  handleInputChange(
                    "public",
                    e.target.value,
                    level.key,
                  );
                  clearError(`${level.key}_public`);
                }}
                className={`w-full px-3 py-2 border rounded text-sm focus:outline-none focus:ring-2 transition ${
                  !(formData.education[
                    level.key as keyof typeof formData.education
                  ] as any).public
                    ? "border-red-400 focus:ring-red-500 focus:ring-2"
                    : "border-gray-300 focus:ring-primary"
                }`}
              >
                <option value="">Select Type</option>
                <option value="Public">Public</option>
                <option value="Private">Private</option>
              </select>
              {!(formData.education[
                level.key as keyof typeof formData.education
              ] as any).public && (
                <p className="text-red-500 text-xs mt-1 font-medium">
                  Required
                </p>
              )}
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Year Graduated{" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                placeholder="e.g., 2020"
                value={
                  (formData.education[
                    level.key as keyof typeof formData.education
                  ] as any).yearGrad
                }
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "" || !val.startsWith("-")) {
                    handleInputChange("yearGrad", val, level.key);
                    clearError(`${level.key}_yearGrad`);
                  }
                }}
                className={`w-full px-3 py-2 border rounded text-sm focus:outline-none focus:ring-2 transition ${
                  !(formData.education[
                    level.key as keyof typeof formData.education
                  ] as any).yearGrad
                    ? "border-red-400 focus:ring-red-500 focus:ring-2"
                    : "border-gray-300 focus:ring-primary"
                }`}
              />
              {!(formData.education[
                level.key as keyof typeof formData.education
              ] as any).yearGrad && (
                <p className="text-red-500 text-xs mt-1 font-medium">
                  Required
                </p>
              )}
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Awards
              </label>
              <input
                type="text"
                placeholder="e.g., Best Student, Scholarship (optional)"
                value={
                  (formData.education[
                    level.key as keyof typeof formData.education
                  ] as any).awards
                }
                onChange={(e) =>
                  handleInputChange(
                    "awards",
                    e.target.value,
                    level.key,
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>
      ))}

      <div>
        <label className="pds-label mb-2">
          Others:
        </label>
        <input
          type="text"
          value={formData.education.others}
          onChange={(e) =>
            handleInputChange("others", e.target.value, "others")
          }
          placeholder="Name of School (optional)"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
    </div>
  );
}
