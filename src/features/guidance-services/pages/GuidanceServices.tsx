import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { checkStudentOnboardingStatus } from "@/features/students/services/service";
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
          <div className="mb-8 bg-yellow-100 border-l-4 border-yellow-500 p-4 sm:p-6 rounded-lg shadow-md">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="font-bold text-lg text-yellow-800 mb-2">
                  Important: Complete Your Personal Data Sheet
                </h3>
                <p className="text-yellow-700 text-sm sm:text-base mb-4">
                  You must complete this form to access all guidance services. Your information helps us provide better support and counseling.
                </p>
                <Link to="/student/form">
                  <Button className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold">
                    Complete Form Now
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* How Can We Help You Section */}
        <section className="bg-white rounded-lg shadow-sm p-6 md:p-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-primary">
            How Can We Help You?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PROGRAMS.map((program, index) => (
              <div key={index} className="border-l-4 border-primary pl-4 py-2">
                <h3 className="font-semibold text-lg text-gray-900">
                  {program.title}
                </h3>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}