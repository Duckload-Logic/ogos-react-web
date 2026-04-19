/**
 * AdmissionSlipsSection Component
 * Displays the excuse slips section with empty state
 */

import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { cn } from "@/lib/utils";

export function AdmissionSlipsSection() {
  return (
    <section>
      <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold text-primary">
        <FileText className="h-6 w-6" />
        Your Reviewed Excuse Slips
      </h2>

      <Card className="border-0 shadow-sm">
        <CardContent className="pb-12 pt-12 text-center">
          <FileText className="mx-auto mb-4 h-16 w-16 text-gray-400" />
          <p className="text-lg text-gray-500">
            No reviewed excuse slips found.
          </p>
          <p className="mt-2 text-base text-gray-500">
            Submit your excuse slips for review in the Excuse Slip section.
          </p>
          <Link
            to="/student/excuse-slip"
            className="mt-4 inline-block"
          >
            <Button
              className={cn(
                "bg-primary font-semibold text-primary-foreground",
                "transition-all duration-300 hover:bg-secondary",
                "hover:text-gray-900",
              )}
            >
              Upload Excuse Slip
            </Button>
          </Link>
        </CardContent>
      </Card>
    </section>
  );
}
