import { CardBlock } from "./";

export default function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: any;
}) {
  return (
    <CardBlock icon={Icon} title={label}>
      <p className="text-sm font-semibold text-card-foreground">{value}</p>
    </CardBlock>
  );
}
