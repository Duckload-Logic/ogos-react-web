import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Appointment, ConcernCategory, TimeSlot } from "../types";
import { DropdownField } from "@/components/form";
import { useCategories } from "../hooks";
import { useState } from "react";

interface AppointmentDetailsFormProps {
  data: Appointment;
  onChange: (name: string, value: any) => void;
  onSubmit: () => void;
  isLoading: boolean;
  isSubmitting: boolean;
}

export default function AppointmentDetailsForm({
  data,
  onChange,
  onSubmit,
  isLoading,
  isSubmitting,
}: AppointmentDetailsFormProps) {
  const { data: categories, isLoading: isCategoriesLoading } = useCategories();
  const isFormValid = data.whenDate && data.timeSlot;

  return (
    <Card className="border border-border shadow-sm bg-card">
      <CardHeader className="bg-gradient-to-r from-muted/50 to-muted border-b border-border rounded-t-md">
        <CardTitle className="text-lg text-foreground">
          Appointment Details
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {/* Reason/Concern Input */}
          <div className="space-y-4">
            <DropdownField
              label="Concern Category"
              value={data?.appointmentCategory?.id}
              onChange={(id) => {
                onChange(
                  "appointmentCategory",
                  categories?.find((c) => c.id === Number(id)),
                );
              }}
              options={categories || []}
              loading={isCategoriesLoading}
              required
            />
            <textarea
              value={data.reason}
              onChange={(e) => {
                onChange("reason", e.target.value);
              }}
              className="w-full border border-border rounded-lg p-3 h-24 resize-none bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
              placeholder="(Optional) Enter your concern or reason for appointment"
              aria-label="Appointment reason or concern"
            />
          </div>

          {/* Appointment Summary */}
          {/* {selectedDate && selectedTime && (
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
              <p className="text-sm text-foreground">
                <span className="font-semibold">Appointment Summary:</span>
              </p>
              <p className="text-sm text-foreground/80 mt-1">
                Date: {selectedDate.toDateString()}
              </p>
              <p className="text-sm text-foreground/80">
                Time: {selectedTime?.time}
              </p>
            </div>
          )} */}

          {/* Submit Button */}
          <div className="flex items-center justify-center">
            <Button
              onClick={onSubmit}
              disabled={!isFormValid || isSubmitting || isLoading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 h-auto text-base transition-colors md:w-1/2"
            >
              {isSubmitting ? "Scheduling..." : "Confirm Appointment"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
