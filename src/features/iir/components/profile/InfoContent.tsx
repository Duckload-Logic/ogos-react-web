import { TabId } from "../../constants";
import PersonalView from "./PersonalView";
import EducationView from "./EducationView";
import FamilyView from "./FamilyView";
import HealthView from "./HealthView";
import InterestsHobbiesView from "./InterestsView";
import TestResultsView from "./TestResultsView";
import NotesView from "./NotesView";

export default function InfoContent({
  activeTab,
  studentData,
  showSignificantNotes = true,
}: {
  activeTab: TabId;
  studentData: any;
  showSignificantNotes?: boolean;
}) {
  const views: Record<TabId, JSX.Element> = {
    personal: <PersonalView data={studentData?.student} />,
    education: <EducationView data={studentData?.education} />,
    family: <FamilyView data={studentData?.family} />,
    health: <HealthView data={studentData?.health} />,
    interests: <InterestsHobbiesView data={studentData?.interests} />,
    testResults: <TestResultsView data={studentData?.testResults} />,
    ...(showSignificantNotes && {
      significantNotes: <NotesView data={studentData?.significantNotes} />,
    }),
  } as Record<TabId, JSX.Element>;

  return (
    <div className="bg-card w-full border-2 border-glass-border rounded-b-lg sm:rounded-t-lg shadow-lg p-4 sm:p-6 mb-4 z-10 min-h-[500px]">
      {views[activeTab]}
    </div>
  );
}
