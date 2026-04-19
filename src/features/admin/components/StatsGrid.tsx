interface Stat {
  label: string;
  value: number;
  color: string;
}

interface StatsGridProps {
  stats: Stat[];
}

export default function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={`${stat.color} rounded-lg p-4`}
        >
          <p className="text-sm font-medium opacity-75">{stat.label}</p>
          <p className="mt-1 text-3xl font-bold">{stat.value}</p>
        </div>
      ))}
    </div>
  );
}
