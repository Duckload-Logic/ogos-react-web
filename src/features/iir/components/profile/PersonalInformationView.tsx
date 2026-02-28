import { Home } from "lucide-react";
import { StudentSection, StudentAddress } from "../../types/IIRForm";
import { asText, renderAddress } from "../../utils";
import { formatDate } from "@/features/schedules/utils/formatters";
import { EmptyState, SectionTitle, CardBlock, InfoItem } from ".";
import { NOT_SPECIFIED } from "../../constants";

export default function PersonalInformationView({
  data,
}: {
  data: StudentSection | undefined;
}) {
  const basicInfo = data?.basicInfo;
  const personalInfo = data?.personalInfo;
  const addresses = data?.addresses || [];

  const personalInfoFields = [
    { label: "First Name", value: asText(basicInfo?.firstName) },
    { label: "Middle Name", value: asText(basicInfo?.middleName) },
    { label: "Last Name", value: asText(basicInfo?.lastName) },
    { label: "Gender", value: asText(personalInfo?.gender?.name) },
    { label: "Civil Status", value: asText(personalInfo?.civilStatus?.name) },
    { label: "Religion", value: asText(personalInfo?.religion?.name) },
    { label: "Height (ft)", value: asText(personalInfo?.heightFt) },
    { label: "Weight (kg)", value: asText(personalInfo?.weightKg) },
    { label: "Complexion", value: asText(personalInfo?.complexion) },
    { label: "High School GWA", value: asText(personalInfo?.highSchoolGWA) },
    { label: "Place of Birth", value: asText(personalInfo?.placeOfBirth) },
    {
      label: "Date of Birth",
      value: personalInfo?.dateOfBirth
        ? formatDate(personalInfo.dateOfBirth)
        : NOT_SPECIFIED,
    },
    {
      label: "Mobile Number",
      value: `+63 ${asText(personalInfo?.mobileNumber)}`,
    },
    {
      label: "Telephone Number",
      value: asText(personalInfo?.telephoneNumber),
    },
  ];

  return (
    <div className="space-y-8">
      <section>
        <SectionTitle title="Student Identity & Personal Details" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-10 mt-6">
          {personalInfoFields.map((field) => (
            <InfoItem
              key={field.label}
              label={field.label}
              value={field.value}
            />
          ))}
        </div>
      </section>

      <section>
        <SectionTitle title="Residency Details" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {addresses?.length > 0 ? (
            addresses?.map((entry: StudentAddress) => (
              <div
                key={entry?.id}
                className="rounded-xl border border-border p-4 shadow-sm"
              >
                <CardBlock icon={Home} title={asText(entry.addressType)}>
                  <p className="text-xs text-card-foreground">
                    {renderAddress(entry?.address)}
                  </p>
                </CardBlock>
              </div>
            ))
          ) : (
            <EmptyState label="No address records found" />
          )}
        </div>
      </section>
    </div>
  );
}
