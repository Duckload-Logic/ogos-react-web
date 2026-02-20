/**
 * AdmissionSlipsSection Component
 * Displays the excuse slips section with empty state
 */

import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";

export function AdmissionSlipsSection() {
  return (
    <section>
      <h2 className="text-2xl font-bold text-primary mb-6 flex items-center gap-2">
        <FileText className="w-6 h-6" />
        Your Reviewed Excuse Slips
      </h2>

      <Card className="border-0 shadow-sm">
        <CardContent className="pt-12 pb-12 text-center">
          <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500 text-lg">
            No reviewed excuse slips found.
          </p>
          <p className="text-gray-500 text-base mt-2">
            Submit your excuse slips for review in the Excuse Slip section.
          </p>
          <Link to="/student/excuse-slip" className="mt-4 inline-block">
            <Button className="bg-primary hover:bg-secondary text-primary-foreground hover:text-gray-900 font-semibold transition-all duration-300">
              Upload Excuse Slip
            </Button>
          </Link>
        </CardContent>
      </Card>
    </section>
  );
}
