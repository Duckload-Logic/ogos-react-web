import { ReactNode } from "react";
import { Spinner } from "@/components/shared";
import { cn } from "@/lib/utils";

interface StatementLayoutProps {
  isLoading: boolean;
  children: ReactNode;
}

export function StatementLayout({ isLoading, children }: StatementLayoutProps) {
  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div
      className={cn(
        "min-h-screen rounded-xl bg-gradient-to-b from-background",
        "to-card px-4 py-12 sm:px-6 lg:px-8",
      )}
    >
      <div className="mx-auto max-w-4xl">{children}</div>
    </div>
  );
}
