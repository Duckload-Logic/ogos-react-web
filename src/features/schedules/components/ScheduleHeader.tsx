/**
 * ScheduleHeader Component
 * Displays the main title and description for the schedules page
 */

export interface ScheduleHeaderProps {
  title: string;
  description: string;
}

export function ScheduleHeader({ title, description }: ScheduleHeaderProps) {
  return (
    <div className="bg-primary py-8 text-primary-foreground md:py-12">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <h1 className="text-3xl font-bold md:text-4xl">{title}</h1>
        <p className="mt-2 text-base opacity-90 md:text-lg">{description}</p>
      </div>
    </div>
  );
}
