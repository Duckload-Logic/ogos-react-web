import { FormData, FormErrors } from "@/features/students/types";
import { PARENTAL_STATUS_MAP } from "../utils/maps";

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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { key: "fatherFirstName", label: "First Name", placeholder: "Enter first name" },
              { key: "fatherMiddleName", label: "Middle Name", placeholder: "Enter middle name" },
              { key: "fatherLastName", label: "Last Name", placeholder: "Enter last name" },
            ].map(( field ) => {
              const fieldValue = formData[field.key as keyof typeof formData];
              const stringValue = typeof fieldValue === 'string' ? fieldValue : '';
              
              return (
                <div key={field.key} className="flex flex-col">
                  <label className="students-label mb-2">
                    {field.label} {field.key !== "fatherMiddleName" && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type="text"
                    placeholder={field.placeholder}
                    value={stringValue} 
                    onChange={(e) => {
                      handleInputChange(field.key, e.target.value);
                      clearError(field.key);
                    }}
                    className={`w-full px-4 py-3 border rounded focus:outline-none focus:ring-2 transition ${
                      // Middle name is optional, don't show red border if empty
                      field.key !== "fatherMiddleName" && !formData[field.key as keyof typeof formData]
                        ? "border-red-400 focus:ring-red-500"
                        : "border-gray-300 focus:ring-primary"
                    }`}
                  />
                  {field.key !== "fatherMiddleName" && !formData[field.key as keyof typeof formData] && (
                    <p className="text-red-500 text-xs mt-1 font-medium">Required</p>
                  )}
                </div>
              )
            })}
          </div>
          <div>
            <label className="students-label mb-2">
              Birth Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              min="0"
              max="150"
              value={formData.fatherBirthDate}
              onChange={(e) => {
                handleInputChange("fatherBirthDate", e.target.value);
                clearError("fatherBirthDate");
              }}
              className={`w-full px-4 py-3 border rounded focus:outline-none focus:ring-2 transition ${
                !formData.fatherBirthDate
                  ? "border-red-400 focus:ring-red-500"
                  : errors.fatherBirthDate
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-primary"
              }`}
            />
            {!formData.fatherBirthDate && (
              <p className="text-red-500 text-xs mt-1 font-medium">Required</p>
            )}
            {errors.fatherBirthDate && (
              <p className="text-red-500 text-xs mt-1">{errors.fatherBirthDate}</p>
            )}
          </div>
          <div>
            <label className="block font-semibold text-gray-700 mb-2">
              Educational Attainment <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g., College"
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
            <label className="block font-semibold text-gray-700 mb-2">
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
            <label className="block font-semibold text-gray-700 mb-2">
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { key: "motherFirstName", label: "First Name", placeholder: "Enter first name" },
              { key: "motherMiddleName", label: "Middle Name", placeholder: "Enter middle name" },
              { key: "motherLastName", label: "Last Name", placeholder: "Enter last name" },
            ].map(( field ) => {
              const fieldValue = formData[field.key as keyof typeof formData];
              const stringValue = typeof fieldValue === 'string' ? fieldValue : '';
              
              return (
                <div key={field.key} className="flex flex-col">
                  <label className="students-label mb-2">
                    {field.label} {field.key !== "motherMiddleName" && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type="text"
                    placeholder={field.placeholder}
                    value={stringValue} 
                    onChange={(e) => {
                      handleInputChange(field.key, e.target.value);
                      clearError(field.key);
                    }}
                    className={`w-full px-4 py-3 border rounded focus:outline-none focus:ring-2 transition ${
                      // Middle name is optional, don't show red border if empty
                      field.key !== "motherMiddleName" && !formData[field.key as keyof typeof formData]
                        ? "border-red-400 focus:ring-red-500"
                        : "border-gray-300 focus:ring-primary"
                    }`}
                  />
                  {field.key !== "motherMiddleName" && !formData[field.key as keyof typeof formData] && (
                    <p className="text-red-500 text-xs mt-1 font-medium">Required</p>
                  )}
                </div>
              )
            })}
          </div>
          <div>
            <label className="students-label mb-2">
              Birth Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              min="0"
              max="150"
              placeholder="e.g., 40"
              value={formData.motherBirthDate}
              onChange={(e) => {
                handleInputChange("motherBirthDate", e.target.value);
                clearError("motherBirthDate");
              }}
              className={`w-full px-4 py-3 border rounded focus:outline-none focus:ring-2 transition ${
                !formData.motherBirthDate
                  ? "border-red-400 focus:ring-red-500"
                  : errors.motherBirthDate
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-primary"
              }`}
            />
            {!formData.motherBirthDate && (
              <p className="text-red-500 text-xs mt-1 font-medium">Required</p>
            )}
            {errors.motherBirthDate && (
              <p className="text-red-500 text-xs mt-1">{errors.motherBirthDate}</p>
            )}
          </div>
          <div>
            <label className="block font-semibold text-gray-700 mb-2">
              Educational Attainment <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g., College"
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
            <label className="block font-semibold text-gray-700 mb-2">
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
            <label className="block font-semibold text-gray-700 mb-2">
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
        formData.parentalStatusID ? "bg-gray-50" : "bg-red-50"
      }`}>
        <h3 className="font-semibold text-gray-900 mb-4">
          Parental Status <span className="text-red-500">*</span>
        </h3>
        <div className="space-y-3">
          {/* Map over entries so you have access to both the ID (key) and the Status (value) */}
          {Object.entries(PARENTAL_STATUS_MAP).map(([id, status]) => (
            <label key={id} className="flex items-center gap-3">
              <input
                type="radio"
                name="parentalStatus"
                // The value should be the ID
                value={id} 
                // Compare IDs directly for the checked state
                checked={String(formData.parentalStatusID) === String(id)}
                onChange={(e) =>
                  handleInputChange("parentalStatusID", e.target.value)
                }
                className="w-4 h-4 text-primary"
              />
              <span className="text-gray-700">{status}</span>
            </label>
          ))}
        </div>

        {/* Check the status string by looking up the ID in the map */}
        {PARENTAL_STATUS_MAP[formData.parentalStatusID] === "Deceased, please specify:" && (
          <input
            type="text"
            placeholder="Specify details"
            value={formData.parentalDetails || ""} // Fallback to empty string if null
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
          <label className="block font-semibold text-gray-700 mb-2">
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
              disabled
              type="number"
              min="0"
              value={(parseInt(formData.brothers) + parseInt(formData.sisters) + 1).toString()}
              className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 transition`}
            />
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
          <label className="block font-semibold text-gray-700 mb-2">
            Your weekly school allowance:
          </label>
          <input
            type="text"
            inputMode="numeric"
            value={formData.weeklyAllowance}
            placeholder="e.g., 500"
            onChange={(e) => {
              const value = e.target.value.replace(/[^0-9]/g, '');
              handleInputChange("weeklyAllowance", value);
            }}
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
        formData.monthlyFamilyIncome ? "bg-gray-50" : "bg-red-50"
      }`}>
        <label className="block font-semibold text-gray-900 mb-4">
          Parents' Combined Total Monthly Income: <span className="text-red-500">*</span>
        </label>
        <div className="space-y-2 grid grid-cols-1 md:grid-cols-2">
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
                name="monthlyFamilyIncome"
                value={range}
                checked={formData.monthlyFamilyIncome === range}
                onChange={(e) => {
                  handleInputChange("monthlyFamilyIncome", e.target.value);
                  clearError("monthlyFamilyIncome");
                }}
                className="w-4 h-4 text-primary"
              />
              <span className="text-gray-700 text-sm">{range}</span>
            </label>
          ))}
        </div>

        {/* Input field for "Others, please specify:" */}
        {formData.monthlyFamilyIncome === "Others, please specify:" && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <input
              type="text"
              placeholder="Please specify other income range"
              value={formData.monthlyFamilyIncomeOther || ""}
              onChange={(e) => {
                handleInputChange("monthlyFamilyIncomeOther", e.target.value);
                clearError("monthlyFamilyIncomeOther");
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        )}
      </div>
    </div>
  );
}
