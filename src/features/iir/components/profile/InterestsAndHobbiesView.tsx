import { Trophy } from "lucide-react";
import { CardBlock, EmptyState, SectionTitle, TagList } from ".";
import { asText } from "../../utils";
import { ActivityOption, Hobby, InterestsSection } from "../../types/IIRForm";

export default function InterestsHobbiesView({
  data,
}: {
  data: InterestsSection | undefined;
}) {
  const activities = data?.activities || [];
  const academicInterests = activities.filter((activity: any) =>
    activity.activityOptions?.some((opt: any) => opt.category === "academic"),
  );
  const otherActivities = activities.filter((activity: any) =>
    activity.activityOptions?.some(
      (opt: ActivityOption) => opt.category === "extra_curricular",
    ),
  );

  const preferredSubjects = data?.subjectPreferences || [];
  const hobbies = [...(data?.hobbies || [])].sort(
    (a: Hobby, b: Hobby) => (a.priorityRanking || 0) - (b.priorityRanking || 0),
  );

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-left-4 duration-500">
      <section>
        <SectionTitle title="Activities" />
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ActivityCard title="Academic" list={academicInterests} />
          <ActivityCard title="Other" list={otherActivities} />
        </div>
      </section>

      <section>
        <SectionTitle title="Subject Preferences" />
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <CardBlock title="Favorite Subject/s">
            <TagList
              values={preferredSubjects
                .filter((subject: any) => subject.isFavorite)
                .map((subject: any) => subject.subjectName)}
            />
          </CardBlock>
          <CardBlock title="Least Favorite Subject/s">
            <TagList
              values={preferredSubjects
                .filter((subject: any) => !subject.isFavorite)
                .map((subject: any) => subject.subjectName)}
            />
          </CardBlock>
        </div>
      </section>

      <section>
        <SectionTitle title="Hobbies (Priority Rank)" />
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {hobbies.length > 0 ? (
            hobbies.map((hobby: any) => (
              <CardBlock key={hobby.id} title={`Rank ${hobby.priorityRanking}`}>
                <div className="flex items-center gap-3">
                  <Trophy className="h-4 w-4 text-primary" />
                  <span className="text-sm font-semibold text-card-foreground">
                    {asText(hobby.hobbyName)}
                  </span>
                </div>
              </CardBlock>
            ))
          ) : (
            <EmptyState label="No hobbies recorded" />
          )}
        </div>
      </section>
    </div>
  );
}

function ActivityCard({ title, list }: { title: string; list: any[] }) {
  return (
    <CardBlock title={title}>
      {list.length > 0 ? (
        <div className="space-y-3">
          {list.map((activity: any) => (
            <div
              key={activity.id}
              className="rounded-lg bg-card border border-border/60 p-3"
            >
              <p className="text-xs font-semibold text-card-foreground">
                {asText(activity.activityOptions?.[0]?.name || "Activity")}
              </p>
              <p className="text-[11px] text-muted-foreground mt-1">
                Role: {asText(activity.role)}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs italic text-muted-foreground">No records</p>
      )}
    </CardBlock>
  );
}
