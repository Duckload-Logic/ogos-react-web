import Layout from "@/components/Layout";
import { useStudent } from "@/hooks/useStudent";
import { useUser } from "@/hooks/useUser";
import { unhashId } from "@/lib/hash";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { formatDate } from "@/features/schedules/utils/formatters";
import { ProfileMale, ProfileFemale } from "@/assets/icons";
import {
  Users,
  Banknote,
  Shield,
  IdCard,
  Mail,
  Phone,
  CircleChevronLeft,
  MapPinIcon,
  Trophy,
  Accessibility,
  Eye,
  Ear,
  Activity,
  MessageSquare,
  UserCheck,
  User,
  BookOpen,
  Wallet,
  HeartPulse,
} from "lucide-react";

const tabs: { id: string; label: string; icon: any }[] = [
  { id: "general", label: "General Profile", icon: User },
  { id: "family", label: "Family Background", icon: Users },
  { id: "education", label: "Educational Background", icon: BookOpen },
  { id: "health", label: "Health Information", icon: HeartPulse },
];

const genderMap: Record<number, string> = {
  1: "Male",
  2: "Female",
  3: "Other",
};

const civilStatusMap: Record<number, string> = {
  1: "Single",
  2: "Married",
  3: "Widowed",
  4: "Divorced",
};

const parentalStatusMap: Record<number, string> = {
  1: "Married and Living Together",
  2: "Married but Living Separately",
  3: "Father/Mother working Abroad",
  4: "Divorced or Annulled",
  5: "Separated",
  6: "Other",
};

export default function StudentProfile() {
  const location = useLocation();
  const { studentId } = useParams();
  const student = location.state?.student;

  const [userData, setUserData] = useState<any>(null);
  const [studentData, setStudentData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { fetchUserData } = useUser();
  const { fetchStudentData } = useStudent();

  const [activeTab, setActiveTab] = useState("general");

  useEffect(() => {
    const loadUserData = async () => {
      try {
        let id = student?.id;

        // Decode hash from URL if no student data in state
        if (!id && studentId) {
          id = unhashId(decodeURIComponent(studentId));
        }

        if (!id) {
          setError("No student ID provided");
          return;
        }

        const userData = await fetchUserData(id);
        setUserData(userData);
      } catch (err) {
        console.error("Failed to load user data:", err);
      }
    };

    const loadStudentData = async () => {
      try {
        let id = student?.id;

        // Decode hash from URL if no student data in state
        if (!id && studentId) {
          id = unhashId(decodeURIComponent(studentId));
        }

        if (!id) {
          setError("No student ID provided");
          return;
        }

        const data = await fetchStudentData(id);
        setStudentData(data);
        console.log("Fetched student data:", data);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load student data";
        setError(errorMessage);
        console.error("Failed to load student data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
    loadStudentData();
    console.log("Student ID from URL:", studentData);
  }, [student]);

  if (loading)
    return (
      <Layout title={`${userData?.lastName || "---"}'s Profile`}>
        <p>Loading...</p>
      </Layout>
    );
  if (error)
    return (
      <Layout title={`${userData?.lastName || "---"}'s Profile`}>
        <p className="text-red-500">{error}</p>
      </Layout>
    );

  return (
    <Layout title={`${userData?.lastName || "---"}'s Profile`}>
      <div className="flex flex-col gap-8">
        <a
          className="flex gap-2 group items-center text-sm text-foreground/70 font-medium hover:text-primary transition-colors w-max"
          href="/admin/student-records"
        >
          <CircleChevronLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Back to Students</span>
        </a>
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 h-full">
          <BioCard
            userData={userData}
            studentData={studentData.studentProfile}
          />
          <div className="xl:col-span-3 h-full flex flex-col gap-0">
            <InfoNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
            <InfoContent activeTab={activeTab} studentData={studentData} />
          </div>
        </div>
      </div>
    </Layout>
  );
}

function BioCard({ userData, studentData }: any) {
  const DefaultProfileIcon =
    studentData?.genderId === 1 ? ProfileMale : ProfileFemale;

  return (
    <div className="relative mt-10 sm:mt-12 flex flex-col items-center">
      {/* Profile Icon - Overlapping the card */}
      <div className="absolute -top-12 z-10">
        <DefaultProfileIcon className="h-24 w-24 rounded-full bg-background p-1 border-4 border-card shadow-xl text-muted-foreground" />
      </div>

      {/* Main Card */}
      <div className="w-full bg-card border border-border shadow-xl rounded-2xl pt-16 pb-6 px-6 flex flex-col items-center">
        {/* Identity Section */}
        <div className="text-center mb-6">
          <h2 className="text-xl font-black tracking-tight text-card-foreground">
            {userData?.firstName}{" "}
            {userData?.middleName ? `${userData.middleName[0]}.` : ""}{" "}
            {userData?.lastName}
          </h2>
          <span className="inline-block mt-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest">
            {studentData?.course || "Student"}
          </span>
        </div>

        {/* Quick Info Grid */}
        <div className="w-full grid grid-cols-1 gap-4 pt-6 border-t border-border/50">
          <div className="flex items-center group">
            <div className="p-2 rounded-lg bg-muted group-hover:bg-primary/10 transition-colors">
              <IdCard className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
            </div>
            <div className="ml-3">
              <p className="text-[10px] uppercase text-muted-foreground font-bold leading-none mb-1 group-hover:text-primary transition-colors">
                Student Number
              </p>
              <p className="text-sm font-medium text-card-foreground">
                {studentData?.studentNumber}
              </p>
            </div>
          </div>

          <div className="flex items-center group">
            <div className="p-2 rounded-lg bg-muted group-hover:bg-primary/10 transition-colors">
              <Mail className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
            </div>
            <div className="ml-3">
              <p className="text-[10px] uppercase text-muted-foreground font-bold leading-none mb-1 group-hover:text-primary transition-colors">
                Email Address
              </p>
              <p className="text-sm font-medium text-card-foreground truncate max-w-[200px] sm:max-w-full">
                {userData?.email}
              </p>
            </div>
          </div>

          <div className="flex items-center group">
            <div className="p-2 rounded-lg bg-muted group-hover:bg-primary/10 transition-colors">
              <Phone className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
            </div>
            <div className="ml-3">
              <p className="text-[10px] uppercase text-muted-foreground font-bold leading-none mb-1 group-hover:text-primary transition-colors">
                Contact Number
              </p>
              <p className="text-sm font-medium text-card-foreground">
                {studentData?.contactNo || "Not provided"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoNavigation({ activeTab, setActiveTab }: any) {
  return (
    <div className="relative">
      <nav className="flex items-end gap-1 w-full min-w-max ml-0 sm:ml-4">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative whitespace-nowrap py-2.5 px-4 sm:py-3 sm:px-6 text-xs sm:text-sm font-medium transition-all duration-200
                border-t-2 border-l-2 border-r-2
                ${
                  isActive
                    ? "bg-card text-card-foreground border-border rounded-t-xl z-20 -mb-[2px]"
                    : "bg-muted text-muted-foreground border-transparent hover:bg-muted/80 rounded-t-lg z-0"
                }`}
            >
              <div className="flex items-center gap-2">
                <tab.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                {isActive && tab.label}
              </div>
            </button>
          );
        })}
      </nav>
    </div>
  );
}

function InfoContent({ activeTab, studentData }: any) {
  const views: any = {
    general: (
      <GeneralProfileView
        studentProfileData={studentData.studentProfile}
        studentAddresses={studentData.addresses}
      />
    ),
    family: (
      <FamilyBackgroundView
        familyData={studentData.family}
        parentsData={studentData.parents}
        financeData={studentData.finance}
      />
    ),
    education: (
      <EducationBackgroundView educationData={studentData.education} />
    ),
    health: <HealthInformationView healthData={studentData.health} />,
  };

  return (
    <div className="bg-card w-full border-2 border-border rounded-lg shadow-lg p-4 sm:p-6 mb-4">
      {views[activeTab] || <p>Content not found.</p>}
    </div>
  );
}

function GeneralProfileView({ studentProfileData, studentAddresses }: any) {
  const personalInfoFields = [
    {
      label: "Height (ft)",
      value: studentProfileData?.heightFt || "Not specified",
    },
    {
      label: "Weight (kg)",
      value: studentProfileData?.weightKg || "Not specified",
    },
    {
      label: "Gender",
      value: genderMap[studentProfileData?.genderId] || "Not specified",
    },
    {
      label: "Civil Status",
      value:
        civilStatusMap[studentProfileData?.civilStatusTypeId] ||
        "Not specified",
    },
    {
      label: "Religion",
      value: studentProfileData?.religion || "Not specified",
    },
    {
      label: "Place of Birth",
      value: studentProfileData?.placeOfBirth || "Not specified",
    },
    {
      label: "Date of Birth",
      value: formatDate(studentProfileData?.birthDate) || "Not specified",
    },
  ];

  const addressInfoFields = studentAddresses.map((address: any) => ({
    label: `${address.addressType} Address`,
    value: `${address.streetLotBlk}, ${address.barangayName}, ${address.cityName}, ${address.provinceName}, ${address.regionName}`,
  }));

  return (
    <div className="space-y-8">
      {/* Section: Personal Details */}
      <section>
        <div className="flex items-center gap-2 mb-6">
          <SectionTitle title="Personal Details" />
        </div>

        {/* Grid Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-12 px-2">
          {personalInfoFields.map((field) => (
            <InfoItem
              key={field.label}
              label={field.label}
              value={field.value}
            />
          ))}
        </div>
      </section>

      {/* Section: Addresses */}
      <div className="flex flex-col gap-4">
        <SectionTitle title="Residency Details" />
        <section className="bg-gradient-to-br from-card to-muted/80  rounded-xl p-6 border border-border/50 shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {addressInfoFields.map(
              (field: { label: string; value: string }) => (
                <div
                  key={field.label}
                  className="flex flex-col gap-2 origin-top-left scale-[0.95]"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-tight text-muted-foreground">
                      {field.label}
                    </span>
                  </div>
                  <p className="text-xs text-card-foreground leading-relaxed bg-card p-3 rounded-lg shadow-md">
                    {field.value}
                  </p>
                </div>
              ),
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

function FamilyBackgroundView({ familyData, parentsData, financeData }: any) {
  const fatherData = parentsData?.find(
    (parent: any) => parent.relationship === "Father",
  );
  const motherData = parentsData?.find(
    (parent: any) => parent.relationship === "Mother",
  );
  const parentInfoFields = [
    {
      role: "Father",
      data: [
        { label: "Last Name", value: fatherData?.lastName },
        { label: "First Name", value: fatherData?.firstName },
        { label: "Middle Name", value: fatherData?.middleName },
        { label: "Occupation", value: fatherData?.occupation },
        { label: "Company Name", value: fatherData?.companyName },
        { label: "Educational Level", value: fatherData?.educationalLevel },
        { label: "Birth Date", value: formatDate(fatherData?.birthDate) },
      ],
    },
    {
      role: "Mother",
      data: [
        { label: "Last Name", value: motherData?.lastName },
        { label: "First Name", value: motherData?.firstName },
        { label: "Middle Name", value: motherData?.middleName },
        { label: "Occupation", value: motherData?.occupation },
        { label: "Company Name", value: motherData?.companyName },
        { label: "Educational Level", value: motherData?.educationalLevel },
        { label: "Birth Date", value: formatDate(motherData?.birthDate) },
      ],
    },
  ];

  const householdInfoFields = [
    { label: "Number of Brothers", value: familyData?.siblingsBrothers },
    { label: "Number of Sisters", value: familyData?.siblingSisters },
    {
      label: "Total Siblings",
      value: familyData?.siblingsBrothers + familyData?.siblingSisters,
    },
    {
      label: "Gainfully Employed",
      value: financeData?.employedFamilyMembersCount,
    },
    { label: "Supports Studies", value: financeData?.supportsStudiesCount },
    {
      label: "Supports Immediate Family",
      value: financeData?.supportsFamilyCount,
    },
  ];
  return (
    <div className="space-y-2 animate-in fade-in duration-500">
      {/* SECTION: Parents Profile */}
      <div className="flex flex-col gap-4">
        <SectionTitle title="Parents Profile" />
        <div className="text-sm text-card-foreground bg-muted/30 p-3 rounded-xl border border-border/50 w-fit shadow-sm">
          {parentalStatusMap[familyData?.parentalStatusId] || "Not specified"}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
          {parentInfoFields.map((parent) => (
            <div
              key={parent.role}
              className="relative p-5 rounded-2xl border border-border bg-gradient-to-br from-card to-muted/80 shadow-sm"
            >
              <div className="absolute top-4 right-4 text-[10px] font-semibold uppercase text-primary opacity-90">
                {parent.role}
              </div>

              <h4 className="text-lg font-bold text-card-foreground mb-4">
                {parent.data?.length > 0
                  ? `${parent.data[0].value}, ${parent.data[1].value} ${parent.data[2]?.value ? `${parent.data[2].value[0]}.` : ""}`
                  : "Not Provided"}
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {parent.data?.slice(3).map((field) => (
                  <InfoItem
                    key={field.label}
                    label={field.label}
                    value={field.value || "Not specified"}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION: Household & Siblings */}
      <section className="py-6 flex flex-col gap-4">
        <SectionTitle title="Household Composition" />

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {householdInfoFields.map((field) => (
            <StatBox
              key={field.label}
              label={field.label}
              value={field.value}
            />
          ))}
        </div>
      </section>

      {/* SECTION: Guardian Profile */}
      <section className="py-6 flex flex-col gap-2">
        <SectionTitle title="Guardian Profile" />

        <div className="relative p-5 rounded-2xl border border-border bg-gradient-to-br from-card to-muted/80 shadow-sm">
          <div className="absolute top-4 right-4 text-[10px] font-semibold uppercase text-primary opacity-90">
            Guardian
          </div>

          <h4 className="text-lg font-bold text-card-foreground mb-4">
            {`${familyData?.guardianLastName}, ${familyData?.guardianFirstName} ${familyData?.guardianMiddleName ? `${familyData.guardianMiddleName[0]}.` : ""}` ||
              ""}
          </h4>
          <div className="flex flex-col gap-2 origin-top-left scale-[0.95]">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-tight text-muted-foreground">
                Guardian Address
              </span>
            </div>
            <p className="text-xs text-card-foreground leading-relaxed bg-card p-3 rounded-lg shadow-md">
              {familyData?.guardianAddress || "Not specified"}
            </p>
          </div>
        </div>
      </section>

      {/* SECTION: Financial Profile */}
      <section className="py-6 flex flex-col gap-4">
        <SectionTitle title="Financial Profile" />
        <div className="w-full p-6 rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
          <h3 className="text-xs font-bold uppercase tracking-widest opacity-80 mb-6">
            Financial Profile
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            {/* Left Column: Primary Income */}
            <div className="space-y-1">
              <p className="text-[10px] uppercase opacity-70 flex items-center gap-2">
                <Users className="w-3.5 h-3.5" />
                Combined Family Income
              </p>
              <p className="text-2xl font-black">
                ₱{Number(familyData?.monthlyFamilyIncome || 0).toLocaleString()}
              </p>
            </div>

            {/* Middle Column: Weekly Allowance */}
            <div className="space-y-1 border-primary-foreground/10 md:border-l md:pl-8">
              <p className="text-[10px] uppercase opacity-70 flex items-center gap-2">
                <Banknote className="w-3.5 h-3.5" />
                Weekly Allowance
              </p>
              <p className="text-2xl font-bold">
                ₱{Number(financeData?.weeklyAllowance || 0).toLocaleString()}
              </p>
            </div>

            {/* Right Column: Support Badges */}
            <div className="space-y-3 border-primary-foreground/10 md:border-l md:pl-8">
              <p className="text-[10px] uppercase opacity-70 flex items-center gap-2">
                <Shield className="w-3.5 h-3.5" />
                Financial Support
              </p>
              <div className="space-y-3">
                {financeData?.financialSupport?.length > 0 ? (
                  financeData.financialSupport
                    .split(",")
                    .map((source: string, index: number) => (
                      <div key={index} className="flex items-center gap-3">
                        {/* A simple decorative dot or small icon */}
                        <div className="h-1.5 w-1.5 rounded-full bg-primary-foreground" />
                        <span className="text-sm font-medium leading-none">
                          {source.trim()}
                        </span>
                      </div>
                    ))
                ) : (
                  <span className="text-xs text-muted-foreground italic">
                    None specified
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function EducationBackgroundView({ educationData }: any) {
  const levels = [
    {
      id: "shs",
      label: "Senior High School",
      data: educationData?.find(
        (data: any) => data.educationalLevel === "Senior High School",
      ),
    },
    {
      id: "jhs",
      label: "Junior High School",
      data: educationData?.find(
        (data: any) => data.educationalLevel === "Junior High School",
      ),
    },
    {
      id: "elem",
      label: "Elementary",
      data: educationData?.find(
        (data: any) => data.educationalLevel === "Elementary",
      ),
    },
  ];

  return (
    <div className="p-2 sm:p-4 animate-in slide-in-from-bottom-4 duration-500">
      <SectionTitle title="Academic History" />

      <div className="mt-8 sm:mt-10 relative border-l-2 border-dashed border-border ml-1 sm:ml-2 space-y-8 sm:space-y-12">
        {levels.map((level) => (
          <div key={level.id} className="relative pl-7 sm:pl-10">
            {/* The Timeline Node */}
            <div className="absolute -left-[9px] sm:-left-[11px] top-0 w-4 h-4 sm:w-5 sm:h-5 rounded-full border-4 border-card bg-primary shadow-sm" />

            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="flex-1">
                {/* School Level Header */}
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary ">
                    {level.label}
                  </span>
                  <span className="text-xs font-bold text-muted-foreground">
                    Class of {level.data?.yearCompleted || "----"}
                  </span>
                </div>

                {/* School Name & Type */}
                <h4 className="text-lg font-bold text-card-foreground">
                  {level.data?.schoolName || "School Name Not Specified"}
                </h4>

                <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                  <MapPinIcon className="w-3 h-3" />
                  {level.data?.location || "Location not provided"}
                </p>

                {/* Awards Section - Styled as Tags */}
                {level.data?.awards && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {level.data.awards
                      .split(",")
                      .map((award: string, i: number) => (
                        <span
                          key={i}
                          className="text-[10px] font-semibold bg-muted text-card-foreground border border-border px-2 py-1 rounded-md shadow-sm"
                        >
                          <Trophy className="w-3 h-3 mr-2 inline" />
                          {award.trim()}
                        </span>
                      ))}
                  </div>
                )}
              </div>

              {/* School Type Badge */}
              <div className="hidden md:block">
                <span
                  className={`text-[10px] font-bold uppercase px-3 py-1 rounded-full border ${
                    level.data?.schoolType === "Public"
                      ? "border-blue-200 bg-blue-50 text-blue-700"
                      : "border-orange-200 bg-orange-50 text-orange-700"
                  }`}
                >
                  {level.data?.schoolType || "Private"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function HealthInformationView({ healthData }: any) {
  // Logic to determine badge color based on remark
  const getStatusColor = (remark: string) => {
    if (!remark || remark.toLowerCase() === "no problem")
      return "bg-green-50 text-green-700 border-green-200";
    return "bg-amber-50 text-amber-700 border-amber-200";
  };

  const physicalStats = [
    { label: "Vision", value: healthData?.visionRemark, icon: Eye },
    { label: "Hearing", value: healthData?.hearingRemark, icon: Ear },
    {
      label: "Mobility",
      value: healthData?.mobilityRemark,
      icon: Accessibility,
    },
    { label: "Speech", value: healthData?.speechRemark, icon: MessageSquare },
    {
      label: "General Health",
      value: healthData?.generalHealthRemark,
      icon: Activity,
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      {/* SECTION 1: Physical Status Indicators */}
      <section>
        <SectionTitle title="Physical Remarks" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {physicalStats.map((stat) => (
            <div
              key={stat.label}
              className={`p-4 rounded-xl border border-border bg-card shadow-sm hover:shadow-lg transition-shadow cursor-default group `}
            >
              <div className="flex items-center gap-3 mb-3 origin-top-left scale-[0.95]">
                <div className="p-2 rounded-lg bg-muted text-muted-foreground group-hover:bg-primary/30 group-hover:text-primary transition-colors">
                  <stat.icon size={18} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors">
                  {stat.label}
                </span>
              </div>
              <div
                className={`text-xs font-bold px-2 py-1 rounded border w-fit ${getStatusColor(stat.value)}`}
              >
                {stat.value || "No Data"}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 2: General Health & Clinical History */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Clinical History Card */}
        <div className="lg:col-span-3 p-6 rounded-2xl border border-primary/20 bg-primary/[0.02] relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <UserCheck size={80} />
          </div>

          <h3 className="text-xs font-bold uppercase tracking-widest text-primary mb-6">
            Professional Consultation
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-4">
            <InfoItem
              label="Consulted Professional"
              value={healthData?.consultedProfessional}
            />
            <InfoItem label="Reason" value={healthData?.consultationReason} />
            <InfoItem
              label="Sessions"
              value={`${healthData?.numberOfSessions} Session(s)`}
            />

            <div className="sm:col-span-2 md:col-span-3 flex items-center gap-4 mt-2 p-3 bg-card rounded-lg border border-border/50">
              <div>
                <p className="text-[9px] font-bold text-muted-foreground uppercase">
                  Period
                </p>
                <p className="text-xs font-medium">
                  {formatDate(healthData?.dateStarted)} —{" "}
                  {formatDate(healthData?.dateConcluded)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Sub-components for cleaner code
function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="group flex flex-col origin-top-left scale-100 sm:scale-[0.9]">
      <span className="text-[10px] font-bold uppercase tracking-tight text-muted-foreground group-hover:text-primary transition-colors mb-1">
        {label}
      </span>
      <span className="text-xs font-medium text-card-foreground border-l-2 border-transparent group-hover:border-primary/30 pl-0 group-hover:pl-3 transition-all origin-left">
        {value || "---"}
      </span>
    </div>
  );
}

function StatBox({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: number;
  highlight?: boolean;
}) {
  return (
    <div
      className={`p-3 rounded-xl border-2 ${highlight ? "border-primary/50 bg-primary/5" : "border-border"} text-center`}
    >
      <p className="text-md font-bold text-card-foreground mb-1">
        {value || 0}
      </p>
      <div className="flex items-center justify-center text-center">
        <p className="text-[8px] font-medium uppercase text-muted-foreground leading-tight">
          {label}
        </p>
      </div>
    </div>
  );
}

function SectionTitle({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-1 w-12 bg-primary rounded-full" />
      <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground/80">
        {title}
      </h3>
    </div>
  );
}
