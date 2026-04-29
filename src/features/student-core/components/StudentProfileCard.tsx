import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { User, Mail, ArrowRight, ExternalLink, FileText } from "lucide-react";
import { formatDate } from "@/features/schedules/utils/formatters";

interface StudentProfileCardProps {
  firstName?: string;
  lastName?: string;
  suffixName?: string;
  middleName?: string;
  email?: string;
  studentCorUrl?: string;
  isFormIncomplete: boolean;
  animationDelay?: string;
}

export function StudentProfileCard({
  firstName,
  lastName,
  suffixName,
  middleName,
  email,
  studentCorUrl,
  isFormIncomplete,
  animationDelay = "0.3s",
}: StudentProfileCardProps) {
  return (
    <Card
      className="animate-fade-in-up mb-6"
      style={{ animationDelay, animationFillMode: "both" }}
    >
      <CardHeader className="pb-4">
        <CardTitle className="text-base">Student Profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Personal Tab Label */}
          <div className="md:col-span-1">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Personal
            </h3>
            <div className="flex gap-4">
              <User className="mt-0.5 h-4 w-4 flex-shrink-0 text-muted-foreground" />
              <div className="flex-1">
                <p className="mb-1 text-xs uppercase tracking-wide text-muted-foreground">
                  Full Name
                </p>
                <p className="text-sm font-semibold text-foreground">
                  {lastName}, {firstName}{" "}
                  {middleName && typeof middleName === "string"
                    ? middleName.charAt(0) + "."
                    : ""}{" "}
                  {suffixName}
                </p>
                {studentCorUrl && (
                  <div className="mt-2">
                    <a
                      href={`${import.meta.env.VITE_API_BASE_URL}${studentCorUrl}`}

                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex w-fit items-center gap-1.5 rounded-md bg-primary/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-primary transition-colors hover:bg-primary/20"
                    >
                      <FileText className="h-3 w-3" />
                      <span>Current COR</span>
                      <ExternalLink className="h-2.5 w-2.5 opacity-0 transition-opacity group-hover:opacity-100" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Contact Tab Label */}
          <div className="md:col-span-1">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Contact
            </h3>
            <div className="flex gap-4">
              <Mail className="mt-0.5 h-4 w-4 flex-shrink-0 text-muted-foreground" />
              <div className="flex-1">
                <p className="mb-1 text-xs uppercase tracking-wide text-muted-foreground">
                  Email Address
                </p>
                <p className="text-sm font-semibold text-foreground">
                  {email || "-"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
