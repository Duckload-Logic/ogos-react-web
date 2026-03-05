import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { User, Mail, ArrowRight } from "lucide-react";

interface StudentProfileCardProps {
  firstName?: string;
  lastName?: string;
  middleName?: string;
  email?: string;
  isFormIncomplete: boolean;
  animationDelay?: string;
}

export function StudentProfileCard({
  firstName,
  lastName,
  middleName,
  email,
  isFormIncomplete,
  animationDelay = "0.3s",
}: StudentProfileCardProps) {
  return (
    <Card
      className="animate-fade-in-up mb-6"
      style={{ animationDelay, animationFillMode: "both" }}
    >
      <CardHeader className="pb-4">
        <CardTitle className="text-base flex items-center gap-2">
          <User className="h-4 w-4" />
          Student Profile
        </CardTitle>
        <CardDescription>Your personal information on record</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex gap-4">
            <User className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-1" />
            <div className="flex-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                Full Name
              </p>
              <p className="text-sm font-semibold text-foreground">
                {lastName}, {firstName}{" "}
                {middleName && typeof middleName === "string"
                  ? middleName.charAt(0) + "."
                  : ""}
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <Mail className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-1" />
            <div className="flex-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                Email Address
              </p>
              <p className="text-sm font-semibold text-foreground">
                {email || "-"}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
