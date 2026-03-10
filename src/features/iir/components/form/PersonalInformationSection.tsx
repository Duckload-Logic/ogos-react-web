import { forwardRef, useImperativeHandle, useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { DropdownField, InputField, Checkbox } from "@/components/form";
import {
  useCourses,
  useGenders,
  useCivilStatuses,
  useReligions,
  useStudentRelationshipTypes,
} from "@/features/iir/hooks";
import {
  useRegions,
  useCities,
  useBarangays,
} from "@/features/locations/hooks";
import { StudentSection } from "@/features/iir/types/IIRForm";
import { validateObject, validateField } from "@/services/validationSchema";
import { personalInformationValidationSchema } from "@/features/iir/config/personalInfoValidationSchema";
import type { Region, City, Barangay } from "@/features/iir/types/IIRForm";

interface FormErrors {
  [key: string]: string;
}

interface PersonalInformationSectionRef {
  validate: () => { isValid: boolean; errors: FormErrors };
}

export const PersonalInformationSection = forwardRef<
  PersonalInformationSectionRef,
  {
    studentInfo: StudentSection;
    onChange: (path: string, value: any) => void;
  }
>(function PersonalInformationSection({ studentInfo, onChange }, ref) {
  const { data: courses = [] } = useCourses();
  const { data: genders = [] } = useGenders();
  const { data: civilStatuses = [] } = useCivilStatuses();
  const { data: religions = [] } = useReligions();
  const { data: studentRelationshipTypes = [] } = useStudentRelationshipTypes();
  const { data: regions = [] } = useRegions();

  const [errors, setErrors] = useState<FormErrors>({});

  // Derive location IDs directly from form data so cities/barangays always
  // reflect the current selection even after page load or draft restore.
  const provincialRegionId = (studentInfo as any)?.addresses?.["provincial"]?.address?.region;
  const provincialCityId   = (studentInfo as any)?.addresses?.["provincial"]?.address?.city;
  const residentialRegionId = (studentInfo as any)?.addresses?.["residential"]?.address?.region;
  const residentialCityId   = (studentInfo as any)?.addresses?.["residential"]?.address?.city;

  const { data: provincialCities = [], isLoading: isProvincialCitiesLoading } =
    useCities(provincialRegionId || 0);
  const {
    data: provincialBarangays = [],
    isLoading: isProvincialBarangaysLoading,
  } = useBarangays(provincialCityId || 0);
  const {
    data: residentialCities = [],
    isLoading: isResidentialCitiesLoading,
  } = useCities(residentialRegionId || 0);
  const {
    data: residentialBarangays = [],
    isLoading: isResidentialBarangaysLoading,
  } = useBarangays(residentialCityId || 0);

  const validate = (): { isValid: boolean; errors: FormErrors } => {
    const sectionErrors = validateObject(
      { student: studentInfo },
      personalInformationValidationSchema,
    );

    setErrors(sectionErrors);
    return {
      isValid: Object.keys(sectionErrors).length === 0,
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
    <Card className="bg-card border border-border">
      <CardContent className="pt-6">
        {/* Name Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Last Name */}
          <InputField
            label="Last Name"
            value={studentInfo?.basicInfo?.lastName || ""}
            onChange={(val) =>
              handleInputChange("student.basicInfo.lastName", val)
            }
            error={errors["student.basicInfo.lastName"]}
            placeholder="e.g., Doe"
            required
            disabled
          />

          {/* First Name */}
          <InputField
            label="First Name"
            value={studentInfo?.basicInfo?.firstName || ""}
            onChange={(val) =>
              handleInputChange("student.basicInfo.firstName", val)
            }
            error={errors["student.basicInfo.firstName"]}
            placeholder="e.g., John"
            required
            disabled
          />

          {/* Middle Name */}
          <InputField
            label="Middle Name"
            value={
              studentInfo?.basicInfo?.middleName == null ||
              typeof studentInfo.basicInfo.middleName === "object"
                ? ""
                : studentInfo.basicInfo.middleName
            }
            onChange={(val) =>
              handleInputChange("student.basicInfo.middleName", val)
            }
            placeholder="e.g., Joe"
            disabled
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Email Address */}
          <InputField
            label="Email Address"
            type="email"
            value={studentInfo?.basicInfo?.email || ""}
            onChange={(val) =>
              handleInputChange("student.basicInfo.email", val)
            }
            error={errors["student.basicInfo.email"]}
            placeholder="e.g., example@domain.com"
            required
            disabled
          />

          {/* Civil Status */}
          <DropdownField formStyle
            label="Civil Status"
            options={civilStatuses}
            value={studentInfo?.personalInfo?.civilStatus?.id || ""}
            onChange={(val) =>
              handleInputChange("student.personalInfo.civilStatus", { id: val })
            }
            error={errors["student.personalInfo.civilStatus"]}
            required
          />

          {/* Religion */}
          <DropdownField formStyle
            label="Religion"
            options={religions}
            value={studentInfo?.personalInfo?.religion?.id || ""}
            onChange={(val) =>
              handleInputChange("student.personalInfo.religion", { id: val })
            }
            error={errors["student.personalInfo.religion"]}
            required
          />

          {/* High School GWA */}
          <InputField
            label="High School General Average"
            type="text"
            inputMode="decimal"
            value={studentInfo?.personalInfo?.highSchoolGWA || ""}
            onChange={(val) =>
              handleInputChange("student.personalInfo.highSchoolGWA", val.replace(/[^0-9.]/g, ""))
            }
            error={errors["student.personalInfo.highSchoolGWA"]}
            placeholder="e.g., 85"
            required
          />

          {/* Course */}
          <DropdownField formStyle
            label="Course"
            options={courses}
            value={studentInfo?.personalInfo?.course?.id || ""}
            onChange={(val) =>
              handleInputChange("student.personalInfo.course", { id: val })
            }
            error={errors["student.personalInfo.course"]}
            required
          />

          {/* Date of Birth */}
          <InputField
            label="Date of Birth"
            type="date"
            value={studentInfo?.personalInfo?.dateOfBirth || ""}
            onChange={(val) =>
              handleInputChange("student.personalInfo.dateOfBirth", val)
            }
            error={errors["student.personalInfo.dateOfBirth"]}
            required
          />

          {/* Place of Birth */}
          <InputField
            label="Place of Birth"
            value={studentInfo?.personalInfo?.placeOfBirth || ""}
            onChange={(val) =>
              handleInputChange("student.personalInfo.placeOfBirth", val)
            }
            error={errors["student.personalInfo.placeOfBirth"]}
            placeholder="City/Municipality, Province"
            required
          />

          {/* Height */}
          <InputField
            label="Height (ft.)"
            type="text"
            inputMode="decimal"
            value={studentInfo?.personalInfo?.heightFt || ""}
            onChange={(val) =>
              handleInputChange("student.personalInfo.heightFt", val.replace(/[^0-9.]/g, ""))
            }
            error={errors["student.personalInfo.heightFt"]}
            placeholder="e.g., 5.8"
            required
          />

          {/* Weight */}
          <InputField
            label="Weight (kg.)"
            type="text"
            inputMode="decimal"
            value={studentInfo?.personalInfo?.weightKg || ""}
            onChange={(val) =>
              handleInputChange("student.personalInfo.weightKg", val.replace(/[^0-9.]/g, ""))
            }
            error={errors["student.personalInfo.weightKg"]}
            placeholder="e.g., 70"
            required
          />

          {/* Gender */}
          <DropdownField formStyle
            label="Gender"
            options={genders}
            value={studentInfo?.personalInfo?.gender?.id || ""}
            onChange={(val) =>
              handleInputChange("student.personalInfo.gender", { id: val })
            }
            error={errors["student.personalInfo.gender"]}
            required
          />

          {/* Mobile Number */}
          <InputField
            label="Mobile Number"
            inputMode="numeric"
            value={studentInfo?.personalInfo?.mobileNumber || ""}
            onChange={(val) =>
              handleInputChange("student.personalInfo.mobileNumber", val.replace(/[^0-9]/g, ""))
            }
            error={errors["student.personalInfo.mobileNumber"]}
            placeholder="e.g., 09123456789"
            required
          />

          {/* Telephone Number */}
          <InputField
            label="Telephone Number"
            inputMode="numeric"
            value={studentInfo?.personalInfo?.telephoneNumber || ""}
            onChange={(val) =>
              handleInputChange("student.personalInfo.telephoneNumber", val.replace(/[^0-9]/g, ""))
            }
            error={errors["student.personalInfo.telephoneNumber"]}
            placeholder="(02) 1234-5678"
            required
          />
        </div>

        {/* Emergency Contact Section */}
        <div className="mt-8 pt-6 border-t border-border">
          <h3 className="text-sm font-semibold text-foreground mb-5">
            Emergency Contact Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Emergency Contact First Name */}
            <InputField
              label="Emergency Contact First Name"
              value={
                studentInfo?.personalInfo?.emergencyContact?.firstName || ""
              }
              onChange={(val) =>
                handleInputChange(
                  "student.personalInfo.emergencyContact.firstName",
                  val,
                )
              }
              error={errors["student.personalInfo.emergencyContact.firstName"]}
              placeholder="First name"
              required
            />

            {/* Emergency Contact Last Name */}
            <InputField
              label="Emergency Contact Last Name"
              value={
                studentInfo?.personalInfo?.emergencyContact?.lastName || ""
              }
              onChange={(val) =>
                handleInputChange(
                  "student.personalInfo.emergencyContact.lastName",
                  val,
                )
              }
              error={errors["student.personalInfo.emergencyContact.lastName"]}
              placeholder="Last name"
              required
            />

            {/* Emergency Contact Number */}
            <InputField
              label="Emergency Contact Number"
              inputMode="numeric"
              value={
                studentInfo?.personalInfo?.emergencyContact?.contactNumber || ""
              }
              onChange={(val) =>
                handleInputChange(
                  "student.personalInfo.emergencyContact.contactNumber",
                  val.replace(/[^0-9]/g, ""),
                )
              }
              error={errors["student.personalInfo.emergencyContact.contactNumber"]}
              placeholder="Phone number"
              required
            />

            {/* Emergency Contact Relationship */}
            <DropdownField formStyle
              label="Relationship"
              options={studentRelationshipTypes}
              value={
                studentInfo?.personalInfo?.emergencyContact?.relationship?.id ||
                ""
              }
              onChange={(val) =>
                handleInputChange(
                  "student.personalInfo.emergencyContact.relationship",
                  {
                    id: val,
                  },
                )
              }
              error={errors["student.personalInfo.emergencyContact.relationship"]}
              required
            />
          </div>
        </div>

        {/* Employment Status Section */}
        <div className="mt-8 pt-6 border-t border-border">
          <Checkbox
            id="isEmployed"
            label="Currently Employed"
            name="isEmployed"
            checked={studentInfo?.personalInfo?.isEmployed || false}
            onCheckedChange={(checked: boolean | "indeterminate") => {
              const isChecked = checked === true;
              handleInputChange("student.personalInfo.isEmployed", isChecked);
            }}
            info="Check if you are currently employed or have a job. You will need to provide employer details if selected."
          />

          {studentInfo?.personalInfo?.isEmployed && (
            <div className="bg-background dark:bg-muted border border-border rounded-md p-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Employer Name"
                  value={studentInfo?.personalInfo?.employerName || ""}
                  onChange={(val) =>
                    handleInputChange("student.personalInfo.employerName", val)
                  }
                  placeholder="Company name"
                />
                <InputField
                  label="Employer Address"
                  value={studentInfo?.personalInfo?.employerAddress || ""}
                  onChange={(val) =>
                    handleInputChange(
                      "student.personalInfo.employerAddress",
                      val,
                    )
                  }
                  placeholder="Company address"
                />
                <InputField
                  label="Employer Contact"
                  inputMode="numeric"
                  value={studentInfo?.personalInfo?.employerContact || ""}
                  onChange={(val) =>
                    handleInputChange(
                      "student.personalInfo.employerContact",
                      val.replace(/\D/g, ""),
                    )
                  }
                  placeholder="e.g., 09123456789"
                />
              </div>
            </div>
          )}
        </div>

        {/* Residential Addresses Section */}
        <div className="mt-8 pt-6 border-t border-border">
          <h3 className="text-sm font-semibold text-foreground mb-5">
            Residential Addresses
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Provincial Region */}
            <DropdownField formStyle labelKey="name"
              label="Region (Provincial)"
              options={regions}
              value={provincialRegionId || ""}
              onChange={(val) => {
                onChange(`student.addresses.provincial.address.region`, val);
                onChange(`student.addresses.provincial.address.city`, "");
                onChange(`student.addresses.provincial.address.barangay`, "");
                setErrors((prev) => { const u = { ...prev }; delete u["student.addresses.provincial.address.region"]; return u; });
              }}
              error={errors["student.addresses.provincial.address.region"]}
              required
            />
            {/* Provincial City */}
            <DropdownField formStyle labelKey="name"
              label="City/Municipality (Provincial)"
              options={provincialCities || []}
              enabled={!!provincialRegionId && !isProvincialCitiesLoading}
              value={provincialCityId || ""}
              onChange={(val) => {
                onChange(`student.addresses.provincial.address.city`, val);
                onChange(`student.addresses.provincial.address.barangay`, "");
                setErrors((prev) => { const u = { ...prev }; delete u["student.addresses.provincial.address.city"]; return u; });
              }}
              lockedReason={!provincialRegionId ? "Select a Region first" : ""}
              error={errors["student.addresses.provincial.address.city"]}
              required
            />
            {/* Provincial Barangay */}
            <DropdownField formStyle labelKey="name"
              label="Barangay (Provincial)"
              options={provincialBarangays || []}
              enabled={!!provincialCityId && !isProvincialBarangaysLoading}
              value={
                (studentInfo as any)?.addresses?.["provincial"]?.address
                  ?.barangay || ""
              }
              onChange={(val) => {
                onChange(`student.addresses.provincial.address.barangay`, val);
                setErrors((prev) => { const u = { ...prev }; delete u["student.addresses.provincial.address.barangay"]; return u; });
              }}
              lockedReason={!provincialCityId ? "Select a City first" : ""}
              error={errors["student.addresses.provincial.address.barangay"]}
              required
            />
            {/* Provincial Street */}
            <InputField
              label="Street (Provincial)"
              value={
                (studentInfo as any)?.addresses?.["provincial"]?.address
                  ?.streetDetail || ""
              }
              placeholder="Street/Lot/Blk"
              onChange={(val) =>
                onChange(
                  `student.addresses.provincial.address.streetDetail`,
                  val,
                )
              }
            />

            {/* Residential Region */}
            <DropdownField formStyle labelKey="name"
              label="Region (Residential)"
              options={regions}
              value={residentialRegionId || ""}
              onChange={(val) => {
                onChange(`student.addresses.residential.address.region`, val);
                onChange(`student.addresses.residential.address.city`, "");
                onChange(`student.addresses.residential.address.barangay`, "");
                setErrors((prev) => { const u = { ...prev }; delete u["student.addresses.residential.address.region"]; return u; });
              }}
              error={errors["student.addresses.residential.address.region"]}
              required
            />
            {/* Residential City */}
            <DropdownField formStyle labelKey="name"
              label="City/Municipality (Residential)"
              options={residentialCities || []}
              enabled={!!residentialRegionId && !isResidentialCitiesLoading}
              value={residentialCityId || ""}
              onChange={(val) => {
                onChange(`student.addresses.residential.address.city`, val);
                onChange(`student.addresses.residential.address.barangay`, "");
                setErrors((prev) => { const u = { ...prev }; delete u["student.addresses.residential.address.city"]; return u; });
              }}
              lockedReason={!residentialRegionId ? "Select a Region first" : ""}
              error={errors["student.addresses.residential.address.city"]}
              required
            />
            {/* Residential Barangay */}
            <DropdownField formStyle labelKey="name"
              label="Barangay (Residential)"
              options={residentialBarangays || []}
              enabled={!!residentialCityId && !isResidentialBarangaysLoading}
              value={
                (studentInfo as any)?.addresses?.["residential"]?.address
                  ?.barangay || ""
              }
              onChange={(val) => {
                onChange(`student.addresses.residential.address.barangay`, val);
                setErrors((prev) => { const u = { ...prev }; delete u["student.addresses.residential.address.barangay"]; return u; });
              }}
              lockedReason={!residentialCityId ? "Select a City first" : ""}
              error={errors["student.addresses.residential.address.barangay"]}
              required
            />
            {/* Residential Street */}
            <InputField
              label="Street (Residential)"
              value={
                (studentInfo as any)?.addresses?.["residential"]?.address
                  ?.streetDetail || ""
              }
              placeholder="Street/Lot/Blk"
              onChange={(val) =>
                onChange(
                  `student.addresses.residential.address.streetDetail`,
                  val,
                )
              }
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
});
