import { asText, formatCurrency, getOptionLabel } from "../../utils";
import { formatDate } from "@/features/schedules/utils/formatters";
import {
  BadgeInfo,
  Briefcase,
  CheckCircle2,
  FileText,
  Home,
  User,
  UserRound,
  Users,
} from "lucide-react";
import {
  CardBlock,
  EmptyState,
  InfoItem,
  SectionTitle,
  StatCard,
  TagList,
} from ".";
import {
  FamilySection,
  RelatedPerson,
  SibilingSupportType,
  StudentSupportType,
} from "../../types/IIRForm";
import { NOT_SPECIFIED } from "../../constants";

export default function FamilyBackgroundView({
  data,
}: {
  data: FamilySection | undefined;
}) {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <section>
        <SectionTitle title="Family Background" />
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard
            label="Parental Status"
            value={asText(data?.background?.parentalStatus?.name)}
            icon={Users}
          />
          <StatCard
            label="Parental Details"
            value={asText(data?.background?.parentalStatusDetails)}
            icon={FileText}
          />
          <StatCard
            label="Nature of Residence"
            value={asText(data?.background?.natureOfResidence?.name)}
            icon={Home}
          />
          <StatCard
            label="Brothers"
            value={asText(data?.background?.brothers)}
            icon={UserRound}
          />
          <StatCard
            label="Sisters"
            value={asText(data?.background?.sisters)}
            icon={UserRound}
          />
          <StatCard
            label="Employed Siblings"
            value={asText(data?.background?.employedSiblings)}
            icon={Briefcase}
          />
          <StatCard
            label="Ordinal Position"
            value={asText(data?.background?.ordinalPosition)}
            icon={BadgeInfo}
          />
          <StatCard
            label="Quiet Study Place"
            value={data?.background?.haveQuietPlaceToStudy ? "Yes" : "No"}
            icon={CheckCircle2}
          />
          <StatCard
            label="Sharing Room"
            value={data?.background?.isSharingRoom ? "Yes" : "No"}
            icon={Home}
          />
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <CardBlock title="Room Sharing Details">
            <p className="text-xs text-card-foreground">
              {asText(data?.background?.roomSharingDetails)}
            </p>
          </CardBlock>
          <CardBlock title="Sibling Support Types">
            {(data?.background?.siblingSupportTypes?.length ?? 0) > 0 && (
              <TagList
                values={data!.background!.siblingSupportTypes.map(
                  (item: SibilingSupportType) => getOptionLabel(item.name),
                )}
              />
            )}
          </CardBlock>
        </div>
      </section>

      <section>
        <SectionTitle title="Related Persons" />
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
          {(data?.relatedPersons?.length ?? 0) > 0 ? (
            data!.relatedPersons.map((person: RelatedPerson) => (
              <CardBlock
                key={person?.id}
                title={asText(person?.relationship?.name)}
                icon={User}
              >
                <div className="flex flex-col md:flex-row items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold text-card-foreground">
                      {`${asText(person?.lastName)}, ${asText(person?.firstName)} ${
                        person?.middleName ? `${person?.middleName[0]}.` : ""
                      }`}
                    </p>
                    <p className="text-[10px] uppercase text-muted-foreground tracking-wide mt-1">
                      {asText(person?.relationship?.name)}
                    </p>
                  </div>
                  <div className="flex gap-1 flex-wrap justify-start md:justify-end">
                    {person.isParent && <RoleBadge label="Parent" />}
                    {person.isGuardian && <RoleBadge label="Guardian" />}
                    <RoleBadge
                      label={person?.isLiving ? "Living" : "Not Living"}
                    />
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InfoItem
                    label="Educational Level"
                    value={asText(person?.educationalLevel)}
                  />
                  <InfoItem
                    label="Birth Date"
                    value={asText(formatDate(person?.dateOfBirth))}
                  />
                  <InfoItem
                    label="Occupation"
                    value={asText(person?.occupation)}
                  />
                  <InfoItem
                    label="Employer"
                    value={asText(person?.employerName)}
                  />
                  <InfoItem
                    label="Employer Address"
                    value={asText(person?.employerAddress)}
                  />
                </div>
              </CardBlock>
            ))
          ) : (
            <EmptyState label="No related persons recorded" />
          )}
        </div>
      </section>

      <section>
        <SectionTitle title="Financial Profile" />
        <div className="mt-6 w-full p-6 rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <p className="text-[10px] uppercase opacity-70 mb-1">
                Monthly Family Income
              </p>
              <p className="text-2xl font-bold">
                {asText(data?.finance?.monthlyFamilyIncomeRange?.text)}
              </p>
              <p className="text-xs mt-2 opacity-90">
                Other Income: {asText(data?.finance?.otherIncomeDetails)}
              </p>
            </div>

            <div className="md:border-l md:border-primary-foreground/20 md:pl-8">
              <p className="text-[10px] uppercase opacity-70 mb-1">
                Weekly Allowance
              </p>
              <p className="text-2xl font-bold">
                {formatCurrency(data?.finance?.weeklyAllowance)}
              </p>
            </div>

            <div className="md:border-l md:border-primary-foreground/20 md:pl-8">
              <p className="text-[10px] uppercase opacity-70 mb-2">
                Financial Sources
              </p>
              {(data?.finance?.financialSupportTypes?.length ?? 0) > 0 && (
                <TagList
                  values={data!.finance!.financialSupportTypes.map(
                    (item: StudentSupportType) => getOptionLabel(item?.name),
                  )}
                  dark
                />
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function RoleBadge({ label }: { label: string }) {
  return (
    <span className="text-[10px] px-2 py-1 rounded-full border-2 border-border bg-muted text-muted-foreground">
      {label}
    </span>
  );
}
