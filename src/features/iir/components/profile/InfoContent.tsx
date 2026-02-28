import { TabId } from "../../constants";
import {
  PersonalInformationView,
  EducationBackgroundView,
  FamilyBackgroundView,
  HealthInformationView,
  InterestsHobbiesView,
  TestResultsView,
  SignificantNotesView,
} from "./";

export default function InfoContent({
  activeTab,
  studentData,
}: {
  activeTab: TabId;
  studentData: any;
}) {
  const views: Record<TabId, JSX.Element> = {
    personal: <PersonalInformationView data={studentData?.student} />,
    education: <EducationBackgroundView data={studentData?.education} />,
    family: <FamilyBackgroundView data={studentData?.family} />,
    health: <HealthInformationView data={studentData?.health} />,
    interests: <InterestsHobbiesView data={studentData?.interests} />,
    testResults: <TestResultsView data={studentData?.testResults} />,
    significantNotes: (
      <SignificantNotesView data={studentData?.significantNotes} />
    ),
  };

  return (
    <div className="bg-card w-full border-2 border-border rounded-b-lg sm:rounded-t-lg shadow-lg p-4 sm:p-6 mb-4 z-10 min-h-[500px]">
      {views[activeTab]}
    </div>
  );
}
