import { FormData } from "@/features/pds/types";

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
            <label className="block font-semibold text-gray-700 mb-2">
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
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none
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
            <label className="block font-semibold text-gray-700 mb-2">
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
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none
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
            <label className="block font-semibold text-gray-700 mb-2">
              Middle Name
            </label>
            <input
              type="text"
              value={formData.middleName}
              onChange={(e) => handleInputChange("middleName", e.target.value)}
              placeholder="e.g., Joe"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg
                focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      </div>

      {/* Civil Status & Religion */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block font-semibold text-gray-700 mb-2">
            Civil Status
          </label>
          <select
            value={formData.civilStatus}
            onChange={(e) => handleInputChange("civilStatus", e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg
              focus:outline-none focus:ring-2 focus:ring-primary"
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
        </div>
        <div>
          <label className="block font-semibold text-gray-700 mb-2">
            Religion
          </label>
          <input
            type="text"
            value={formData.religion}
            onChange={(e) => handleInputChange("religion", e.target.value)}
            placeholder="e.g., Catholic"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg
              focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Academic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block font-semibold text-gray-700 mb-2">
            High School General Average
          </label>
          <input
            type="text"
            value={formData.highSchoolAverage}
            onChange={(e) => {
              handleInputChange("highSchoolAverage", e.target.value);
              clearError("highSchoolAverage");
            }}
            placeholder="e.g., 85"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg
              focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label className="block font-semibold text-gray-700 mb-2">
            Course <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.course}
            onChange={(e) => {
              handleInputChange("course", e.target.value);
              clearError("course");
            }}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none
              focus:ring-2 transition ${
                !formData.course
                  ? "border-red-400 focus:ring-red-500"
                  : "border-gray-300 focus:ring-primary"
              }`}
          >
            <option value="">Select Course</option>
            <option value="CS">Computer Science</option>
            <option value="ENG">Civil Engineering</option>
            <option value="ME">Mechanical Engineering</option>
          </select>
          {!formData.course && (
            <p className="text-red-500 text-xs mt-1 font-medium">Required</p>
          )}
        </div>
      </div>

      {/* Contact & Birth Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block font-semibold text-gray-700 mb-2">
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
          <label className="block font-semibold text-gray-700 mb-2">
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
        <label className="block font-semibold text-gray-700 mb-2">
          Place of Birth
        </label>
        <input
          type="text"
          value={formData.placeOfBirth}
          onChange={(e) => handleInputChange("placeOfBirth", e.target.value)}
          placeholder="e.g., Manila"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg
            focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Physical Attributes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block font-semibold text-gray-700 mb-2">
            Height (ft.)
          </label>
          <input
            type="text"
            value={formData.height}
            onChange={(e) => handleInputChange("height", e.target.value)}
            placeholder="e.g., 5.8"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg
              focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label className="block font-semibold text-gray-700 mb-2">
            Weight (kg.)
          </label>
          <input
            type="text"
            value={formData.weight}
            onChange={(e) => handleInputChange("weight", e.target.value)}
            placeholder="e.g., 70"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg
              focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label className="block font-semibold text-gray-700 mb-2">
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
        <label className="block font-semibold text-gray-700 mb-2">
          Mobile Number <span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          value={formData.mobileNo}
          onChange={(e) => {
            handleInputChange("mobileNo", e.target.value);
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
    </div>
  );
}
