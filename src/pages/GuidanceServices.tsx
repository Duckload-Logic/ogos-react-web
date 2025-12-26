import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

const PROGRAMS = [
  { title: "Counseling" },
  { title: "Appraisal/Testing" },
  { title: "Individual Inventory" },
  { title: "Excuse Slip" },
];

export default function GuidanceServices() {
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    // To check if user has completed the form
    const formCompleted = localStorage.getItem("formCompleted");
    if (!formCompleted) {
      setShowForm(true);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-primary to-primary-dark text-primary-foreground py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <h1 className="text-3xl md:text-4xl font-bold">Guidance Services</h1>
          <p className="text-base md:text-lg mt-2 opacity-90">
            Supporting your academic and personal growth
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-8 py-6 sm:py-8 md:py-12">
        {/* Personal Data Sheet Form Button */}
        {showForm && (
          <div className="mb-8">
            <Link to="/form">
              <Button className="w-full bg-primary hover:bg-primary-dark text-primary-foreground font-semibold">
                Fill Out Personal Data Sheet
              </Button>
            </Link>
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
