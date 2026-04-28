import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface HeaderProps {
  backTo?: string;
  title: string;
  subtitle?: string;
}

export default function Header({
  backTo = "/student",
  title,
  subtitle,
}: HeaderProps) {
  return (
    <div className="bg-primary py-8 text-primary-foreground md:py-12">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="flex items-center gap-4">
          <Link to={backTo}>
            <ArrowLeft className="h-6 w-6 transition hover:opacity-80" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold md:text-4xl">{title}</h1>
            {subtitle && (
              <p className="mt-2 text-base opacity-90 md:text-lg">{subtitle}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
