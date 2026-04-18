import { CircleChevronLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

interface BackNavProps {
  to?: string;
  fallback?: string;
  className?: string;
}

export default function BackNav({
  to,
  fallback,
  className = "",
}: BackNavProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    if (to) {
      navigate(to);
      return;
    }

    // history.length > 2 usually means there's a previous page in this session
    // However, it's not foolproof. A better check is needed if available,
    // but this is a common heuristic.
    if (window.history.length > 2) {
      navigate(-1);
    } else if (fallback) {
      navigate(fallback);
    } else {
      // Default fallback based on path
      if (location.pathname.startsWith("/admin")) {
        navigate("/admin");
      } else {
        navigate("/student");
      }
    }
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      className={`group flex h-5 w-fit items-center justify-start gap-2 p-0 text-sm font-medium text-foreground/70 transition-colors hover:text-primary ${className}`}
    >
      <CircleChevronLeft
        size={14}
        className="transform transition-transform duration-300 group-hover:-translate-x-1"
      />
      <span className="text-sm font-medium">Back</span>
    </button>
  );
}
