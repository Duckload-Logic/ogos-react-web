import { forwardRef, useImperativeHandle, useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { DropdownField, InputField, Checkbox } from "@/components/form";
import {
  useCourses,
  useGenders,
  useCivilStatuses,
  useReligions,
  useStudentRelationshipTypes,
  useAddressSync,
} from "@/features/iir/hooks";
import {
  useGetRegions,
  useGetProvinces,
  useGetCities,
  useGetBarangays,
} from "@/features/locations/hooks";
import {
  Barangay,
  City,
  Province,
  Region,
  StudentSection,
} from "@/features/iir/types/IIRForm";
import { validateObject, commonRules, isFieldRequired, FieldValidationSchema } from "@/services/validationSchema";
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
    onFieldBlur?: (fieldPath: string) => void;
    shouldShowError?: (fieldPath: string) => boolean;
  }
>(function PersonalInformationSection(
  { studentInfo, onChange, onFieldBlur, shouldShowError },
  ref,
) {
  const { data: courses = [] } = useCourses();
  const { data: genders = [] } = useGenders();
  const { data: civilStatuses = [] } = useCivilStatuses();
  const { data: religions = [] } = useReligions();
  const { data: studentRelationshipTypes = [] } = useStudentRelationshipTypes();
  const { data: regions = [] } = useGetRegions();
  const [errors, setErrors] = useState<FormErrors>({});

  // Stable indices for address array
  const PROVINCIAL_IDX = 0;
  const RESIDENTIAL_IDX = 1;

  /**
   * Get address by type and return both address and index
   */
  const getAddressByType = (type: string) => {
    const addresses = (studentInfo as any)?.addresses || [];
    const idx = type === "provincial" ? PROVINCIAL_IDX : RESIDENTIAL_IDX;
    const addr = addresses[idx]?.address || {};
    return { address: addr, index: idx };
  };

  const provincialData = getAddressByType("provincial");
  const residentialData = getAddressByType("residential");
  const provincialAddr = provincialData.address;
  const residentialAddr = residentialData.address;
  const emergencyAddr =
    (studentInfo as any)?.personalInfo?.emergencyContact?.address || {};

  // Address sync hooks
  const residentialSync = useAddressSync(
    provincialAddr,
    residentialAddr,
    useCallback(
      (address) => {
        if (address) {
          onChange(
            `student.addresses.${RESIDENTIAL_IDX}.address.region`,
            address.region,
          );
          onChange(
            `student.addresses.${RESIDENTIAL_IDX}.address.province`,
            address.province,
          );
          onChange(
            `student.addresses.${RESIDENTIAL_IDX}.address.city`,
            address.city,
          );
          onChange(
            `student.addresses.${RESIDENTIAL_IDX}.address.barangay`,
            address.barangay,
          );
          onChange(
            `student.addresses.${RESIDENTIAL_IDX}.address.streetDetail`,
            address.streetDetail,
          );

          // Clear errors for synced fields
          setErrors((prev) => {
            const updated = { ...prev };
            delete updated[
              `student.addresses.${RESIDENTIAL_IDX}.address.region`
            ];
            delete updated[
              `student.addresses.${RESIDENTIAL_IDX}.address.province`
            ];
            delete updated[`student.addresses.${RESIDENTIAL_IDX}.address.city`];
            delete updated[
              `student.addresses.${RESIDENTIAL_IDX}.address.barangay`
            ];
            return updated;
          });
        }
      },
      [onChange, RESIDENTIAL_IDX],
    ),
  );

  const emergencySync = useAddressSync(
    residentialAddr,
    emergencyAddr,
    useCallback(
      (address) => {
        if (address) {
          onChange(
            `student.personalInfo.emergencyContact.address.region`,
            address.region,
          );
          onChange(
            `student.personalInfo.emergencyContact.address.province`,
            address.province,
          );
          onChange(
            `student.personalInfo.emergencyContact.address.city`,
            address.city,
          );
          onChange(
            `student.personalInfo.emergencyContact.address.barangay`,
            address.barangay,
          );
          onChange(
            `student.personalInfo.emergencyContact.address.streetDetail`,
            address.streetDetail,
          );

          // Clear errors for synced fields
          setErrors((prev) => {
            const updated = { ...prev };
            delete updated[
              `student.personalInfo.emergencyContact.address.region`
            ];
            delete updated[
              `student.personalInfo.emergencyContact.address.province`
            ];
            delete updated[
              `student.personalInfo.emergencyContact.address.city`
            ];
            delete updated[
              `student.personalInfo.emergencyContact.address.barangay`
            ];
            return updated;
          });
        }
      },
      [onChange],
    ),
  );

  const addressRegion = {
    provincial: provincialAddr?.region,
    residential: residentialAddr?.region,
    emergency: emergencyAddr?.region,
  };
  const addressProvince = {
    provincial: provincialAddr?.province,
    residential: residentialAddr?.province,
    emergency: emergencyAddr?.province,
  };
  const addressCity = {
    provincial: provincialAddr?.city,
    residential: residentialAddr?.city,
    emergency: emergencyAddr?.city,
  };

  // Detect if provincial region is NCR (code: 1300000000)
  const isProvincialNCR = addressRegion.provincial?.code === "1300000000";
  const isResidentialNCR = addressRegion.residential?.code === "1300000000";

  // Get provinces for provincial address
  const { data: provincialProvinces = [] } = useGetProvinces(
    !isProvincialNCR && addressRegion.provincial?.code
      ? addressRegion.provincial.code
      : undefined,
  );

  // Get provinces for residential address
  const { data: residentialProvinces = [] } = useGetProvinces(
    !isResidentialNCR && addressRegion.residential?.code
      ? addressRegion.residential.code
      : undefined,
  );

  // Get cities for provincial address
  const { data: provincialCities = [], isLoading: isProvincialCitiesLoading } =
    useGetCities(addressRegion.provincial?.code || "", "");

  // Get cities for residential address
  const {
    data: residentialCities = [],
    isLoading: isResidentialCitiesLoading,
  } = useGetCities(addressRegion.residential?.code || "", "");

  // Get barangays for provincial address
  const {
    data: provincialBarangays = [],
    isLoading: isProvincialBarangaysLoading,
  } = useGetBarangays(addressCity.provincial?.code || "");

  // Get barangays for residential address
  const {
    data: residentialBarangays = [],
    isLoading: isResidentialBarangaysLoading,
  } = useGetBarangays(addressCity.residential?.code || "");

  const getRuntimeSchema = (): FieldValidationSchema => {
    const schema: FieldValidationSchema = { ...personalInformationValidationSchema };
    if ((studentInfo as any)?.personalInfo?.isEmployed) {
      schema["student.personalInfo.employerName"] = [commonRules.required("Employer name")];
      schema["student.personalInfo.employerAddress"] = [commonRules.required("Employer address")];
    }
    return schema;
  };
  const runtimeSchema = getRuntimeSchema();

  const validate = (): { isValid: boolean; errors: FormErrors } => {
    const runtimeSchema = getRuntimeSchema();

    const sectionErrors = validateObject(
      { student: studentInfo },
      runtimeSchema,
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

  /**
   * Helper to determine if error should be displayed for a field
   * Only show error if field is touched (or form submitted) AND has an error
   */
  const getFieldError = (fieldPath: string): string | undefined => {
    const hasError = errors[fieldPath];
    const showError = shouldShowError ? shouldShowError(fieldPath) : true;
    return hasError && showError ? errors[fieldPath] : undefined;
  };

  /**
   * Handle blur event for a field
   */
  const handleFieldBlur = (fieldPath: string) => {
    if (onFieldBlur) {
      onFieldBlur(fieldPath);
    }
  };

  return (
    <Card className="bg-card border border-border">
      <CardContent className="pt-6">
        {/* Name Section */}
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4 mb-6">
          {/* First Name */}
          <InputField
            label="First Name"
            className="col-span-2"
            value={studentInfo?.basicInfo?.firstName || ""}
            onChange={(val: any) =>
              handleInputChange("student.basicInfo.firstName", val)
            }
            error={errors["student.basicInfo.firstName"]}
            placeholder="e.g., John"
            required={isFieldRequired(runtimeSchema, "student.basicInfo.firstName")}
            disabled
          />

          {/* Middle Name */}
          <InputField
            label="Middle Name"
            className="col-span-2"
            value={
              studentInfo?.basicInfo?.middleName == null ||
                typeof studentInfo.basicInfo.middleName === "object"
                ? ""
                : studentInfo.basicInfo.middleName
            }
            onChange={(val: any) =>
              handleInputChange("student.basicInfo.middleName", val)
            }
            placeholder="e.g., Joe"
            disabled
          />
          {/* Last Name */}
          <InputField
            label="Last Name"
            className="col-span-2"
            value={studentInfo?.basicInfo?.lastName || ""}
            onChange={(val: any) =>
              handleInputChange("student.basicInfo.lastName", val)
            }
            error={errors["student.basicInfo.lastName"]}
            placeholder="e.g., Doe"
            required={isFieldRequired(runtimeSchema, "student.basicInfo.lastName")}
            disabled
          />
          {/* Suffix */}
          <InputField
            label="Suffix"
            value={studentInfo?.personalInfo?.suffix || ""}
            onChange={(val: any) =>
              handleInputChange("student.personalInfo.suffix", val)
            }
            placeholder="e.g., Jr."
          />
        </div>

        {/* Student Number & Academic Info */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {/* Student Number */}
          <InputField
            label="Student Number"
            value={studentInfo?.personalInfo?.studentNumber || ""}
            onChange={(val: any) =>
              handleInputChange("student.personalInfo.studentNumber", val)
            }
            onBlur={() => handleFieldBlur("student.personalInfo.studentNumber")}
            error={getFieldError("student.personalInfo.studentNumber")}
            placeholder="e.g., 2024-001"
            required={isFieldRequired(runtimeSchema, "student.personalInfo.studentNumber")}
          />

          {/* Year Level */}
          <InputField
            label="Year Level"
            type="number"
            inputMode="numeric"
            value={studentInfo?.personalInfo?.yearLevel || ""}
            onChange={(val: any) => {
              const parsed = parseInt(val, 10);
              handleInputChange(
                "student.personalInfo.yearLevel",
                isNaN(parsed) ? "" : parsed,
              );
            }}
            onBlur={() => {
              const val = studentInfo?.personalInfo?.yearLevel;
              handleInputChange(
                "student.personalInfo.yearLevel",
                val == null ? null : Number(val),
              );
              handleFieldBlur("student.personalInfo.yearLevel");
            }}
            error={getFieldError("student.personalInfo.yearLevel")}
            placeholder="e.g., 1"
            required={isFieldRequired(runtimeSchema, "student.personalInfo.yearLevel")}
          />

          {/* Section */}
          <InputField
            label="Section"
            value={studentInfo?.personalInfo?.section || ""}
            onChange={(val: any) => {
              const parsed = parseInt(String(val), 10);
              handleInputChange(
                "student.personalInfo.section",
                isNaN(parsed) ? "" : parsed,
              );
            }}
            onBlur={() => {
              const val = studentInfo?.personalInfo?.section;
              handleInputChange(
                "student.personalInfo.section",
                val === "" || val == null ? null : Number(val),
              );
              handleFieldBlur("student.personalInfo.section");
            }}
            error={getFieldError("student.personalInfo.section")}
            placeholder="e.g., 1"
            required={isFieldRequired(runtimeSchema, "student.personalInfo.section")}
          />

          {/* Complexion */}
          <InputField
            label="Complexion"
            value={studentInfo?.personalInfo?.complexion || ""}
            onChange={(val: any) =>
              handleInputChange("student.personalInfo.complexion", val)
            }
            onBlur={() => handleFieldBlur("student.personalInfo.complexion")}
            error={getFieldError("student.personalInfo.complexion")}
            placeholder="e.g., Fair"
            required={isFieldRequired(runtimeSchema, "student.personalInfo.complexion")}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Email Address */}
          <InputField
            label="Email Address"
            type="email"
            value={studentInfo?.basicInfo?.email || ""}
            onChange={(val: any) =>
              handleInputChange("student.basicInfo.email", val)
            }
            error={errors["student.basicInfo.email"]}
            placeholder="e.g., example@domain.com"
            required={isFieldRequired(runtimeSchema, "student.basicInfo.email")}
            disabled
          />
          {/* Civil Status */}
          <DropdownField
            formStyle
            label="Civil Status"
            options={civilStatuses}
            value={studentInfo?.personalInfo?.civilStatus?.id || ""}
            onChange={(val: any) =>
              handleInputChange("student.personalInfo.civilStatus", { id: val })
            }
            error={errors["student.personalInfo.civilStatus"]}
            required={isFieldRequired(runtimeSchema, "student.personalInfo.civilStatus")}
          />
          {/* Religion */}
          <DropdownField
            formStyle
            label="Religion"
            options={religions}
            value={studentInfo?.personalInfo?.religion?.id || ""}
            onChange={(val: any) =>
              handleInputChange("student.personalInfo.religion", { id: val })
            }
            error={errors["student.personalInfo.religion"]}
            required={isFieldRequired(runtimeSchema, "student.personalInfo.religion")}
          />
          {/* High School GWA */}
          <InputField
            label="High School General Average"
            type="text"
            inputMode="decimal"
            value={studentInfo?.personalInfo?.highSchoolGWA || ""}
            onChange={(val: any) =>
              handleInputChange(
                "student.personalInfo.highSchoolGWA",
                String(val).replace(/[^0-9.]/g, ""),
              )
            }
            onBlur={() => {
              const val = studentInfo?.personalInfo?.highSchoolGWA;
              handleInputChange(
                "student.personalInfo.highSchoolGWA",
                val === "" || val == null ? null : Number(val),
              );
              handleFieldBlur("student.personalInfo.highSchoolGWA");
            }}
            error={errors["student.personalInfo.highSchoolGWA"]}
            placeholder="e.g., 85"
            required={isFieldRequired(runtimeSchema, "student.personalInfo.highSchoolGWA")}
          />
          {/* Course */}
          <DropdownField
            formStyle
            label="Course"
            options={courses}
            value={studentInfo?.personalInfo?.course?.id || ""}
            onChange={(val: any) =>
              handleInputChange("student.personalInfo.course", { id: val })
            }
            error={errors["student.personalInfo.course"]}
            required={isFieldRequired(runtimeSchema, "student.personalInfo.course")}
          />
          {/* Date of Birth */}
          <InputField
            label="Date of Birth"
            type="date"
            value={studentInfo?.personalInfo?.dateOfBirth || ""}
            onChange={(val: any) =>
              handleInputChange("student.personalInfo.dateOfBirth", val)
            }
            error={errors["student.personalInfo.dateOfBirth"]}
            required={isFieldRequired(runtimeSchema, "student.personalInfo.dateOfBirth")}
          />
          {/* Place of Birth */}
          <InputField
            label="Place of Birth"
            value={studentInfo?.personalInfo?.placeOfBirth || ""}
            onChange={(val: any) =>
              handleInputChange("student.personalInfo.placeOfBirth", val)
            }
            error={errors["student.personalInfo.placeOfBirth"]}
            placeholder="City/Municipality, Province"
            required={isFieldRequired(runtimeSchema, "student.personalInfo.placeOfBirth")}
          />
          {/* Height */}
          <InputField
            label="Height (ft.)"
            type="text"
            inputMode="decimal"
            value={studentInfo?.personalInfo?.heightFt || ""}
            onChange={(val: any) =>
              handleInputChange(
                "student.personalInfo.heightFt",
                String(val).replace(/[^0-9.]/g, ""),
              )
            }
            onBlur={() => {
              const val = studentInfo?.personalInfo?.heightFt;
              handleInputChange(
                "student.personalInfo.heightFt",
                val === "" ? null : Number(val),
              );
              handleFieldBlur("student.personalInfo.heightFt");
            }}
            error={errors["student.personalInfo.heightFt"]}
            placeholder="e.g., 5.8"
            required={isFieldRequired(runtimeSchema, "student.personalInfo.heightFt")}
          />
          {/* Weight */}
          <InputField
            label="Weight (kg.)"
            type="text"
            inputMode="decimal"
            value={studentInfo?.personalInfo?.weightKg || ""}
            onChange={(val: any) =>
              handleInputChange(
                "student.personalInfo.weightKg",
                String(val).replace(/[^0-9.]/g, ""),
              )
            }
            onBlur={() => {
              const val = studentInfo?.personalInfo?.weightKg;
              handleInputChange(
                "student.personalInfo.weightKg",
                val === "" ? null : Number(val),
              );
              handleFieldBlur("student.personalInfo.weightKg");
            }}
            error={errors["student.personalInfo.weightKg"]}
            placeholder="e.g., 70"
            required={isFieldRequired(runtimeSchema, "student.personalInfo.weightKg")}
          />
          {/* Gender */}
          <DropdownField
            formStyle
            label="Gender"
            options={genders}
            value={studentInfo?.personalInfo?.gender?.id || ""}
            onChange={(val: any) =>
              handleInputChange("student.personalInfo.gender", { id: val })
            }
            error={errors["student.personalInfo.gender"]}
            required={isFieldRequired(runtimeSchema, "student.personalInfo.gender")}
          />
          {/* Mobile Number */}
          <InputField
            label="Mobile Number"
            inputMode="numeric"
            value={studentInfo?.personalInfo?.mobileNumber || ""}
            onChange={(val: any) => {
              const cleaned = val.replace(/[^0-9]/g, "");
              // Limit to 11 characters
              handleInputChange(
                "student.personalInfo.mobileNumber",
                cleaned.slice(0, 11),
              );
            }}
            error={errors["student.personalInfo.mobileNumber"]}
            placeholder="e.g., 09123456789"
            required={isFieldRequired(runtimeSchema, "student.personalInfo.mobileNumber")}
          />
          <InputField
            label="Telephone Number"
            inputMode="numeric"
            value={studentInfo?.personalInfo?.telephoneNumber || ""}
            onChange={(val: any) => {
              const cleaned = val.replace(/[^0-9]/g, "");
              // Limit to 10 characters
              handleInputChange(
                "student.personalInfo.telephoneNumber",
                cleaned.slice(0, 10),
              );
            }}
            error={errors["student.personalInfo.telephoneNumber"]}
            placeholder="e.g., (02) 1234-5678"
          />
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
                  onChange={(val: any) =>
                    handleInputChange("student.personalInfo.employerName", val)
                  }
                  placeholder="Company name"
                  error={errors["student.personalInfo.employerName"]}
                  required={isFieldRequired(runtimeSchema, "student.personalInfo.employerName")}
                />
                <InputField
                  label="Employer Address"
                  value={studentInfo?.personalInfo?.employerAddress || ""}
                  onChange={(val: any) =>
                    handleInputChange(
                      "student.personalInfo.employerAddress",
                      val,
                    )
                  }
                  placeholder="Company address"
                  error={errors["student.personalInfo.employerAddress"]}
                  required={isFieldRequired(runtimeSchema, "student.personalInfo.employerAddress")}
                />
              </div>
            </div>
          )}
        </div>

        {/* Addresses Section */}
        <div className="flex flex-col gap-8 mt-8 pt-6 border-t border-border">
          <div className="">
            <h3 className="text-sm font-semibold text-foreground mb-5">
              Provinvcial Address
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Provincial Region */}
              <DropdownField
                formStyle
                labelKey="name"
                label="Region (Provincial)"
                options={regions}
                get="code"
                identifier="code"
                value={
                  addressRegion.provincial?.code || ({ code: "" } as Region)
                }
                onChange={(val: any) => {
                  onChange(
                    `student.addresses.${PROVINCIAL_IDX}.address.region`,
                    { code: val },
                  );
                  onChange(
                    `student.addresses.${PROVINCIAL_IDX}.address.province`,
                    { code: "" } as Province,
                  );
                  onChange(`student.addresses.${PROVINCIAL_IDX}.address.city`, {
                    code: "",
                  } as City);
                  onChange(
                    `student.addresses.${PROVINCIAL_IDX}.address.barangay`,
                    { code: "" } as Barangay,
                  );
                  setErrors((prev) => {
                    const u = { ...prev };
                    delete u[
                      `student.addresses.${PROVINCIAL_IDX}.address.region`
                    ];
                    return u;
                  });
                }}
                error={
                  errors[`student.addresses.${PROVINCIAL_IDX}.address.region`]
                }
                required
              />
              {!isProvincialNCR && (
                <DropdownField
                  formStyle
                  labelKey="name"
                  label="Province (Provincial)"
                  options={provincialProvinces}
                  get="code"
                  identifier="code"
                  enabled={!!addressRegion.provincial?.code}
                  value={
                    addressProvince.provincial?.code ||
                    ({ code: "" } as Province)
                  }
                  onChange={(val: any) => {
                    onChange(
                      `student.addresses.${PROVINCIAL_IDX}.address.province`,
                      { code: val },
                    );
                    onChange(
                      `student.addresses.${PROVINCIAL_IDX}.address.city`,
                      { code: "" } as City,
                    );
                    onChange(
                      `student.addresses.${PROVINCIAL_IDX}.address.barangay`,
                      { code: "" } as Barangay,
                    );
                    setErrors((prev) => {
                      const u = { ...prev };
                      delete u[
                        `student.addresses.${PROVINCIAL_IDX}.address.province`
                      ];
                      return u;
                    });
                  }}
                  error={
                    errors[
                    `student.addresses.${PROVINCIAL_IDX}.address.province`
                    ]
                  }
                  required
                />
              )}
              {/* Provincial City */}
              <DropdownField
                formStyle
                labelKey="name"
                label="City/Municipality (Provincial)"
                options={provincialCities}
                get="code"
                identifier="code"
                enabled={
                  isProvincialNCR
                    ? !!addressRegion.provincial?.code &&
                    !isProvincialCitiesLoading
                    : !!addressProvince.provincial?.code &&
                    !isProvincialCitiesLoading
                }
                value={addressCity.provincial?.code || ({ code: "" } as City)}
                onChange={(val: any) => {
                  onChange(`student.addresses.${PROVINCIAL_IDX}.address.city`, {
                    code: val,
                  });
                  onChange(
                    `student.addresses.${PROVINCIAL_IDX}.address.barangay`,
                    { code: "" } as Barangay,
                  );
                  setErrors((prev) => {
                    const u = { ...prev };
                    delete u[
                      `student.addresses.${PROVINCIAL_IDX}.address.city`
                    ];
                    return u;
                  });
                }}
                lockedReason={
                  !addressRegion.provincial?.code ? "Select a Region first" : ""
                }
                error={
                  errors[`student.addresses.${PROVINCIAL_IDX}.address.city`]
                }
                required
              />
              {/* Provincial Barangay */}
              <DropdownField
                formStyle
                labelKey="name"
                label="Barangay (Provincial)"
                options={provincialBarangays || []}
                get="code"
                identifier="code"
                enabled={
                  !!addressCity.provincial?.code &&
                  !isProvincialBarangaysLoading
                }
                value={
                  provincialAddr?.barangay?.code || ({ code: "" } as Barangay)
                }
                onChange={(val: any) => {
                  onChange(
                    `student.addresses.${PROVINCIAL_IDX}.address.barangay`,
                    { code: val },
                  );
                  setErrors((prev) => {
                    const u = { ...prev };
                    delete u[
                      `student.addresses.${PROVINCIAL_IDX}.address.barangay`
                    ];
                    return u;
                  });
                }}
                lockedReason={
                  !addressCity.provincial?.code ? "Select a City first" : ""
                }
                error={
                  errors[`student.addresses.${PROVINCIAL_IDX}.address.barangay`]
                }
                required
              />
              {/* Provincial Street */}
              <InputField
                label="Street (Provincial)"
                className={`col-span-1 ${isProvincialNCR ? "" : " md:col-span-2"
                  }`}
                value={provincialAddr?.streetDetail || ""}
                placeholder="Street/Lot/Blk"
                onChange={(val: any) => {
                  onChange(
                    `student.addresses.${PROVINCIAL_IDX}.address.streetDetail`,
                    val,
                  );
                }}
              />
            </div>
          </div>
          {/* Residential Address Section */}
          <div className="">
            <h3 className="text-sm font-semibold text-foreground mb-5">
              Residential Address
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Residential Region */}
              <div className={residentialSync.isReadOnly ? "opacity-60" : ""}>
                <DropdownField
                  formStyle
                  labelKey="name"
                  label="Region (Residential)"
                  options={regions}
                  get="code"
                  identifier="code"
                  value={
                    addressRegion.residential?.code || ({ code: "" } as Region)
                  }
                  onChange={(val: any) => {
                    onChange(
                      `student.addresses.${RESIDENTIAL_IDX}.address.region`,
                      { code: val },
                    );
                    onChange(
                      `student.addresses.${RESIDENTIAL_IDX}.address.province`,
                      { code: "" } as Province,
                    );
                    onChange(
                      `student.addresses.${RESIDENTIAL_IDX}.address.city`,
                      { code: "" } as City,
                    );
                    onChange(
                      `student.addresses.${RESIDENTIAL_IDX}.address.barangay`,
                      { code: "" } as Barangay,
                    );
                    setErrors((prev) => {
                      const u = { ...prev };
                      delete u[
                        `student.addresses.${RESIDENTIAL_IDX}.address.region`
                      ];
                      return u;
                    });
                  }}
                  error={
                    errors[
                    `student.addresses.${RESIDENTIAL_IDX}.address.region`
                    ]
                  }
                  required
                  enabled={!residentialSync.isReadOnly}
                />
              </div>
              {!isResidentialNCR && (
                <div className={residentialSync.isReadOnly ? "opacity-60" : ""}>
                  <DropdownField
                    formStyle
                    labelKey="name"
                    label="Province (Residential)"
                    options={residentialProvinces}
                    get="code"
                    identifier="code"
                    enabled={
                      !!addressRegion.residential?.code &&
                      !residentialSync.isReadOnly
                    }
                    value={
                      addressProvince.residential?.code ||
                      ({ code: "" } as Province)
                    }
                    onChange={(val: any) => {
                      onChange(
                        `student.addresses.${RESIDENTIAL_IDX}.address.province`,
                        { code: val },
                      );
                      onChange(
                        `student.addresses.${RESIDENTIAL_IDX}.address.city`,
                        { code: "" } as City,
                      );
                      onChange(
                        `student.addresses.${RESIDENTIAL_IDX}.address.barangay`,
                        { code: "" } as Barangay,
                      );
                      setErrors((prev) => {
                        const u = { ...prev };
                        delete u[
                          `student.addresses.${RESIDENTIAL_IDX}.address.province`
                        ];
                        return u;
                      });
                    }}
                    error={
                      errors[
                      `student.addresses.${RESIDENTIAL_IDX}.address.province`
                      ]
                    }
                    required
                  />
                </div>
              )}
              {/* Residential City */}
              <div className={residentialSync.isReadOnly ? "opacity-60" : ""}>
                <DropdownField
                  formStyle
                  labelKey="name"
                  label="City/Municipality (Residential)"
                  options={residentialCities}
                  get="code"
                  identifier="code"
                  enabled={
                    (isResidentialNCR
                      ? !!addressRegion.residential?.code &&
                      !isResidentialCitiesLoading
                      : !!addressProvince.residential?.code &&
                      !isResidentialCitiesLoading) &&
                    !residentialSync.isReadOnly
                  }
                  value={
                    addressCity.residential?.code || ({ code: "" } as City)
                  }
                  onChange={(val: any) => {
                    onChange(
                      `student.addresses.${RESIDENTIAL_IDX}.address.city`,
                      { code: val },
                    );
                    onChange(
                      `student.addresses.${RESIDENTIAL_IDX}.address.barangay`,
                      { code: "" } as Barangay,
                    );
                    setErrors((prev) => {
                      const u = { ...prev };
                      delete u[
                        `student.addresses.${RESIDENTIAL_IDX}.address.city`
                      ];
                      return u;
                    });
                  }}
                  lockedReason={
                    residentialSync.isReadOnly
                      ? "Synced with Provincial Address"
                      : !addressRegion.residential?.code
                        ? "Select a Region first"
                        : ""
                  }
                  error={
                    errors[`student.addresses.${RESIDENTIAL_IDX}.address.city`]
                  }
                  required
                />
              </div>
              {/* Residential Barangay */}
              <div className={residentialSync.isReadOnly ? "opacity-60" : ""}>
                <DropdownField
                  formStyle
                  labelKey="name"
                  label="Barangay (Residential)"
                  options={residentialBarangays || []}
                  get="code"
                  identifier="code"
                  enabled={
                    !!addressCity.residential?.code &&
                    !isResidentialBarangaysLoading &&
                    !residentialSync.isReadOnly
                  }
                  value={
                    residentialAddr?.barangay?.code ||
                    ({ code: "" } as Barangay)
                  }
                  onChange={(val: any) => {
                    onChange(
                      `student.addresses.${RESIDENTIAL_IDX}.address.barangay`,
                      { code: val },
                    );
                    setErrors((prev) => {
                      const u = { ...prev };
                      delete u[
                        `student.addresses.${RESIDENTIAL_IDX}.address.barangay`
                      ];
                      return u;
                    });
                  }}
                  lockedReason={
                    residentialSync.isReadOnly
                      ? "Synced with Provincial Address"
                      : !addressCity.residential?.code
                        ? "Select a City first"
                        : ""
                  }
                  error={
                    errors[
                    `student.addresses.${RESIDENTIAL_IDX}.address.barangay`
                    ]
                  }
                  required
                />
              </div>
              {/* Residential Street */}
              <InputField
                label="Street (Residential)"
                className={`col-span-1 ${isResidentialNCR ? "" : " md:col-span-2"
                  } ${residentialSync.isReadOnly ? "opacity-60" : ""}`}
                value={residentialAddr?.streetDetail || ""}
                placeholder="Street/Lot/Blk"
                onChange={(val: any) => {
                  onChange(
                    `student.addresses.${RESIDENTIAL_IDX}.address.streetDetail`,
                    val,
                  );
                }}
                disabled={residentialSync.isReadOnly}
              />
            </div>
          </div>
          {/* Same As Provincial Checkbox */}
          <div className="mt-6">
            <Checkbox
              id="sameAsProvincial"
              label="Residential Address Same as Provincial"
              name="sameAsProvincial"
              checked={residentialSync.isSynced}
              className="mb-5"
              square
              onCheckedChange={(checked: boolean | "indeterminate") => {
                residentialSync.toggleSync(checked === true);
              }}
              info="Check this to automatically copy your Provincial Address to Residential Address"
            />
          </div>
          {/* Emergency Contact Section */}
          <div className="mt-8 pt-6 border-t border-border">
            <h3 className="text-sm font-semibold text-foreground mb-5">
              Emergency Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 col-span-2">
                {/* Emergency Contact Last Name */}
                <InputField
                  label="Emergency Contact Last Name"
                  value={
                    studentInfo?.personalInfo?.emergencyContact?.lastName || ""
                  }
                  onChange={(val: any) =>
                    handleInputChange(
                      "student.personalInfo.emergencyContact.lastName",
                      val,
                    )
                  }
                  error={
                    errors["student.personalInfo.emergencyContact.lastName"]
                  }
                  placeholder="Last name"
                  required
                />

                {/* Emergency Contact First Name */}
                <InputField
                  label="Emergency Contact First Name"
                  value={
                    studentInfo?.personalInfo?.emergencyContact?.firstName || ""
                  }
                  onChange={(val: any) =>
                    handleInputChange(
                      "student.personalInfo.emergencyContact.firstName",
                      val,
                    )
                  }
                  error={
                    errors["student.personalInfo.emergencyContact.firstName"]
                  }
                  placeholder="First name"
                  required
                />

                {/* Emergency Contact Middle Name */}
                <InputField
                  label="Emergency Contact Middle Name"
                  value={
                    studentInfo?.personalInfo?.emergencyContact?.middleName ||
                    ""
                  }
                  onChange={(val: any) =>
                    handleInputChange(
                      "student.personalInfo.emergencyContact.middleName",
                      val,
                    )
                  }
                  error={
                    errors["student.personalInfo.emergencyContact.middleName"]
                  }
                  placeholder="Middle name"
                />
              </div>

              {/* Emergency Contact Number */}
              <InputField
                label="Emergency Contact Number"
                inputMode="numeric"
                value={
                  studentInfo?.personalInfo?.emergencyContact?.contactNumber ||
                  ""
                }
                onChange={(val: any) =>
                  handleInputChange(
                    "student.personalInfo.emergencyContact.contactNumber",
                    val.replace(/[^0-9]/g, ""),
                  )
                }
                error={
                  errors["student.personalInfo.emergencyContact.contactNumber"]
                }
                placeholder="Phone number"
                required
              />

              {/* Emergency Contact Relationship */}
              <DropdownField
                formStyle
                label="Relationship"
                options={studentRelationshipTypes}
                value={
                  studentInfo?.personalInfo?.emergencyContact?.relationship
                    ?.id || ""
                }
                onChange={(val: any) =>
                  handleInputChange(
                    "student.personalInfo.emergencyContact.relationship",
                    {
                      id: val,
                    },
                  )
                }
                error={
                  errors["student.personalInfo.emergencyContact.relationship"]
                }
                required
              />
              {/* Emergency Address Section */}
              <div className="col-span-1 md:col-span-2">
                <h3 className="text-sm font-semibold text-foreground mb-5">
                  Emergency Contact Address
                </h3>
                <Checkbox
                  id="sameAsStudentAddress"
                  label="Same as Student's Residential Address"
                  name="sameAsStudentAddress"
                  checked={emergencySync.isSynced}
                  className="mb-5"
                  square
                  onCheckedChange={(checked: boolean | "indeterminate") => {
                    emergencySync.toggleSync(checked === true);
                  }}
                  info="Check this to automatically copy your Residential Address to Emergency Contact Address"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Emergency Contact Region */}
                  <div className={emergencySync.isReadOnly ? "opacity-60" : ""}>
                    <DropdownField
                      formStyle
                      labelKey="name"
                      label="Region (Emergency Contact)"
                      options={regions}
                      get="code"
                      identifier="code"
                      value={
                        addressRegion.emergency?.code ||
                        ({ code: "" } as Region)
                      }
                      onChange={(val: any) => {
                        onChange(
                          `student.personalInfo.emergencyContact.address.region`,
                          { code: val },
                        );
                        onChange(
                          `student.personalInfo.emergencyContact.address.province`,
                          { code: "" } as Province,
                        );
                        onChange(
                          `student.personalInfo.emergencyContact.address.city`,
                          { code: "" } as City,
                        );
                        onChange(
                          `student.personalInfo.emergencyContact.address.barangay`,
                          { code: "" } as Barangay,
                        );
                        setErrors((prev) => {
                          const u = { ...prev };
                          delete u[
                            `student.personalInfo.emergencyContact.address.region`
                          ];
                          return u;
                        });
                      }}
                      error={
                        errors[
                        `student.personalInfo.emergencyContact.address.region`
                        ]
                      }
                      required
                      enabled={!emergencySync.isReadOnly}
                    />
                  </div>
                  {!isResidentialNCR && (
                    <div
                      className={emergencySync.isReadOnly ? "opacity-60" : ""}
                    >
                      <DropdownField
                        formStyle
                        labelKey="name"
                        label="Province (Emergency Contact)"
                        options={residentialProvinces}
                        get="code"
                        identifier="code"
                        enabled={
                          !!addressRegion.emergency?.code &&
                          !emergencySync.isReadOnly
                        }
                        value={
                          addressProvince.emergency?.code ||
                          ({ code: "" } as Province)
                        }
                        onChange={(val: any) => {
                          onChange(
                            `student.personalInfo.emergencyContact.address.province`,
                            { code: val },
                          );
                          onChange(
                            `student.personalInfo.emergencyContact.address.city`,
                            { code: "" } as City,
                          );
                          onChange(
                            `student.personalInfo.emergencyContact.address.barangay`,
                            { code: "" } as Barangay,
                          );
                          setErrors((prev) => {
                            const u = { ...prev };
                            delete u[
                              `student.personalInfo.emergencyContact.address.province`
                            ];
                            return u;
                          });
                        }}
                        error={
                          errors[
                          `student.personalInfo.emergencyContact.address.province`
                          ]
                        }
                        required
                      />
                    </div>
                  )}
                  {/* Emergency Contact City */}
                  <div className={emergencySync.isReadOnly ? "opacity-60" : ""}>
                    <DropdownField
                      formStyle
                      labelKey="name"
                      label="City/Municipality (Emergency Contact)"
                      options={residentialCities}
                      get="code"
                      identifier="code"
                      enabled={
                        (isResidentialNCR
                          ? !!addressRegion.emergency?.code &&
                          !isResidentialCitiesLoading
                          : !!addressProvince.emergency?.code &&
                          !isResidentialCitiesLoading) &&
                        !emergencySync.isReadOnly
                      }
                      value={
                        addressCity.emergency?.code || ({ code: "" } as City)
                      }
                      onChange={(val: any) => {
                        onChange(
                          `student.personalInfo.emergencyContact.address.city`,
                          { code: val },
                        );
                        onChange(
                          `student.personalInfo.emergencyContact.address.barangay`,
                          { code: "" } as Barangay,
                        );
                        setErrors((prev) => {
                          const u = { ...prev };
                          delete u[
                            `student.personalInfo.emergencyContact.address.city`
                          ];
                          return u;
                        });
                      }}
                      lockedReason={
                        emergencySync.isReadOnly
                          ? "Synced with Residential Address"
                          : !addressRegion.emergency?.code
                            ? "Select a Region first"
                            : ""
                      }
                      error={
                        errors[
                        `student.personalInfo.emergencyContact.address.city`
                        ]
                      }
                      required
                    />
                  </div>
                  {/* Emergency Contact Barangay */}
                  <div className={emergencySync.isReadOnly ? "opacity-60" : ""}>
                    <DropdownField
                      formStyle
                      labelKey="name"
                      label="Barangay (Emergency Contact)"
                      options={residentialBarangays || []}
                      get="code"
                      identifier="code"
                      enabled={
                        !!addressCity.emergency?.code &&
                        !isResidentialBarangaysLoading &&
                        !emergencySync.isReadOnly
                      }
                      value={
                        emergencyAddr?.barangay?.code ||
                        ({ code: "" } as Barangay)
                      }
                      onChange={(val: any) => {
                        onChange(
                          `student.personalInfo.emergencyContact.address.barangay`,
                          { code: val },
                        );
                        setErrors((prev) => {
                          const u = { ...prev };
                          delete u[
                            `student.personalInfo.emergencyContact.address.barangay`
                          ];
                          return u;
                        });
                      }}
                      lockedReason={
                        emergencySync.isReadOnly
                          ? "Synced with Residential Address"
                          : !addressCity.emergency?.code
                            ? "Select a City first"
                            : ""
                      }
                      error={
                        errors[
                        `student.personalInfo.emergencyContact.address.barangay`
                        ]
                      }
                      required
                    />
                  </div>
                  {/* Emergency Contact Street */}
                  <InputField
                    label="Street (Emergency Contact)"
                    className={`col-span-1 ${isResidentialNCR ? "" : " md:col-span-2"
                      } ${emergencySync.isReadOnly ? "opacity-60" : ""}`}
                    value={emergencyAddr?.streetDetail || ""}
                    placeholder="Street/Lot/Blk"
                    onChange={(val: any) =>
                      onChange(
                        `student.personalInfo.emergencyContact.address.streetDetail`,
                        val,
                      )
                    }
                    disabled={emergencySync.isReadOnly}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});
