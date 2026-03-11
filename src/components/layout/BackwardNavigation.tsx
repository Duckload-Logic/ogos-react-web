import { CircleChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function BackwardNavigation() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="flex flex-col items-start justify-start gap-8">
      <button
        type="button"
        onClick={handleBack}
        className="flex gap-2 group items-center text-sm text-foreground/70
                   font-medium hover:text-primary transition-colors w-max"
      >
        <div className="flex items-center gap-2">
          <CircleChevronLeft
            size={20}
            className="transform group-hover:-translate-x-1
                       transition-transform duration-300"
          />
          <span className="text-sm font-medium">Back</span>
        </div>
      </button>
    </div>
  );
}
