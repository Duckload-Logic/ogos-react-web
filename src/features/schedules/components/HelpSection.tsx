/**
 * HelpSection Component
 * Displays help information and contact details
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function HelpSection() {
  return (
    <Card className="mt-8 border-0 shadow-sm">
      <CardHeader className="border-b border-blue-200 bg-blue-50">
        <CardTitle className="text-lg text-blue-900">Need Help?</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <p className="mb-4 text-gray-700">
          If you have any questions about your appointments or excuse slips:
        </p>
        <ul className="space-y-2 text-gray-700">
          <li className="flex gap-2">
            <span className="font-bold text-primary">•</span>
            <span>Contact the Guidance Office during office hours</span>
          </li>
          <li className="flex gap-2">
            <span className="font-bold text-primary">•</span>
            <span>Email: guidance@pupt.edu.ph</span>
          </li>
          <li className="flex gap-2">
            <span className="font-bold text-primary">•</span>
            <span>Phone: (02) 1234-5678</span>
          </li>
        </ul>
      </CardContent>
    </Card>
  );
}
