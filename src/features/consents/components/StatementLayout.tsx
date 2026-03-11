import { ReactNode } from "react";
import { LoadingSpinner } from "@/components/shared";

interface StatementLayoutProps {
  isLoading: boolean;
  children: ReactNode;
}

export function StatementLayout({ isLoading, children }: StatementLayoutProps) {
  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen rounded-xl bg-gradient-to-b from-background to-card py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">{children}</div>
    </div>
  );
}
