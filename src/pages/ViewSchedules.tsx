import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Calendar, FileText, Trash2 } from "lucide-react";

interface Appointment {
  id: string;
  date: string;
  time: string;
  reason: string;
  counselor: string;
  location: string;
}

interface ReviewedExcuseSlip {
  id: string;
  date: string;
  reason: string;
  status: "approved" | "rejected";
  reviewedDate: string;
}

const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: "1",
    date: "2025-09-23",
    time: "08:00:00",
    reason: "Personal counseling",
    counselor: "Mrs. Santos",
    location: "Guidance Office, Building A",
  },
  {
    id: "2",
    date: "2025-09-25",
    time: "10:30:00",
    reason: "Academic planning",
    counselor: "Mr. Cruz",
    location: "Guidance Office, Building A",
  },
];

const MOCK_EXCUSE_SLIPS: ReviewedExcuseSlip[] = [];

export default function ViewSchedules() {
  const handleCancelAppointment = (id: string) => {
    if (window.confirm("Are you sure you want to cancel this appointment?")) {
      alert(`Appointment ${id} cancelled successfully`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-primary text-primary-foreground py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <h1 className="text-3xl md:text-4xl font-bold">My Schedules</h1>
          <p className="text-base md:text-lg mt-2 opacity-90">
            View your appointments and excuse slip status
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-8 py-6 sm:py-8 md:py-12">
        {/* Appointments Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-primary mb-6 flex items-center gap-2">
            <Calendar className="w-6 h-6" />
            Your Upcoming Appointments
          </h2>

          {MOCK_APPOINTMENTS.length === 0 ? (
            <Card className="border-0 shadow-sm">
              <CardContent className="pt-12 pb-12 text-center">
                <Calendar className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500 text-lg">
                  No upcoming appointments scheduled
                </p>
                <Link to="/schedule" className="mt-4 inline-block">
                  <Button className="bg-primary hover:bg-primary-dark text-primary-foreground font-semibold">
                    Schedule an Appointment
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {MOCK_APPOINTMENTS.map((appointment) => (
                <Card
                  key={appointment.id}
                  className="border-0 shadow-sm hover:shadow-md transition-shadow"
                >
                  <CardHeader className="bg-blue-50 border-b pb-3">
                    <CardTitle className="text-lg text-gray-900">
                      {appointment.reason}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-semibold text-gray-600">
                          Date
                        </p>
                        <p className="text-base font-semibold text-gray-900">
                          {new Date(appointment.date).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            },
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-600">
                          Time
                        </p>
                        <p className="text-base font-semibold text-gray-900">
                          {appointment.time.substring(0, 5)}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-gray-600">
                        Counselor
                      </p>
                      <p className="text-base text-gray-900">
                        {appointment.counselor}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-gray-600">
                        Location
                      </p>
                      <p className="text-base text-gray-900">
                        {appointment.location}
                      </p>
                    </div>

                    <div className="pt-4 flex gap-3">
                      <Button
                        variant="outline"
                        className="flex-1 border-blue-500 text-blue-600 hover:bg-blue-50 bg-blue-50"
                      >
                        Reschedule
                      </Button>
                      <Button
                        onClick={() => handleCancelAppointment(appointment.id)}
                        variant="outline"
                        className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Excuse Slips Section */}
        <section>
          <h2 className="text-2xl font-bold text-primary mb-6 flex items-center gap-2">
            <FileText className="w-6 h-6" />
            Your Reviewed Excuse Slips
          </h2>

          {MOCK_EXCUSE_SLIPS.length === 0 ? (
            <Card className="border-0 shadow-sm">
              <CardContent className="pt-12 pb-12 text-center">
                <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500 text-lg">
                  No reviewed excuse slips found.
                </p>
                <p className="text-gray-500 text-base mt-2">
                  Submit your excuse slips for review in the Excuse Slip
                  section.
                </p>
                <Link to="/excuse-slip" className="mt-4 inline-block">
                  <Button className="bg-primary hover:bg-primary-dark text-primary-foreground font-semibold">
                    Upload Excuse Slip
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {MOCK_EXCUSE_SLIPS.map((slip) => (
                <Card
                  key={slip.id}
                  className="border-0 shadow-sm hover:shadow-md transition-shadow"
                >
                  <CardHeader className="bg-purple-50 border-b pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg text-gray-900">
                        {slip.reason}
                      </CardTitle>
                      {slip.status === "approved" ? (
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                          Approved
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-semibold">
                          Rejected
                        </span>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-3">
                    <div>
                      <p className="text-sm font-semibold text-gray-600">
                        Absence Date
                      </p>
                      <p className="text-base font-semibold text-gray-900">
                        {new Date(slip.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-600">
                        Reviewed Date
                      </p>
                      <p className="text-base text-gray-900">
                        {slip.reviewedDate}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Quick Actions */}
        <Card className="border-0 shadow-sm mt-12">
          <CardHeader className="bg-amber-50 border-b">
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link to="/schedule">
                <Button className="w-full bg-primary hover:bg-primary-dark text-primary-foreground font-semibold">
                  Schedule New Appointment
                </Button>
              </Link>
              <Link to="/excuse-slip">
                <Button className="w-full bg-primary hover:bg-primary-dark text-primary-foreground font-semibold">
                  Upload Excuse Slip
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Help Section */}
        <Card className="border-0 shadow-sm mt-8">
          <CardHeader className="bg-blue-50 border-b border-blue-200">
            <CardTitle className="text-lg text-blue-900">Need Help?</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-gray-700 mb-4">
              If you have any questions about your appointments or excuse slips:
            </p>
            <ul className="space-y-2 text-gray-700">
              <li className="flex gap-2">
                <span className="text-primary font-bold">•</span>
                <span>Contact the Guidance Office during office hours</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-bold">•</span>
                <span>Email: guidance@pupt.edu.ph</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-bold">•</span>
                <span>Phone: (02) 1234-5678</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
