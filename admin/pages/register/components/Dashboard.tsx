import Layout from "@/components/Layout";
import { Link } from "react-router-dom";
import {
  Users,
  Calendar,
  FileText,
  BarChart3,
  Clock,
  AlertCircle,
} from "lucide-react";

export default function Dashboard() {
  const stats = [
    {
      title: "Total Students",
      value: "324",
      icon: Users,
      color: "bg-blue-100 text-blue-600",
      href: "/student-records",
    },
    {
      title: "Appointments Today",
      value: "8",
      icon: Calendar,
      color: "bg-green-100 text-green-600",
      href: "/appointments",
    },
    {
      title: "Pending Reviews",
      value: "12",
      icon: AlertCircle,
      color: "bg-yellow-100 text-yellow-600",
      href: "/review-excuses",
    },
    {
      title: "Pending Excuses",
      value: "5",
      icon: FileText,
      color: "bg-purple-100 text-purple-600",
      href: "/review-excuses",
    },
  ];

  const quickActions = [
    {
      title: "View Student Records",
      description: "Browse and manage student information",
      icon: Users,
      href: "/student-records",
    },
    {
      title: "Schedule Appointment",
      description: "Create or manage student appointments",
      icon: Calendar,
      href: "/appointments",
    },
    {
      title: "Review Excuses",
      description: "Check submitted excuse slips",
      icon: FileText,
      href: "/review-excuses",
    },
    {
      title: "View Reports",
      description: "Generate and view system reports",
      icon: BarChart3,
      href: "/reports",
    },
  ];

  const recentActivities = [
    {
      action: "Appointment Scheduled",
      student: "Juan Cruz",
      time: "2 hours ago",
    },
    {
      action: "Excuse Slip Submitted",
      student: "Maria Santos",
      time: "5 hours ago",
    },
    {
      action: "Student Record Updated",
      student: "Carlos Reyes",
      time: "1 day ago",
    },
    {
      action: "Appointment Completed",
      student: "Angela Dela Cruz",
      time: "2 days ago",
    },
  ];

  return (
    <Layout title="Dashboard">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => {
          const IconComponent = stat.icon;
          return (
            <Link
              key={stat.title}
              to={stat.href}
              className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer border border-gray-200"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-primary mt-2">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <IconComponent size={24} />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickActions.map((action) => {
              const IconComponent = action.icon;
              return (
                <Link
                  key={action.title}
                  to={action.href}
                  className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-all hover:border-primary border border-gray-200 group"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary group-hover:text-white transition-colors">
                      <IconComponent
                        size={24}
                        className="text-primary group-hover:text-white"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {action.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {action.description}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Recent Activity
          </h2>
          <div className="bg-white rounded-lg shadow border border-gray-200">
            <div className="divide-y">
              {recentActivities.map((activity, idx) => (
                <div
                  key={idx}
                  className="p-4 hover:bg-gray-50 transition-colors"
                >
                  <p className="text-sm font-medium text-foreground">
                    {activity.action}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    {activity.student}
                  </p>
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <Clock size={12} />
                    {activity.time}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
