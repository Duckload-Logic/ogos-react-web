/**
 * HelpSection Component
 * Displays help information and contact details
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function HelpSection() {
  return (
    <Card className="border-0 shadow-sm mt-8">
      <CardHeader className="bg-blue-50 border-b border-blue-200">
        <CardTitle className="text-lg text-blue-900">Need Help?</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <p className="text-gray-700 mb-4">
          If you have any questions about your appointments or excuse slips:
        </p>
        <ul className="space-y-2 text-gray-700">
          <li className="flex gap-2">
            <span className="text-primary font-bold">•</span>
            <span>Contact the Guidance Office during office hours</span>
          </li>
          <li className="flex gap-2">
            <span className="text-primary font-bold">•</span>
            <span>Email: guidance@pupt.edu.ph</span>
          </li>
          <li className="flex gap-2">
            <span className="text-primary font-bold">•</span>
            <span>Phone: (02) 1234-5678</span>
          </li>
        </ul>
      </CardContent>
    </Card>
  );
}
