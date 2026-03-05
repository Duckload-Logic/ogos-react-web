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
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <User className="h-4 w-4" />
          Student Profile
        </CardTitle>
        <CardDescription>Your personal information on record</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <User className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
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
          <div className="flex items-center gap-3">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                Email Address
              </p>
              <p className="text-sm font-semibold text-foreground">
                {email || "-"}
              </p>
            </div>
          </div>
        </div>
        <Separator className="my-4" />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge
              variant={isFormIncomplete ? "destructive" : "default"}
              className="text-xs"
            >
              {isFormIncomplete ? "Incomplete" : "Complete"}
            </Badge>
            <span className="text-xs text-muted-foreground">
              Personal Data Sheet
            </span>
          </div>
          {isFormIncomplete && (
            <Link to="/student/form">
              <Button variant="outline" size="sm" className="gap-1 text-xs">
                Complete Now
                <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
