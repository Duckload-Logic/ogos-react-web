import { FormData } from "@/features/pds/types";
import { Combobox } from "@/components/ui/combobox";

const COURSE_OPTIONS = [
  // Undergraduate Programs
  { label: "Bachelor of Science in Electronics Engineering", value: "BSECE" },
  { label: "Bachelor of Science in Mechanical Engineering", value: "BSME" },
  { label: "Bachelor of Science in Accountancy", value: "BSA" },
  { label: "Bachelor of Science in Business Administration (HRDM)", value: "BSBA-HRDM" },
  { label: "Bachelor of Science in Business Administration (Marketing)", value: "BSBA-MARKETING" },
  { label: "Bachelor of Science in Applied Mathematics", value: "BSAM" },
  { label: "Bachelor of Science in Information Technology", value: "BSIT" },
  { label: "Bachelor of Science in Entrepreneurship", value: "BSENTREP" },
  { label: "Bachelor in Secondary Education (English)", value: "BSED-ENG" },
  { label: "Bachelor in Secondary Education (Mathematics)", value: "BSED-MATH" },
  { label: "Bachelor of Science in Office Administration", value: "BSOA" },
  // Diploma Programs
  { label: "Diploma in Information Communication Technology", value: "DICT" },
  { label: "Diploma in Office Management Technology", value: "DOMT" },
];

interface PersonalInformationProps {
  formData: FormData;
  handleInputChange: (field: string, value: string | boolean) => void;
  clearError: (field: string) => void;
}

export function PersonalInformation({
  formData,
  handleInputChange,
  clearError,
}: PersonalInformationProps) {
  return (
    <div className="space-y-6">
      {/* Name Fields */}
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Last Name */}
          <div>
            <label className="pds-label mb-2">
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => {
                handleInputChange("lastName", e.target.value);
                clearError("lastName");
              }}
              placeholder="e.g., Doe"
              className={`pds-input w-full px-4 py-3 border rounded-lg focus:outline-none
                focus:ring-2 transition ${
                  !formData.lastName
                    ? "border-red-400 focus:ring-red-500"
                    : "border-gray-300 focus:ring-primary"
                }`}
            />
            {!formData.lastName && (
              <p className="text-red-500 text-xs mt-1 font-medium">Required</p>
            )}
          </div>

          {/* First Name */}
          <div>
            <label className="pds-label mb-2">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => {
                handleInputChange("firstName", e.target.value);
                clearError("firstName");
              }}
              placeholder="e.g., John"
              className={`pds-input w-full px-4 py-3 border rounded-lg focus:outline-none
                focus:ring-2 transition ${
                  !formData.firstName
                    ? "border-red-400 focus:ring-red-500"
                    : "border-gray-300 focus:ring-primary"
                }`}
            />
            {!formData.firstName && (
              <p className="text-red-500 text-xs mt-1 font-medium">Required</p>
            )}
          </div>

          {/* Middle Name */}
          <div>
            <label className="pds-label mb-2">
              Middle Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.middleName}
              onChange={(e) => {
                handleInputChange("middleName", e.target.value);
                clearError("middleName");
              }}
              placeholder="e.g., Joe"
              className={`pds-input w-full px-4 py-3 border rounded-lg focus:outline-none
                focus:ring-2 transition ${
                  !formData.middleName
                    ? "border-red-400 focus:ring-red-500"
                    : "border-gray-300 focus:ring-primary"
                }`}
            />
            {!formData.middleName && (
              <p className="text-red-500 text-xs mt-1 font-medium">Required</p>
            )}
          </div>
        </div>
      </div>

      {/* Civil Status & Religion */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="pds-label mb-2">
            Civil Status <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.civilStatus}
            onChange={(e) => {
              handleInputChange("civilStatus", e.target.value);
              clearError("civilStatus");
            }}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none
              focus:ring-2 transition ${
                !formData.civilStatus
                  ? "border-red-400 focus:ring-red-500"
                  : "border-gray-300 focus:ring-primary"
              }`}
          >
            <option value="">Select...</option>
            <option value="Single">Single</option>
            <option value="Single Parent">Single Parent</option>
            <option value="Married">Married</option>
            <option value="Married but Living Separately">
              Married but Living Separately
            </option>
            <option value="Divorced">Divorced</option>
            <option value="Annulled">Annulled</option>
            <option value="Widowed">Widowed</option>
            <option value="Separated">Separated</option>
          </select>
          {!formData.civilStatus && (
            <p className="text-red-500 text-xs mt-1 font-medium">Required</p>
          )}
        </div>
        <div>
          <label className="pds-label mb-2">
            Religion <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.religion}
            onChange={(e) => {
              handleInputChange("religion", e.target.value);
              clearError("religion");
            }}
            placeholder="e.g., Catholic"
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none
              focus:ring-2 transition ${
                !formData.religion
                  ? "border-red-400 focus:ring-red-500"
                  : "border-gray-300 focus:ring-primary"
              }`}
          />
          {!formData.religion && (
            <p className="text-red-500 text-xs mt-1 font-medium">Required</p>
          )}
        </div>
      </div>

      {/* Academic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="pds-label mb-2">
            High School General Average <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            max="100"
            value={formData.highSchoolAverage}
            onChange={(e) => {
              handleInputChange("highSchoolAverage", e.target.value);
              clearError("highSchoolAverage");
            }}
            placeholder="e.g., 85"
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none
              focus:ring-2 transition ${
                !formData.highSchoolAverage
                  ? "border-red-400 focus:ring-red-500"
                  : "border-gray-300 focus:ring-primary"
              }`}
          />
          {!formData.highSchoolAverage && (
            <p className="text-red-500 text-xs mt-1 font-medium">Required</p>
          )}
        </div>
        <div>
          <label className="pds-label mb-2">
            Course <span className="text-red-500">*</span>
          </label>
          <Combobox
            options={COURSE_OPTIONS}
            value={formData.course}
            onValueChange={(value) => {
              handleInputChange("course", value);
              clearError("course");
            }}
            placeholder="Select a course..."
            searchPlaceholder="Search courses..."
            emptyMessage="No course found."
            className={`w-full ${
              !formData.course
                ? "border-red-400 focus:ring-red-500"
                : "border-gray-300 focus:ring-primary"
            }`}
          />
          {!formData.course && (
            <p className="text-red-500 text-xs mt-1 font-medium">Required</p>
          )}
        </div>
      </div>

      {/* Contact & Birth Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="pds-label mb-2">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => {
              handleInputChange("email", e.target.value);
              clearError("email");
            }}
            placeholder="e.g., example@domain.com"
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none
              focus:ring-2 transition ${
                !formData.email
                  ? "border-red-400 focus:ring-red-500"
                  : "border-gray-300 focus:ring-primary"
              }`}
          />
          {!formData.email && (
            <p className="text-red-500 text-xs mt-1 font-medium">Required</p>
          )}
        </div>
        <div>
          <label className="pds-label mb-2">
            Date of Birth <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => {
              handleInputChange("dateOfBirth", e.target.value);
              clearError("dateOfBirth");
            }}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none
              focus:ring-2 transition ${
                !formData.dateOfBirth
                  ? "border-red-400 focus:ring-red-500"
                  : "border-gray-300 focus:ring-primary"
              }`}
          />
          {!formData.dateOfBirth && (
            <p className="text-red-500 text-xs mt-1 font-medium">Required</p>
          )}
        </div>
      </div>

      {/* Place of Birth */}
      <div>
        <label className="pds-label mb-2">
          Place of Birth <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.placeOfBirth}
          onChange={(e) => {
            handleInputChange("placeOfBirth", e.target.value);
            clearError("placeOfBirth");
          }}
          placeholder="e.g., Manila"
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none
            focus:ring-2 transition ${
              !formData.placeOfBirth
                ? "border-red-400 focus:ring-red-500"
                : "border-gray-300 focus:ring-primary"
            }`}
        />
        {!formData.placeOfBirth && (
          <p className="text-red-500 text-xs mt-1 font-medium">Required</p>
        )}
      </div>

      {/* Physical Attributes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="pds-label mb-2">
            Height (ft.) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            step="0.1"
            min="0"
            value={formData.height}
            onChange={(e) => {
              handleInputChange("height", e.target.value);
              clearError("height");
            }}
            placeholder="e.g., 5.8"
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none
              focus:ring-2 transition ${
                !formData.height
                  ? "border-red-400 focus:ring-red-500"
                  : "border-gray-300 focus:ring-primary"
              }`}
          />
          {!formData.height && (
            <p className="text-red-500 text-xs mt-1 font-medium">Required</p>
          )}
        </div>
        <div>
          <label className="pds-label mb-2">
            Weight (kg.) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            step="0.1"
            min="0"
            value={formData.weight}
            onChange={(e) => {
              handleInputChange("weight", e.target.value);
              clearError("weight");
            }}
            placeholder="e.g., 70"
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none
              focus:ring-2 transition ${
                !formData.weight
                  ? "border-red-400 focus:ring-red-500"
                  : "border-gray-300 focus:ring-primary"
              }`}
          />
          {!formData.weight && (
            <p className="text-red-500 text-xs mt-1 font-medium">Required</p>
          )}
        </div>
        <div>
          <label className="pds-label mb-2">
            Gender <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.gender}
            onChange={(e) => {
              handleInputChange("gender", e.target.value);
              clearError("gender");
            }}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none
              focus:ring-2 transition ${
                !formData.gender
                  ? "border-red-400 focus:ring-red-500"
                  : "border-gray-300 focus:ring-primary"
              }`}
          >
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          {!formData.gender && (
            <p className="text-red-500 text-xs mt-1 font-medium">Required</p>
          )}
        </div>
      </div>

      {/* Mobile Number */}
      <div>
        <label className="pds-label mb-2">
          Mobile Number <span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          inputMode="numeric"
          pattern="[0-9]*"
          value={formData.mobileNo}
          onChange={(e) => {
            const value = e.target.value.replace(/[^0-9]/g, '');
            handleInputChange("mobileNo", value);
            clearError("mobileNo");
          }}
          placeholder="e.g., 09123456789"
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none
            focus:ring-2 transition ${
              !formData.mobileNo
                ? "border-red-400 focus:ring-red-500"
                : "border-gray-300 focus:ring-primary"
            }`}
        />
        {!formData.mobileNo && (
          <p className="text-red-500 text-xs mt-1 font-medium">Required</p>
        )}
      </div>

      {/* Provincial Address */}
      {/* Note: Field name "provincialAddressProvince" stores complete address for backwards compatibility */}
      <div>
        <label className="pds-label mb-2">
          Complete Provincial Address <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.provincialAddressProvince}
          onChange={(e) => {
            handleInputChange("provincialAddressProvince", e.target.value);
            clearError("provincialAddressProvince");
          }}
          placeholder="e.g., Barangay, Municipality, Province"
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none
            focus:ring-2 transition ${
              !formData.provincialAddressProvince
                ? "border-red-400 focus:ring-red-500"
                : "border-gray-300 focus:ring-primary"
            }`}
        />
        {!formData.provincialAddressProvince && (
          <p className="text-red-500 text-xs mt-1 font-medium">Required</p>
        )}
      </div>

      {/* Residential/City Address */}
      {/* Note: Field name "residentialAddressProvince" stores complete address for backwards compatibility */}
      <div>
        <label className="pds-label mb-2">
          Complete Residential or City Address <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.residentialAddressProvince}
          onChange={(e) => {
            handleInputChange("residentialAddressProvince", e.target.value);
            clearError("residentialAddressProvince");
          }}
          placeholder="e.g., House No., Street, City"
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none
            focus:ring-2 transition ${
              !formData.residentialAddressProvince
                ? "border-red-400 focus:ring-red-500"
                : "border-gray-300 focus:ring-primary"
            }`}
        />
        {!formData.residentialAddressProvince && (
          <p className="text-red-500 text-xs mt-1 font-medium">Required</p>
        )}
      </div>

      {/* Employer Info */}
      <div>
        <label className="pds-label mb-2">
          If employed, the name and address of your employer:
        </label>
        <input
          type="text"
          value={formData.employerName}
          onChange={(e) => handleInputChange("employerName", e.target.value)}
          placeholder="e.g., Company Name, Address"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg
            focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Emergency Contact Information */}
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-4">Emergency Contact Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="pds-label mb-2">
              Complete name of the person to be contacted in case of emergency: <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.emergencyContactName}
              onChange={(e) => {
                handleInputChange("emergencyContactName", e.target.value);
                clearError("emergencyContactName");
              }}
              placeholder="e.g., Jane Doe"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none
                focus:ring-2 transition ${
                  !formData.emergencyContactName
                    ? "border-red-400 focus:ring-red-500"
                    : "border-gray-300 focus:ring-primary"
                }`}
            />
            {!formData.emergencyContactName && (
              <p className="text-red-500 text-xs mt-1 font-medium">Required</p>
            )}
          </div>
          <div>
            <label className="pds-label mb-2">
              Relationship <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.relationship}
              onChange={(e) => {
                handleInputChange("relationship", e.target.value);
                clearError("relationship");
              }}
              placeholder="e.g., Mother"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none
                focus:ring-2 transition ${
                  !formData.relationship
                    ? "border-red-400 focus:ring-red-500"
                    : "border-gray-300 focus:ring-primary"
                }`}
            />
            {!formData.relationship && (
              <p className="text-red-500 text-xs mt-1 font-medium">Required</p>
            )}
          </div>
          <div className="md:col-span-2">
            <label className="pds-label mb-2">
              Telephone No.: <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              value={formData.emergencyContactPhone}
              onChange={(e) => {
                handleInputChange("emergencyContactPhone", e.target.value);
                clearError("emergencyContactPhone");
              }}
              placeholder="e.g., 09123456789"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none
                focus:ring-2 transition ${
                  !formData.emergencyContactPhone
                    ? "border-red-400 focus:ring-red-500"
                    : "border-gray-300 focus:ring-primary"
                }`}
            />
            {!formData.emergencyContactPhone && (
              <p className="text-red-500 text-xs mt-1 font-medium">Required</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
