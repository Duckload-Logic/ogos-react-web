import { asText } from "../../utils";
import { BadgeInfo, BookOpen, School, School2 } from "lucide-react";
import { useMemo } from "react";
import { CardBlock, EmptyState, InfoItem, SectionTitle, StatCard } from ".";
import { EducationSection, SchoolDetails } from "../../types/IIRForm";

export default function EducationBackgroundView({
  data,
}: {
  data: EducationSection | undefined;
}) {
  const schools = useMemo(() => {
    const values = data?.schools || [];
    return [...values].sort(
      (a: SchoolDetails, b: SchoolDetails) =>
        (a.educationalLevel.id || 0) - (b.educationalLevel.id || 0),
    );
  }, [data?.schools]);

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <section>
        <SectionTitle title="Schooling Overview" />
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            label="Nature of Schooling"
            value={asText(data?.natureOfSchooling)}
            icon={BookOpen}
          />
          <StatCard
            label="Interrupted Details"
            value={asText(data?.interruptedDetails)}
            icon={BadgeInfo}
          />
          <StatCard
            label="School Records"
            value={asText(schools.length)}
            icon={School}
          />
        </div>
      </section>

      <section>
        <SectionTitle title="Academic History" />
        <div className="mt-8 relative border-l-2 border-dashed border-border ml-2 space-y-8">
          {schools.length > 0 ? (
            schools.map((school: SchoolDetails) => (
              <div key={school.id} className="relative pl-8">
                <div className="absolute -left-[11px] top-0 w-5 h-5 rounded-full border-4 border-card bg-primary shadow-sm" />
                <CardBlock
                  icon={School2}
                  title={asText(school.educationalLevel.name)}
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-3">
                    <h4 className="text-sm font-bold text-card-foreground">
                      {asText(school.schoolName)}
                    </h4>
                    <span
                      className={`text-[10px] font-semibold uppercase px-2 py-1 rounded-full border border-border bg-green-100 text-green-800`}
                    >
                      {asText(school.schoolType)}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <InfoItem
                      label="Level"
                      value={asText(school.educationalLevel.name)}
                    />
                    <InfoItem
                      label="Address"
                      value={asText(school.schoolAddress)}
                    />
                    <InfoItem
                      label="Years"
                      value={`${asText(school.yearStarted)} - ${asText(
                        school.yearCompleted,
                      )}`}
                    />
                  </div>
                  <div className="mt-3">
                    <InfoItem label="Awards" value={asText(school.awards)} />
                  </div>
                </CardBlock>
              </div>
            ))
          ) : (
            <EmptyState label="No educational records found" />
          )}
        </div>
      </section>
    </div>
  );
}
