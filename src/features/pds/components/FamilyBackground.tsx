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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <label className="pds-label mb-2">
              Father's Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g., John Doe"
              value={formData.fatherName}
              onChange={(e) => {
                handleInputChange("fatherName", e.target.value);
                clearError("fatherName");
              }}
              className={`w-full px-4 py-3 border rounded focus:outline-none focus:ring-2 transition ${
                !formData.fatherName
                  ? "border-red-400 focus:ring-red-500"
                  : "border-gray-300 focus:ring-primary"
              }`}
            />
            {!formData.fatherName && (
              <p className="text-red-500 text-xs mt-1 font-medium">Required</p>
            )}
          </div>
          <div>
            <label className="pds-label mb-2">
              Age <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g., 45"
              value={formData.fatherAge}
              onChange={(e) => {
                handleInputChange("fatherAge", e.target.value);
                clearError("fatherAge");
              }}
              className={`w-full px-4 py-3 border rounded focus:outline-none focus:ring-2 transition ${
                !formData.fatherAge
                  ? "border-red-400 focus:ring-red-500"
                  : errors.fatherAge
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-primary"
              }`}
            />
            {!formData.fatherAge && (
              <p className="text-red-500 text-xs mt-1 font-medium">Required</p>
            )}
            {errors.fatherAge && (
              <p className="text-red-500 text-xs mt-1">{errors.fatherAge}</p>
            )}
          </div>
          <div>
            <label className="pds-label mb-2">
              Educational Attainment <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g., Bachelor's"
              value={formData.fatherEducation}
              onChange={(e) => {
                handleInputChange("fatherEducation", e.target.value);
                clearError("fatherEducation");
              }}
              className={`w-full px-4 py-3 border rounded focus:outline-none focus:ring-2 transition ${
                !formData.fatherEducation
                  ? "border-red-400 focus:ring-red-500"
                  : "border-gray-300 focus:ring-primary"
              }`}
            />
            {!formData.fatherEducation && (
              <p className="text-red-500 text-xs mt-1 font-medium">Required</p>
            )}
          </div>
          <div>
            <label className="pds-label mb-2">
              Occupation <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g., Engineer"
              value={formData.fatherOccupation}
              onChange={(e) => {
                handleInputChange("fatherOccupation", e.target.value);
                clearError("fatherOccupation");
              }}
              className={`w-full px-4 py-3 border rounded focus:outline-none focus:ring-2 transition ${
                !formData.fatherOccupation
                  ? "border-red-400 focus:ring-red-500"
                  : "border-gray-300 focus:ring-primary"
              }`}
            />
            {!formData.fatherOccupation && (
              <p className="text-red-500 text-xs mt-1 font-medium">Required</p>
            )}
          </div>
          <div className="md:col-span-2">
            <label className="pds-label mb-2">
              Company <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g., ABC Corporation"
              value={formData.fatherCompany}
              onChange={(e) => {
                handleInputChange("fatherCompany", e.target.value);
                clearError("fatherCompany");
              }}
              className={`w-full px-4 py-3 border rounded focus:outline-none focus:ring-2 transition ${
                !formData.fatherCompany
                  ? "border-red-400 focus:ring-red-500"
                  : "border-gray-300 focus:ring-primary"
              }`}
            />
            {!formData.fatherCompany && (
              <p className="text-red-500 text-xs mt-1 font-medium">Required</p>
            )}
          </div>
        </div>
      </div>

      <div className="border rounded-lg p-4 bg-gray-50">
        <h3 className="font-semibold text-gray-900 mb-4">
          Mother's Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <label className="pds-label mb-2">
              Mother's Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g., Jane Doe"
              value={formData.motherName}
              onChange={(e) => {
                handleInputChange("motherName", e.target.value);
                clearError("motherName");
              }}
              className={`w-full px-4 py-3 border rounded focus:outline-none focus:ring-2 transition ${
                !formData.motherName
                  ? "border-red-400 focus:ring-red-500"
                  : "border-gray-300 focus:ring-primary"
              }`}
            />
            {!formData.motherName && (
              <p className="text-red-500 text-xs mt-1 font-medium">Required</p>
            )}
          </div>
          <div>
            <label className="pds-label mb-2">
              Age <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g., 40"
              value={formData.motherAge}
              onChange={(e) => {
                handleInputChange("motherAge", e.target.value);
                clearError("motherAge");
              }}
              className={`w-full px-4 py-3 border rounded focus:outline-none focus:ring-2 transition ${
                !formData.motherAge
                  ? "border-red-400 focus:ring-red-500"
                  : errors.motherAge
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-primary"
              }`}
            />
            {!formData.motherAge && (
              <p className="text-red-500 text-xs mt-1 font-medium">Required</p>
            )}
            {errors.motherAge && (
              <p className="text-red-500 text-xs mt-1">{errors.motherAge}</p>
            )}
          </div>
          <div>
            <label className="pds-label mb-2">
              Educational Attainment <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g., Bachelor's"
              value={formData.motherEducation}
              onChange={(e) => {
                handleInputChange("motherEducation", e.target.value);
                clearError("motherEducation");
              }}
              className={`w-full px-4 py-3 border rounded focus:outline-none focus:ring-2 transition ${
                !formData.motherEducation
                  ? "border-red-400 focus:ring-red-500"
                  : "border-gray-300 focus:ring-primary"
              }`}
            />
            {!formData.motherEducation && (
              <p className="text-red-500 text-xs mt-1 font-medium">Required</p>
            )}
          </div>
          <div>
            <label className="pds-label mb-2">
              Occupation <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g., Teacher"
              value={formData.motherOccupation}
              onChange={(e) => {
                handleInputChange("motherOccupation", e.target.value);
                clearError("motherOccupation");
              }}
              className={`w-full px-4 py-3 border rounded focus:outline-none focus:ring-2 transition ${
                !formData.motherOccupation
                  ? "border-red-400 focus:ring-red-500"
                  : "border-gray-300 focus:ring-primary"
              }`}
            />
            {!formData.motherOccupation && (
              <p className="text-red-500 text-xs mt-1 font-medium">Required</p>
            )}
          </div>
          <div className="md:col-span-2">
            <label className="pds-label mb-2">
              Company <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g., ABC School"
              value={formData.motherCompany}
              onChange={(e) => {
                handleInputChange("motherCompany", e.target.value);
                clearError("motherCompany");
              }}
              className={`w-full px-4 py-3 border rounded focus:outline-none focus:ring-2 transition ${
                !formData.motherCompany
                  ? "border-red-400 focus:ring-red-500"
                  : "border-gray-300 focus:ring-primary"
              }`}
            />
            {!formData.motherCompany && (
              <p className="text-red-500 text-xs mt-1 font-medium">Required</p>
            )}
          </div>
        </div>
      </div>

      <div className={`border rounded-lg p-4 ${
        formData.parentalStatus ? "bg-gray-50" : "bg-red-50"
      }`}>
        <h3 className="font-semibold text-gray-900 mb-4">
          Parental Status <span className="text-red-500">*</span>
        </h3>
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
          <label className="pds-label mb-2">
            Your Guardian's Name: <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.guardianName}
            onChange={(e) => handleInputChange("guardianName", e.target.value)}
            placeholder="e.g., Mary Doe"
            className={`w-full px-4 py-3 border rounded focus:outline-none focus:ring-2 transition ${
              !formData.guardianName
                ? "border-red-400 focus:ring-red-500"
                : "border-gray-300 focus:ring-primary"
            }`}
          />
          {!formData.guardianName && (
            <p className="text-red-500 text-xs mt-1 font-medium">Required</p>
          )}
        </div>
        <div>
          <label className="pds-label mb-2">
            Address: <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.guardianAddress}
            onChange={(e) =>
              handleInputChange("guardianAddress", e.target.value)
            }
            placeholder="e.g., Address of Guardian"
            className={`w-full px-4 py-3 border rounded focus:outline-none focus:ring-2 transition ${
              !formData.guardianAddress
                ? "border-red-400 focus:ring-red-500"
                : "border-gray-300 focus:ring-primary"
            }`}
          />
          {!formData.guardianAddress && (
            <p className="text-red-500 text-xs mt-1 font-medium">Required</p>
          )}
        </div>
      </div>

      <div className="border rounded-lg p-4 bg-gray-50">
        <h3 className="font-semibold text-gray-900 mb-4">Family Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Siblings (Including you): <span className="text-red-500">*</span>
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
              className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 transition ${
                !formData.siblings
                  ? "border-red-400 focus:ring-red-500"
                  : errors.siblings
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-primary"
              }`}
            />
            {!formData.siblings && (
              <p className="text-red-500 text-xs mt-1 font-medium">Required</p>
            )}
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
              className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 transition ${
                formData.brothers === ""
                  ? "border-red-400 focus:ring-red-500"
                  : errors.brothers
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-primary"
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
              className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 transition ${
                formData.sisters === ""
                  ? "border-red-400 focus:ring-red-500"
                  : errors.sisters
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-primary"
              }`}
            />
            {errors.sisters && (
              <p className="text-red-500 text-xs mt-1">{errors.sisters}</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-2">
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
            className={`w-full px-4 py-3 border rounded focus:outline-none focus:ring-2 transition ${
              !formData.gainfullyEmployed
                ? "border-red-400 focus:ring-red-500"
                : errors.gainfullyEmployed
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-primary"
            }`}
          />
          {!formData.gainfullyEmployed && (
            <p className="text-red-500 text-xs mt-1 font-medium">Required</p>
          )}
          {errors.gainfullyEmployed && (
            <p className="text-red-500 text-xs mt-1">
              {errors.gainfullyEmployed}
            </p>
          )}
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-2">
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
            className={`w-full px-4 py-3 border rounded focus:outline-none focus:ring-2 transition ${
              !formData.supportStudies
                ? "border-red-400 focus:ring-red-500"
                : errors.supportStudies
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-primary"
            }`}
          />
          {!formData.supportStudies && (
            <p className="text-red-500 text-xs mt-1 font-medium">Required</p>
          )}
          {errors.supportStudies && (
            <p className="text-red-500 text-xs mt-1">{errors.supportStudies}</p>
          )}
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-2">
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
            className={`w-full px-4 py-3 border rounded focus:outline-none focus:ring-2 transition ${
              !formData.supportFamily
                ? "border-red-400 focus:ring-red-500"
                : errors.supportFamily
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-primary"
            }`}
          />
          {!formData.supportFamily && (
            <p className="text-red-500 text-xs mt-1 font-medium">Required</p>
          )}
          {errors.supportFamily && (
            <p className="text-red-500 text-xs mt-1">{errors.supportFamily}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="pds-label mb-2">
            Please indicate other sources of financial support:
          </label>
          <input
            type="text"
            value={formData.financialSupport}
            onChange={(e) =>
              handleInputChange("financialSupport", e.target.value)
            }
            placeholder="e.g., Scholarship, Loan"
            className={`w-full px-4 py-3 border rounded focus:outline-none focus:ring-2 transition ${
              !formData.financialSupport
                ? "border-red-400 focus:ring-red-500"
                : "border-gray-300 focus:ring-primary"
            }`}
          />
          {!formData.financialSupport && (
            <p className="text-red-500 text-xs mt-1 font-medium">Required</p>
          )}
        </div>
        <div>
          <label className="pds-label mb-2">
            Your weekly school allowance:
          </label>
          <input
            type="text"
            value={formData.weeklyAllowance}
            onChange={(e) =>
              handleInputChange("weeklyAllowance", e.target.value)
            }
            className={`w-full px-4 py-3 border rounded focus:outline-none focus:ring-2 transition ${
              !formData.weeklyAllowance
                ? "border-red-400 focus:ring-red-500"
                : "border-gray-300 focus:ring-primary"
            }`}
          />
          {!formData.weeklyAllowance && (
            <p className="text-red-500 text-xs mt-1 font-medium">Required</p>
          )}
        </div>
      </div>

      <div className={`border rounded-lg p-4 ${
        formData.parentsIncome ? "bg-gray-50" : "bg-red-50"
      }`}>
        <label className="block font-semibold text-gray-900 mb-4">
          Parents' Combined Total Monthly Income: <span className="text-red-500">*</span>
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
                onChange={(e) => {
                  handleInputChange("parentsIncome", e.target.value);
                  clearError("parentsIncome");
                }}
                className="w-4 h-4 text-primary"
              />
              <span className="text-gray-700 text-sm">{range}</span>
            </label>
          ))}
        </div>

        {/* Input field for "Others, please specify:" */}
        {formData.parentsIncome === "Others, please specify:" && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <input
              type="text"
              placeholder="Please specify other income range"
              value={formData.parentsIncomeOther || ""}
              onChange={(e) => {
                handleInputChange("parentsIncomeOther", e.target.value);
                clearError("parentsIncomeOther");
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        )}
      </div>
    </div>
  );
}
