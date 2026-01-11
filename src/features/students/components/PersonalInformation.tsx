import { FormData } from "@/features/students/types";
import { Combobox } from "@/components/ui/combobox";
import { User } from "@/types/user";
import locations from "@/config/ph_locations.json";
import { useState } from "react";
import { is } from "zod/v4/locales";
import { set } from "zod";

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
  user: User | null;
  formData: FormData;
  handleInputChange: (field: string, value: string | boolean) => void;
  clearError: (field: string) => void;
}

export function PersonalInformation({
  user,
  formData,
  handleInputChange,
  clearError,
}: PersonalInformationProps) {
  const [isSameAddress, setIsSameAddress] = useState(false);

  formData.lastName = user?.lastName || '';
  formData.firstName = user?.firstName || '';
  formData.middleName = user?.middleName || '';
  formData.email = user?.email || '';

  const provincialRegions = Object.keys(locations).map((r) => ({ label: r, value: r }));
  
  const provincialCities = formData.provincialAddressRegion 
    ? Object.keys((locations as any)[formData.provincialAddressRegion] || {}).map(c => ({ label: c, value: c }))
    : [];

  const provincialBarangays = (formData.provincialAddressRegion && formData.provincialAddressMunicipality)
    ? ((locations as any)[formData.provincialAddressRegion][formData.provincialAddressMunicipality] || []).map((b: string) => ({ label: b, value: b }))
    : [];

  // Helper to handle cascading resets
  const handleProvincialRegionChange = (val: string) => {
    handleInputChange("provincialAddressRegion", val);
    handleInputChange("provincialAddressMunicipality", ""); // Reset child
    handleInputChange("provincialAddressBarangay", "");     // Reset grandchild
    clearError("provincialAddressRegion");
  };

  const handleResidentialRegionChange = (val: string) => {
    handleInputChange("residentialAddressRegion", val);
    handleInputChange("residentialAddressMunicipality", ""); // Reset child
    handleInputChange("residentialAddressBarangay", "");     // Reset grandchild
    clearError("residentialAddressRegion");
  };

  const handleProvincialCityChange = (val: string) => {
    handleInputChange("provincialAddressMunicipality", val);
    handleInputChange("provincialAddressBarangay", "");     // Reset child
    clearError("provincialAddressMunicipality");
  };

  const handleResidentialCityChange = (val: string) => {
    handleInputChange("residentialAddressMunicipality", val);
    handleInputChange("residentialAddressBarangay", "");     // Reset child
    clearError("residentialAddressMunicipality");
  };

  const handleSameAddressToggle = (checked: boolean) => {
    const isProvincialAddressComplete = 
      formData.provincialAddressRegion &&
      formData.provincialAddressMunicipality &&
      formData.provincialAddressBarangay &&
      formData.provincialAddressStreet;
    
    if (!isProvincialAddressComplete && checked) {
      alert("Please complete the Provincial Address fields before syncing.");
      setIsSameAddress(false);
      return;
    }

    setIsSameAddress(checked);
    if (checked) {
      // Sync all fields
      handleInputChange("residentialAddressRegion", formData.provincialAddressRegion);
      handleInputChange("residentialAddressMunicipality", formData.provincialAddressMunicipality);
      handleInputChange("residentialAddressBarangay", formData.provincialAddressBarangay);
      handleInputChange("residentialAddressStreet", formData.provincialAddressStreet);

      clearError("residentialAddressRegion");
      clearError("residentialAddressMunicipality");
      clearError("residentialAddressBarangay");
      clearError("residentialAddressStreet");
    } else {
      // Clear residential fields
      handleInputChange("residentialAddressRegion", "");
      handleInputChange("residentialAddressMunicipality", "");
      handleInputChange("residentialAddressBarangay", "");
      handleInputChange("residentialAddressStreet", "");

      clearError("residentialAddressRegion");
      clearError("residentialAddressMunicipality");
      clearError("residentialAddressBarangay");
      clearError("residentialAddressStreet");
    }
  };

  return (
    <div className="space-y-6">
      {/* Name Fields */}
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Last Name */}
          <div>
            <label className="students-label mb-2">
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.lastName}
              disabled
              onChange={(e) => {
                handleInputChange("lastName", e.target.value);
                clearError("lastName");
              }}
              placeholder="e.g., Doe"
              className={`students-input w-full px-4 py-3 border rounded-lg focus:outline-none
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
            <label className="students-label mb-2">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.firstName}
              disabled
              onChange={(e) => {
                handleInputChange("firstName", e.target.value);
                clearError("firstName");
              }}
              placeholder="e.g., John"
              className={`students-input w-full px-4 py-3 border rounded-lg focus:outline-none
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
            <label className="students-label mb-2">
              Middle Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.middleName}
              disabled
              onChange={(e) => {
                handleInputChange("middleName", e.target.value);
                clearError("middleName");
              }}
              placeholder="e.g., Joe"
              className={`students-input w-full px-4 py-3 border rounded-lg focus:outline-none
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
          <label className="students-label mb-2">
            Civil Status <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.civilStatus}
            onChange={(e) => {
              handleInputChange("civilStatus", e.target.value);
              clearError("civilStatus");
            }}
            className={`bg-white w-full px-4 py-3 border rounded-lg focus:outline-none
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
          <label className="students-label mb-2">
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
          <label className="students-label mb-2">
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
          <label className="students-label mb-2">
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
          <label className="students-label mb-2">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={formData.email}
            disabled
            onChange={(e) => {
              handleInputChange("email", e.target.value);
              clearError("email");
            }}
            placeholder="e.g., example@domain.com"
            className={`students-input w-full px-4 py-3 border rounded-lg focus:outline-none
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
          <label className="students-label mb-2">
            Date of Birth <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={formData.dateOfBirth}
            placeholder="mm/dd/yyyy"
            onChange={(e) => {
              handleInputChange("dateOfBirth", e.target.value);
              clearError("dateOfBirth");
            }}
            className={`students-input w-full px-4 py-3 border rounded-lg focus:outline-none
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
        <label className="students-label mb-2">
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
          <label className="students-label mb-2">
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
          <label className="students-label mb-2">
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
          <label className="students-label mb-2">
            Gender <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.gender}
            onChange={(e) => {
              handleInputChange("gender", e.target.value);
              clearError("gender");
            }}
            className={`bg-white w-full px-4 py-3 border rounded-lg focus:outline-none
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
        <label className="students-label mb-2">
          Mobile Number <span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={11}
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
      <div className="space-y-4">
        <label className="students-label">Provincial Address <span className="text-red-500">*</span></label>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Region */}
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Region</label>
            <Combobox
              options={provincialRegions}
              value={formData.provincialAddressRegion}
              onValueChange={handleProvincialRegionChange}
              placeholder="Select Region"
              className="h-[3.5rem]"
            />
          </div>

          {/* City / Municipality */}
          <div>
            <label className="text-xs text-gray-500 mb-1 block">City/Municipality</label>
            <Combobox
              options={provincialCities}
              value={formData.provincialAddressMunicipality}
              onValueChange={handleProvincialCityChange}
              disabled={!formData.provincialAddressRegion}
              placeholder={formData.provincialAddressRegion ? "Select City" : "Select Region first"}
              className="h-[3.5rem]"
            />
          </div>

          {/* Barangay */}
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Barangay</label>
            <Combobox
              options={provincialBarangays}
              value={formData.provincialAddressBarangay}
              onValueChange={(val) => handleInputChange("provincialAddressBarangay", val)}
              disabled={!formData.provincialAddressMunicipality}
              placeholder={formData.provincialAddressMunicipality ? "Select Barangay" : "Select City first"}
              className="h-[3.5rem]"
            />
          </div>

          {/* Street */}
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Street/Lot/Blk</label>
            <input
              type="text"
              value={formData.provincialAddressStreet}
              onChange={(e) => handleInputChange("provincialAddressStreet", e.target.value)}
              className="students-input w-full h-[3.5rem] px-4 py-2 border rounded-lg"
              placeholder="e.g. Blk 12 Lot 5"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2 py-4 border-t border-gray-200 my-4">
        <input
          type="checkbox"
          id="sameAsProvincial"
          className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
          onChange={(e) => handleSameAddressToggle(e.target.checked)}
        />
        <label htmlFor="sameAsProvincial" className="text-sm font-medium text-gray-700 cursor-pointer">
          Residential address is the same as provincial address
        </label>
      </div>

      {/* Residential/City Address */}
      <div className="space-y-4">
        <label className="students-label">Residential Address <span className="text-red-500">*</span></label>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Region */}
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Region</label>
            <Combobox
              options={provincialRegions}
              value={formData.residentialAddressRegion}
              onValueChange={handleResidentialRegionChange}
              placeholder="Select Region"
              className="h-[3.5rem]"
              disabled={isSameAddress}
            />
          </div>

          {/* City / Municipality */}
          <div>
            <label className="text-xs text-gray-500 mb-1 block">City/Municipality</label>
            <Combobox
              options={provincialCities}
              value={formData.residentialAddressMunicipality}
              onValueChange={handleResidentialCityChange}
              disabled={!formData.residentialAddressRegion || isSameAddress}
              placeholder={formData.residentialAddressRegion ? "Select City" : "Select Region first"}
              className="h-[3.5rem]"
            />
          </div>

          {/* Barangay */}
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Barangay</label>
            <Combobox
              options={provincialBarangays}
              value={formData.residentialAddressBarangay}
              onValueChange={(val) => handleInputChange("residentialAddressBarangay", val)}
              disabled={!formData.residentialAddressMunicipality || isSameAddress}
              placeholder={formData.residentialAddressMunicipality ? "Select Barangay" : "Select City first"}
              className="h-[3.5rem]"
            />
          </div>

          {/* Street */}
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Street/Lot/Blk</label>
            <input
              type="text"
              value={formData.residentialAddressStreet}
              onChange={(e) => handleInputChange("residentialAddressStreet", e.target.value)}
              className="students-input w-full h-[3.5rem] px-4 py-2 border rounded-lg"
              placeholder="e.g. Blk 12 Lot 5"
              disabled={isSameAddress}
            />
          </div>
        </div>
      </div>

      {/* Employer Info */}
      <div>
        <label className="students-label mb-2">
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
          <div className="md:col-span-3">
            <label className="students-label mb-2">
              Complete name of the person to be contacted in case of emergency: <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {
                [ 
                  {label: "First Name", field: "emergencyContactFirstName"},
                  {label: "Middle Name", field: "emergencyContactMiddleName"},
                  {label: "Last Name", field: "emergencyContactLastName"},
                ].map((field) => (
                  <div key={field.field}> {/* Wrapped in a div or fragment with a key */}
                    <input
                      type="text"
                      value={formData[field.field as keyof FormData] as string || ''} 
                      onChange={(e) => {
                        handleInputChange(field.field, e.target.value);
                        clearError(field.field);
                      }}
                      placeholder={`Enter ${field.label}`}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none
                        focus:ring-2 transition ${
                          !formData[field.field as keyof FormData] && !(field.label === "Middle Name")
                            ? "border-red-400 focus:ring-red-500"
                            : "border-gray-300 focus:ring-primary"
                        }`}
                    />
                    {!formData[field.field as keyof FormData] && !(field.label === "Middle Name") && (
                      <p className="text-red-500 text-xs mt-1 font-medium">Required</p>
                    )}
                  </div>
                ))
              }
            </div>
            
          </div>
          <div>
            <label className="students-label mb-2">
              Relationship <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.emergencyContactRelationship}
              onChange={(e) => {
                handleInputChange("emergencyContactRelationship", e.target.value);
                clearError("emergencyContactRelationship");
              }}
              placeholder="e.g., Mother"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none
                focus:ring-2 transition ${
                  !formData.emergencyContactRelationship
                    ? "border-red-400 focus:ring-red-500"
                    : "border-gray-300 focus:ring-primary"
                }`}
            />
            {!formData.emergencyContactRelationship && (
              <p className="text-red-500 text-xs mt-1 font-medium">Required</p>
            )}
          </div>
          <div className="md:col-span-2">
            <label className="students-label mb-2">
              Telephone No.: <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              value={formData.emergencyContactPhone}
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={11}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "").slice(0, 11);
                handleInputChange("emergencyContactPhone", value);
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