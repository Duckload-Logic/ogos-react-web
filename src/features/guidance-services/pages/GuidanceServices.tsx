import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { checkStudentOnboardingStatus, studentService } from "@/features/students/services/service";
import { useAuth } from "@/context";

const PROGRAMS = [
  { title: "Counseling" },
  { title: "Appraisal/Testing" },
  { title: "Individual Inventory" },
  { title: "Excuse Slip" },
];

export default function GuidanceServices() {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [additionalInfo, setAdditionalInfo] = useState<any>(null);

  useEffect(() => {
    setIsPageLoaded(true);
  }, []);

  useEffect(() => {
    if (!user?.id) return;
    
    const fetchProfile = async () => {
      try {
        const data = await studentService.getStudentProfile(user.id);
        setAdditionalInfo(data);
      } catch (err) {
        console.error('Error fetching profile:', err);
        // Continue without additional info if fetch fails
      }
    };

    fetchProfile();
  }, [user?.id]);

  useEffect(() => {
    const checkFormStatus = async () => {
      try {
        if (!user?.id) {
          console.warn('User not authenticated or user ID missing');
          return;
        }
        const completed = await checkStudentOnboardingStatus(user.id);
        setShowForm(!completed);
      } catch (err) {
        console.error('Error checking onboarding status:', err);
      } finally {
      }
    };

    checkFormStatus();
  }, [user?.id]);

  return (
    <div className="min-h-screen bg-gray-50">
      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideUpStagger {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .alert-banner {
          animation: slideUp 0.5s cubic-bezier(0.4, 0, 0.2, 1) 0.1s both;
        }
        .programs-section {
          animation: slideUp 0.5s cubic-bezier(0.4, 0, 0.2, 1) 0.2s both;
        }
        .program-card {
          animation: slideUpStagger 0.5s cubic-bezier(0.4, 0, 0.2, 1) both;
        }
        .program-card:nth-child(1) { animation-delay: 0.3s; }
        .program-card:nth-child(2) { animation-delay: 0.35s; }
        .program-card:nth-child(3) { animation-delay: 0.4s; }
        .program-card:nth-child(4) { animation-delay: 0.45s; }
      `}</style>
      {/* Hero Section */}
      <div className="bg-primary text-primary-foreground py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <h1 className="text-3xl md:text-4xl font-bold">Guidance Services</h1>
          <p className="text-base md:text-lg mt-2 opacity-90">
            Supporting your academic and personal growth
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-8 py-6 sm:py-8 md:py-12">
        {/* URGENT: PDS Completion Alert Banner */}
        {showForm && (
          <div className="mb-8 bg-yellow-100 border-l-4 border-yellow-500 p-4 sm:p-6 rounded-lg shadow-md alert-banner">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-bold text-sm text-yellow-800 mb-1">
                  Important: Complete Your Personal Data Sheet
                </h3>
                <p className="text-yellow-700 text-xs sm:text-sm mb-2">
                  You must complete this form to access all guidance services. Your information helps us provide better support and counseling.
                </p>
                <Link to="/student/form">
                  <Button className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold text-xs py-1 px-3 h-auto">
                    Complete Form Now
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* How Can We Help You Section */}
        <section className="bg-white rounded-lg shadow-sm p-5 md:p-6 mb-8 programs-section">
          <h2 className="text-lg md:text-xl font-bold mb-4 text-primary">
            How Can We Help You?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PROGRAMS.map((program, index) => (
              <div key={index} className="border-l-4 border-primary pl-3 py-3 transition-all duration-300 hover:bg-gray-50 hover:pl-4 rounded cursor-pointer program-card">
                <h3 className="font-semibold text-sm md:text-base text-gray-900 transition-colors duration-300 hover:text-primary">
                  {program.title}
                </h3>
              </div>
            ))}
          </div>
        </section>

        {/* Student Dashboard Section */}
        <section className="bg-white rounded-lg shadow-sm p-5 md:p-6 mb-8 programs-section" style={{ animationDelay: '0.25s' }}>
          <h2 className="text-lg md:text-xl font-bold mb-4 text-primary">
            Student Dashboard
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name Card */}
            <div className="pb-4 border-b border-gray-200">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Name</label>
              <p className="text-gray-900 font-bold text-sm mt-1">
                {user?.lastName}, {user?.firstName} {user?.middleName ? user.middleName.charAt(0) + '.' : ''}
              </p>
            </div>

            {/* Student Number Card */}
            <div className="pb-4 border-b border-gray-200">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Student Number</label>
              <p className="text-gray-900 font-bold text-sm mt-1">{additionalInfo?.studentProfile?.studentNumber || '-'}</p>
            </div>

            {/* Contact Card */}
            <div className="pb-4">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Contact</label>
              <p className="text-gray-900 font-bold text-sm mt-1">{additionalInfo?.studentProfile?.contactNo || '-'}</p>
            </div>

            {/* Email Card */}
            <div className="pb-4">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Email</label>
              <p className="text-gray-900 font-bold text-sm mt-1">{user?.email || '-'}</p>
            </div>
          </div>
        </section>

        {/* I Hereby Statement Section */}
        {!showForm && (
          <section className="bg-green-50 border-l-4 border-green-500 rounded-lg p-5 md:p-6 mb-8 programs-section" style={{ animationDelay: '0.3s' }}>
            <p className="text-sm md:text-base text-gray-700 leading-relaxed">
              <span className="font-semibold text-green-700">I hereby declare</span> that all the information stated in this document is true and correct to the best of my knowledge and belief.
            </p>
          </section>
        )}
      </div>
    </div>
  );
}