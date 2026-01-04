import { FormData, FormErrors } from "@/features/pds/types";

interface FamilyBackgroundProps {
  formData: FormData;
  errors: FormErrors;
  handleInputChange: (field: string, value: string | boolean) => void;
  clearError: (field: string) => void;
}

export function FamilyBackground({
  formData,
  errors,
  handleInputChange,
  clearError,
}: FamilyBackgroundProps) {
  return (
    <div className="space-y-6">
      <div className="border rounded-lg p-4 bg-gray-50">
        <h3 className="font-semibold text-gray-900 mb-4">
          Father's Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="e.g., John Doe"
            value={formData.fatherName}
            onChange={(e) => handleInputChange("fatherName", e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            type="text"
            placeholder="Age e.g., 45"
            value={formData.fatherAge}
            onChange={(e) => {
              handleInputChange("fatherAge", e.target.value);
              clearError("fatherAge");
            }}
            className={`px-4 py-3 border rounded focus:outline-none focus:ring-2 focus:ring-primary ${
              errors.fatherAge
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300"
            }`}
          />
          {errors.fatherAge && (
            <p className="text-red-500 text-xs mt-1">{errors.fatherAge}</p>
          )}
          <input
            type="text"
            placeholder="Educational Attainment"
            value={formData.fatherEducation}
            onChange={(e) =>
              handleInputChange("fatherEducation", e.target.value)
            }
            className="px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            type="text"
            placeholder="Occupation"
            value={formData.fatherOccupation}
            onChange={(e) =>
              handleInputChange("fatherOccupation", e.target.value)
            }
            className="px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            type="text"
            placeholder="Company"
            value={formData.fatherCompany}
            onChange={(e) => handleInputChange("fatherCompany", e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      <div className="border rounded-lg p-4 bg-gray-50">
        <h3 className="font-semibold text-gray-900 mb-4">
          Mother's Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="e.g., Jane Doe"
            value={formData.motherName}
            onChange={(e) => handleInputChange("motherName", e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            type="text"
            placeholder="Age e.g., 40"
            value={formData.motherAge}
            onChange={(e) => {
              handleInputChange("motherAge", e.target.value);
              clearError("motherAge");
            }}
            className={`px-4 py-3 border rounded focus:outline-none focus:ring-2 focus:ring-primary ${
              errors.motherAge
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300"
            }`}
          />
          {errors.motherAge && (
            <p className="text-red-500 text-xs mt-1">{errors.motherAge}</p>
          )}
          <input
            type="text"
            placeholder="Educational Attainment"
            value={formData.motherEducation}
            onChange={(e) =>
              handleInputChange("motherEducation", e.target.value)
            }
            className="px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            type="text"
            placeholder="Occupation"
            value={formData.motherOccupation}
            onChange={(e) =>
              handleInputChange("motherOccupation", e.target.value)
            }
            className="px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            type="text"
            placeholder="Company"
            value={formData.motherCompany}
            onChange={(e) => handleInputChange("motherCompany", e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      <div className="border rounded-lg p-4 bg-gray-50">
        <h3 className="font-semibold text-gray-900 mb-4">Parental Status</h3>
        <div className="space-y-3">
          {[
            "Married & Living Together",
            "Married but Living Separately",
            "Divorced",
            "Annulled",
            "Single Parent",
            "Father/Mother working abroad",
            "Deceased, please specify:",
          ].map((status) => (
            <label key={status} className="flex items-center gap-3">
              <input
                type="radio"
                name="parentalStatus"
                value={status}
                checked={formData.parentalStatus === status}
                onChange={(e) =>
                  handleInputChange("parentalStatus", e.target.value)
                }
                className="w-4 h-4 text-primary"
              />
              <span className="text-gray-700">{status}</span>
            </label>
          ))}
        </div>
        {formData.parentalStatus === "Deceased, please specify:" && (
          <input
            type="text"
            placeholder="Specify details"
            value={formData.parentalDetails}
            onChange={(e) =>
              handleInputChange("parentalDetails", e.target.value)
            }
            className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary mt-3"
          />
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block font-semibold text-gray-700 mb-2">
            Your Guardian's Name:
          </label>
          <input
            type="text"
            value={formData.guardianName}
            onChange={(e) => handleInputChange("guardianName", e.target.value)}
            placeholder="e.g., Mary Doe"
            className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label className="block font-semibold text-gray-700 mb-2">
            Address:
          </label>
          <input
            type="text"
            value={formData.guardianAddress}
            onChange={(e) =>
              handleInputChange("guardianAddress", e.target.value)
            }
            placeholder="e.g., Address of Guardian"
            className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      <div className="border rounded-lg p-4 bg-gray-50">
        <h3 className="font-semibold text-gray-900 mb-4">Family Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Siblings (Including you):
            </label>
            <input
              type="number"
              min="0"
              value={formData.siblings}
              onChange={(e) => {
                const val = e.target.value;
                if (val === "" || !val.startsWith("-")) {
                  handleInputChange("siblings", val);
                  clearError("siblings");
                }
              }}
              className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary ${
                errors.siblings
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300"
              }`}
            />
            {errors.siblings && (
              <p className="text-red-500 text-xs mt-1">{errors.siblings}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Brothers:
            </label>
            <input
              type="number"
              min="0"
              value={formData.brothers}
              onChange={(e) => {
                const val = e.target.value;
                if (val === "" || !val.startsWith("-")) {
                  handleInputChange("brothers", val);
                  clearError("brothers");
                }
              }}
              className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary ${
                errors.brothers
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300"
              }`}
            />
            {errors.brothers && (
              <p className="text-red-500 text-xs mt-1">{errors.brothers}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Sisters:
            </label>
            <input
              type="number"
              min="0"
              value={formData.sisters}
              onChange={(e) => {
                const val = e.target.value;
                if (val === "" || !val.startsWith("-")) {
                  handleInputChange("sisters", val);
                  clearError("sisters");
                }
              }}
              className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary ${
                errors.sisters
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300"
              }`}
            />
            {errors.sisters && (
              <p className="text-red-500 text-xs mt-1">{errors.sisters}</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block font-semibold text-gray-700 mb-2">
            How many are gainfully employed?
          </label>
          <input
            type="number"
            min="0"
            value={formData.gainfullyEmployed}
            onChange={(e) => {
              const val = e.target.value;
              if (val === "" || !val.startsWith("-")) {
                handleInputChange("gainfullyEmployed", val);
                clearError("gainfullyEmployed");
              }
            }}
            className={`w-full px-4 py-3 border rounded focus:outline-none focus:ring-2 focus:ring-primary ${
              errors.gainfullyEmployed
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300"
            }`}
          />
          {errors.gainfullyEmployed && (
            <p className="text-red-500 text-xs mt-1">
              {errors.gainfullyEmployed}
            </p>
          )}
        </div>
        <div>
          <label className="block font-semibold text-gray-700 mb-2">
            How many support your studies?
          </label>
          <input
            type="number"
            min="0"
            value={formData.supportStudies}
            onChange={(e) => {
              const val = e.target.value;
              if (val === "" || !val.startsWith("-")) {
                handleInputChange("supportStudies", val);
                clearError("supportStudies");
              }
            }}
            className={`w-full px-4 py-3 border rounded focus:outline-none focus:ring-2 focus:ring-primary ${
              errors.supportStudies
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300"
            }`}
          />
          {errors.supportStudies && (
            <p className="text-red-500 text-xs mt-1">{errors.supportStudies}</p>
          )}
        </div>
        <div>
          <label className="block font-semibold text-gray-700 mb-2">
            How many support your immediate family?
          </label>
          <input
            type="number"
            min="0"
            value={formData.supportFamily}
            onChange={(e) => {
              const val = e.target.value;
              if (val === "" || !val.startsWith("-")) {
                handleInputChange("supportFamily", val);
                clearError("supportFamily");
              }
            }}
            className={`w-full px-4 py-3 border rounded focus:outline-none focus:ring-2 focus:ring-primary ${
              errors.supportFamily
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300"
            }`}
          />
          {errors.supportFamily && (
            <p className="text-red-500 text-xs mt-1">{errors.supportFamily}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block font-semibold text-gray-700 mb-2">
            Please indicate other sources of financial support:
          </label>
          <input
            type="text"
            value={formData.financialSupport}
            onChange={(e) =>
              handleInputChange("financialSupport", e.target.value)
            }
            placeholder="e.g., Scholarship, Loan"
            className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label className="block font-semibold text-gray-700 mb-2">
            Your weekly school allowance:
          </label>
          <input
            type="text"
            value={formData.weeklyAllowance}
            onChange={(e) =>
              handleInputChange("weeklyAllowance", e.target.value)
            }
            className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      <div>
        <label className="block font-semibold text-gray-700 mb-2">
          Parents' Combined Total Monthly Income:
        </label>
        <div className="space-y-2">
          {[
            "Below P5,000",
            "P5,001 - P10,000",
            "P10,001 - P15,000",
            "P15,001 - P20,000",
            "P20,001 - P25,000",
            "P25,001 - P30,000",
            "P30,001 - P35,000",
            "P35,001 - P40,000",
            "P40,001 - P45,000",
            "P45,001 - P50,000",
            "Above P50,000",
            "Others, please specify:",
          ].map((range) => (
            <label key={range} className="flex items-center gap-3">
              <input
                type="radio"
                name="parentsIncome"
                value={range}
                checked={formData.parentsIncome === range}
                onChange={(e) =>
                  handleInputChange("parentsIncome", e.target.value)
                }
                className="w-4 h-4 text-primary"
              />
              <span className="text-gray-700 text-sm">{range}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
