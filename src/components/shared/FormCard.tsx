/**
 * FormCard Component
 * Reusable card wrapper for forms with title and description
 */

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface FormCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export const FormCard: React.FC<FormCardProps> = ({
  title,
  description,
  children,
  footer,
}) => (
  <Card>
    <CardHeader>
      <CardTitle>{title}</CardTitle>
      {description && <CardDescription>{description}</CardDescription>}
    </CardHeader>
    <CardContent className="space-y-4">
      {children}
    </CardContent>
    {footer && (
      <div className="px-6 py-4 border-t bg-gray-50">
        {footer}
      </div>
    )}
  </Card>
);
