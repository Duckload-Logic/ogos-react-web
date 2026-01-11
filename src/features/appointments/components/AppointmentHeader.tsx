import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface AppointmentHeaderProps {
  backTo?: string;
  title: string;
  subtitle?: string;
}

export default function AppointmentHeader({
  backTo = "/student",
  title,
  subtitle,
}: AppointmentHeaderProps) {
  return (
    <div className="bg-primary text-primary-foreground py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center gap-4">
          <Link to={backTo}>
            <ArrowLeft className="w-6 h-6 hover:opacity-80 transition" />
          </Link>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">{title}</h1>
            {subtitle && (
              <p className="text-base md:text-lg mt-2 opacity-90">{subtitle}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
