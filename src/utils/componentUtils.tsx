import { useEffect, RefObject } from "react";
import { useLocation } from "react-router-dom";

interface ScrollToTopProps {
  targetRef?: RefObject<HTMLDivElement>;
}

export default function ScrollToTop({ targetRef }: ScrollToTopProps) {
  const { pathname } = useLocation();

  useEffect(() => {
    if (targetRef?.current) {
      targetRef.current.scrollTo({ top: 0, behavior: "auto" });
    } else {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  }, [pathname, targetRef]);

  return null;
}
