import { forwardRef, useImperativeHandle, useState } from "react";
import { DropdownField, InputField, Checkbox } from "@/components/form";
import {
  useCourses,
  useGenders,
  useCivilStatuses,
  useReligions,
  useStudentRelationshipTypes,
} from "@/features/iir/hooks";
import { StudentSection } from "@/features/iir/types/IIRForm";
import { SectionContainer } from "./SectionContainer";
import { AddressCard } from "./AddressCard";
import { validateObject, validateField } from "@/services/validationSchema";
import { personalInformationValidationSchema } from "@/features/iir/config/personalInfoValidationSchema";

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

  const [errors, setErrors] = useState<FormErrors>({});

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
    <div className="space-y-8">
      {/* Basic Information */}
      <SectionContainer title="A. Basic Information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="First Name"
            value={studentInfo?.basicInfo?.firstName || ""}
            onChange={(val) =>
              handleInputChange("student.basicInfo.firstName", val)
            }
            error={errors["student.basicInfo.firstName"]}
            placeholder="Enter first name"
            required
            disabled
          />
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
            placeholder="Enter middle name"
            disabled
          />
          <InputField
            label="Last Name"
            value={studentInfo?.basicInfo?.lastName || ""}
            onChange={(val) =>
              handleInputChange("student.basicInfo.lastName", val)
            }
            error={errors["student.basicInfo.lastName"]}
            placeholder="Enter last name"
            required
            disabled
          />
          <InputField
            label="Email"
            type="email"
            value={studentInfo?.basicInfo?.email || ""}
            onChange={(val) =>
              handleInputChange("student.basicInfo.email", val)
            }
            error={errors["student.basicInfo.email"]}
            placeholder="Enter email address"
            required
            disabled
          />
        </div>
      </SectionContainer>

      {/* Personal Details */}
      <SectionContainer title="B. Personal Details">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Student Number"
            value={studentInfo?.personalInfo?.studentNumber || ""}
            onChange={(val) =>
              handleInputChange("student.personalInfo.studentNumber", val)
            }
            placeholder="e.g., 2024-001"
            required
          />
          <InputField
            label="Date of Birth"
            type="date"
            value={studentInfo?.personalInfo?.dateOfBirth || ""}
            onChange={(val) =>
              handleInputChange("student.personalInfo.dateOfBirth", val)
            }
            required
          />
          <InputField
            label="Place of Birth"
            value={studentInfo?.personalInfo?.placeOfBirth || ""}
            onChange={(val) =>
              handleInputChange("student.personalInfo.placeOfBirth", val)
            }
            placeholder="City/Municipality, Province"
            required
          />
          <DropdownField
            label="Gender"
            options={genders}
            value={studentInfo?.personalInfo?.gender?.id || ""}
            onChange={(val) =>
              handleInputChange("student.personalInfo.gender", { id: val })
            }
            error={errors["student.personalInfo.gender"]}
            required
          />
          <DropdownField
            label="Civil Status"
            options={civilStatuses}
            value={studentInfo?.personalInfo?.civilStatus?.id || ""}
            onChange={(val) =>
              handleInputChange("student.personalInfo.civilStatus", { id: val })
            }
            required
          />
          <DropdownField
            label="Religion"
            options={religions}
            value={studentInfo?.personalInfo?.religion?.id || ""}
            onChange={(val) =>
              handleInputChange("student.personalInfo.religion", { id: val })
            }
            required
          />
        </div>
      </SectionContainer>

      {/* Physical Characteristics */}
      <SectionContainer title="C. Physical Characteristics">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InputField
            label="Height (feet)"
            type="number"
            inputMode="decimal"
            value={studentInfo?.personalInfo?.heightFt || ""}
            onChange={(val) =>
              handleInputChange("student.personalInfo.heightFt", val)
            }
            placeholder="e.g., 5.8"
            required
          />
          <InputField
            label="Weight (kg)"
            type="number"
            inputMode="decimal"
            value={studentInfo?.personalInfo?.weightKg || ""}
            onChange={(val) =>
              handleInputChange("student.personalInfo.weightKg", val)
            }
            placeholder="e.g., 65.5"
            required
          />
          <InputField
            label="Complexion"
            value={studentInfo?.personalInfo?.complexion || ""}
            onChange={(val) =>
              handleInputChange("student.personalInfo.complexion", val)
            }
            placeholder="e.g., Fair, Medium"
            required
          />
        </div>
      </SectionContainer>

      {/* Academic Information */}
      <SectionContainer title="D. Academic Information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="High School GWA"
            type="number"
            inputMode="decimal"
            value={studentInfo?.personalInfo?.highSchoolGWA || ""}
            onChange={(val) =>
              handleInputChange("student.personalInfo.highSchoolGWA", val)
            }
            placeholder="e.g., 3.25"
            required
          />
          <DropdownField
            label="Course"
            options={courses}
            value={studentInfo?.personalInfo?.course?.id || ""}
            onChange={(val) =>
              handleInputChange("student.personalInfo.course", { id: val })
            }
            error={errors["student.personalInfo.course"]}
            required
          />
          <DropdownField
            label="Year Level"
            options={[
              { id: 1, name: "1st Year" },
              { id: 2, name: "2nd Year" },
              { id: 3, name: "3rd Year" },
              { id: 4, name: "4th Year" },
            ]}
            value={studentInfo?.personalInfo?.yearLevel || ""}
            onChange={(val) =>
              handleInputChange("student.personalInfo.yearLevel", val)
            }
            required
          />
          <InputField
            label="Section"
            value={studentInfo?.personalInfo?.section || ""}
            onChange={(val) =>
              handleInputChange("student.personalInfo.section", val)
            }
            placeholder="e.g., A, B, C"
            required
          />
        </div>
      </SectionContainer>

      {/* Contact Information */}
      <SectionContainer title="E. Contact Information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Mobile Number"
            value={studentInfo?.personalInfo?.mobileNumber || ""}
            onChange={(val) =>
              handleInputChange("student.personalInfo.mobileNumber", val)
            }
            error={errors["student.personalInfo.mobileNumber"]}
            placeholder="9123456789"
            prefix="+63"
            required
          />
          <InputField
            label="Telephone Number"
            value={studentInfo?.personalInfo?.telephoneNumber || ""}
            onChange={(val) =>
              handleInputChange("student.personalInfo.telephoneNumber", val)
            }
            placeholder="(02) 1234-5678"
            required
          />
        </div>
      </SectionContainer>

      {/* Employment Information */}
      <SectionContainer title="F. Employment Information">
        <div className="space-y-4">
          <Checkbox
            id="isEmployed"
            label="Currently Employed"
            name="isEmployed"
            checked={studentInfo?.personalInfo?.isEmployed || false}
            onCheckedChange={(checked: boolean | "indeterminate") =>
              handleInputChange(
                "student.personalInfo.isEmployed",
                checked === true,
              )
            }
          />

          {studentInfo?.personalInfo?.isEmployed && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
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
                  handleInputChange("student.personalInfo.employerAddress", val)
                }
                placeholder="Company address"
              />
            </div>
          )}
        </div>
      </SectionContainer>

      {/* Emergency Contact */}
      <SectionContainer title="G. Emergency Contact">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="First Name"
            value={studentInfo?.personalInfo?.emergencyContact?.firstName || ""}
            onChange={(val) =>
              handleInputChange(
                "student.personalInfo.emergencyContact.firstName",
                val,
              )
            }
            placeholder="First name"
            required
          />
          <InputField
            label="Middle Name"
            value={
              studentInfo?.personalInfo?.emergencyContact?.middleName || ""
            }
            onChange={(val) =>
              handleInputChange(
                "student.personalInfo.emergencyContact.middleName",
                val,
              )
            }
            placeholder="Middle name"
          />
          <InputField
            label="Last Name"
            value={studentInfo?.personalInfo?.emergencyContact?.lastName || ""}
            onChange={(val) =>
              handleInputChange(
                "student.personalInfo.emergencyContact.lastName",
                val,
              )
            }
            placeholder="Last name"
            required
          />
          <InputField
            label="Contact Number"
            value={
              studentInfo?.personalInfo?.emergencyContact?.contactNumber || ""
            }
            onChange={(val) =>
              handleInputChange(
                "student.personalInfo.emergencyContact.contactNumber",
                val,
              )
            }
            placeholder="Phone number"
            required
          />
          <DropdownField
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
            required
          />
        </div>

        {/* Emergency Contact Address */}
        <div className="mt-6 pt-6 border-t">
          <h4 className="font-semibold text-sm text-card-foreground mb-4">
            Contact Address
          </h4>
          <AddressCard
            studentInfo={studentInfo}
            onChange={onChange}
            addrType="Emergency Contact Address"
            id={"emergency"}
          />
        </div>
      </SectionContainer>

      {/* Residential Addresses */}
      <SectionContainer title="H. Provincial/Residential Addresses">
        <div className="space-y-4">
          {["Provincial", "Residential"].map((addrType: string) => (
            <AddressCard
              key={addrType.toLowerCase()}
              studentInfo={studentInfo}
              onChange={onChange}
              addrType={addrType}
              id={addrType.toLowerCase()}
            />
          ))}
        </div>
      </SectionContainer>
    </div>
  );
});
