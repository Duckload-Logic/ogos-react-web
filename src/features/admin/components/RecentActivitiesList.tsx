interface RecentActivity {
  action: string;
  student: string;
  time: string;
}

interface RecentActivitiesListProps {
  activities: RecentActivity[];
}

export default function RecentActivitiesList({
  activities,
}: RecentActivitiesListProps) {
  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
      <h3 className="font-semibold text-foreground mb-4">Recent Activities</h3>
      <div className="space-y-3">
        {activities.map((activity, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0"
          >
            <div>
              <p className="font-medium text-foreground">{activity.action}</p>
              <p className="text-sm text-muted-foreground">{activity.student}</p>
            </div>
            <p className="text-xs text-muted-foreground">{activity.time}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
