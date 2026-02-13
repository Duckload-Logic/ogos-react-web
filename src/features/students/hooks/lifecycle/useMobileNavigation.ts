import { useEffect, Dispatch, SetStateAction } from 'react';

interface UseMobileNavigationProps {
  setIsMobileNav: Dispatch<SetStateAction<boolean>>;
}

/**
 * Custom hook for responsive mobile navigation.
 * Tracks window resize events and determines if mobile navigation is active.
 * Mobile breakpoint: 1024px (lg breakpoint)
 *
 * @param setIsMobileNav - Callback to update mobile navigation state
 */
export const useMobileNavigation = ({
  setIsMobileNav,
}: UseMobileNavigationProps): void => {
  useEffect(() => {
    const handleResize = () => {
      setIsMobileNav(window.innerWidth < 1024);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
};
