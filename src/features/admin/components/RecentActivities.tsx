interface RecentActivity {
  action: string;
  student: string;
  time: string;
}

interface RecentActivitiesProps {
  activities: RecentActivity[];
}

export default function RecentActivities({
  activities,
}: RecentActivitiesProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow">
      <h3 className="mb-4 font-semibold text-foreground">Recent Activities</h3>
      <div className="space-y-3">
        {activities.map((activity, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between border-b border-gray-100 py-2 last:border-b-0"
          >
            <div>
              <p className="font-medium text-foreground">{activity.action}</p>
              <p className="text-sm text-muted-foreground">
                {activity.student}
              </p>
            </div>
            <p className="text-xs text-muted-foreground">{activity.time}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
