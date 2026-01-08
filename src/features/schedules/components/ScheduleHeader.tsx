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
    <div className="bg-primary text-primary-foreground py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <h1 className="text-3xl md:text-4xl font-bold">{title}</h1>
        <p className="text-base md:text-lg mt-2 opacity-90">{description}</p>
      </div>
    </div>
  );
}
