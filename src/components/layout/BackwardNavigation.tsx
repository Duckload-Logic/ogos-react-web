import { CircleChevronLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

interface BackwardNavigationProps {
  to?: string;
  fallback?: string;
  className?: string;
}

export default function BackwardNavigation({
  to,
  fallback,
  className = "",
}: BackwardNavigationProps) {
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
      } else if (location.pathname.startsWith("/superadmin")) {
        navigate("/superadmin");
      } else {
        navigate("/student");
      }
    }
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      className={`flex gap-2 group items-center text-sm text-foreground/70 font-medium hover:text-primary transition-colors w-max ${className}`}
    >
      <CircleChevronLeft
        size={18}
        className="transform group-hover:-translate-x-1 transition-transform duration-300"
      />
      <span className="text-sm font-medium">Back</span>
    </button>
  );
}
