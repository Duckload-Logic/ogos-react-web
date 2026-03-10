import React from "react";

export function SectionContainer({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-6 space-y-4 p-6 bg-card border border-border rounded-lg transition-colors shadow-lg">
      {title && (
        <h3 className="text-lg font-semibold text-card-foreground pb-3 border-b-4 rounded-sm border-primary">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
}
