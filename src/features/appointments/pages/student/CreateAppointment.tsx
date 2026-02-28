import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAvailableSlots } from "@/features/appointments/hooks/useLookups";
import {
  TimeSlotSelector,
  AppointmentDetailsForm,
} from "@/features/appointments/components";
import { Appointment, TimeSlot } from "@/features/appointments";
import AppointmentCalendar from "@/features/appointments/components/AppointmentCalendar";
import {
  CalendarDays,
  Clock,
  FileText,
  CheckCircle2,
  ChevronRight,
  Edit2,
  CircleChevronLeft,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ConcernCategory } from "../../types";
import { useSubmitAppointment } from "../../hooks/useAppointments";
import { toISODateString } from "../../utils";

const EMPTY_APPOINTMENT_FORM: Appointment = {
  reason: "",
  whenDate: "",
  timeSlot: { id: 0, time: "" },
  appointmentCategory: { id: 0, name: "" },
};

export default function CreateAppointment() {
  const [appointmentFormData, setAppointmentFormData] = useState<Appointment>(
    EMPTY_APPOINTMENT_FORM,
  );
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<TimeSlot>();
  const { data: slots, isLoading } = useAvailableSlots(
    selectedDate || undefined,
  );
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const navigate = useNavigate();

  const {
    mutate: submit,
    isPending: isSubmitting,
    isError,
  } = useSubmitAppointment();

  // Calculate current step for progress indicator
  const currentStep = !selectedDate ? 1 : !selectedTime ? 2 : 3;

  const steps = [
    { id: 1, label: "Date", icon: CalendarDays },
    { id: 2, label: "Time", icon: Clock },
    { id: 3, label: "Details", icon: FileText },
  ];

  const formatSelectedDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="flex flex-col items-center text-center space-y-4 py-10 border-b border-border/40 bg-background/50 backdrop-blur-sm">
        <Link
          to="/student/appointments"
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all group"
        >
          <CircleChevronLeft
            size={16}
            className="group-hover:-translate-x-0.5 transition-transform"
          />
          <span>Return to My Appointments</span>
        </Link>

        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Schedule an Appointment
          </h1>
          <p className="text-sm text-muted-foreground max-w-prose">
            Select your preferred date and time. Please be descriptive about
            your concern to help our counselor prepare.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 lg:py-12">
        {/* Compact Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-0">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              const isCompleted = currentStep > step.id;
              const isCurrent = currentStep === step.id;

              return (
                <div key={step.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`
                        flex items-center justify-center w-10 h-10 rounded-full
                        transition-all duration-300
                        ${
                          isCompleted
                            ? "bg-primary text-primary-foreground"
                            : isCurrent
                              ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                              : "bg-muted text-muted-foreground"
                        }
                      `}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <StepIcon className="w-5 h-5" />
                      )}
                    </div>
                    <span
                      className={`
                        text-xs font-medium mt-1.5 transition-colors
                        ${isCurrent || isCompleted ? "text-foreground" : "text-muted-foreground"}
                      `}
                    >
                      {step.label}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`
                        w-16 sm:w-24 h-0.5 mx-3 rounded-full transition-colors duration-300
                        ${currentStep > step.id ? "bg-primary" : "bg-border"}
                      `}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Items Summary Bar */}
        {(selectedDate || selectedTime) && (
          <Card className="mb-6 border-primary/20 bg-primary/5">
            <CardContent className="py-3 px-4">
              <div className="flex items-center gap-2 flex-wrap">
                {selectedDate && (
                  <button
                    onClick={() => {
                      setSelectedDate(undefined);
                      setSelectedTime(undefined);
                    }}
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-background border border-border rounded-full text-sm font-medium hover:bg-muted transition-colors group"
                  >
                    <CalendarDays className="w-4 h-4 text-primary" />
                    {formatSelectedDate(selectedDate)}
                    <Edit2 className="w-3 h-3 text-muted-foreground group-hover:text-foreground" />
                  </button>
                )}
                {selectedDate && selectedTime && (
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                )}
                {selectedTime && (
                  <button
                    onClick={() => setSelectedTime(undefined)}
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-background border border-border rounded-full text-sm font-medium hover:bg-muted transition-colors group"
                  >
                    <Clock className="w-4 h-4 text-primary" />
                    {selectedTime.time}
                    <Edit2 className="w-3 h-3 text-muted-foreground group-hover:text-foreground" />
                  </button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Single Column Wizard Steps */}
        <div className="space-y-6">
          {/* Step 1: Calendar */}
          {currentStep === 1 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
              <AppointmentCalendar
                currentMonth={currentMonth}
                selectedDate={selectedDate}
                onMonthChange={setCurrentMonth}
                onDateSelect={(date) => {
                  setSelectedDate(date);
                  setSelectedTime(undefined);
                  setAppointmentFormData((prev) => ({
                    ...prev,
                    whenDate: toISODateString(date),
                  }));
                }}
                title="Select a Date"
                occupiedDayColor="bg-primary/80"
                legends={[]}
                hasHeader
                className="max-w-md mx-auto"
                allowCurrentDate={false}
              />
            </div>
          )}

          {/* Step 2: Time Slots */}
          {currentStep === 2 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
              <TimeSlotSelector
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                availableSlots={slots || []}
                loading={isLoading}
                onTimeSelect={(time) => {
                  setSelectedTime(time);
                  setAppointmentFormData((prev) => ({
                    ...prev,
                    timeSlot: time,
                  }));
                }}
              />
            </div>
          )}

          {/* Step 3: Details Form */}
          {currentStep === 3 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
              {/* Appointment Summary Card */}
              <Card className="mb-6 border-green-200 bg-green-50/50 dark:border-green-900 dark:bg-green-950/20">
                <CardContent className="py-4 px-5">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                      <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-green-800 dark:text-green-200">
                        Appointment Selected
                      </p>
                      <p className="text-sm text-green-700 dark:text-green-300 mt-0.5">
                        {new Date(
                          appointmentFormData.whenDate,
                        ).toLocaleDateString("en-US", {
                          weekday: "long",
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}{" "}
                        at {appointmentFormData.timeSlot.time}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedDate(undefined);
                        setSelectedTime(undefined);
                      }}
                      className="text-green-700 hover:text-green-800 hover:bg-green-100 dark:text-green-300 dark:hover:bg-green-900/30"
                    >
                      Change
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <AppointmentDetailsForm
                data={appointmentFormData}
                onChange={(name: string, value: any) => {
                  setAppointmentFormData((prev) => ({
                    ...prev,
                    [name]: value,
                  }));
                }}
                onSubmit={async () => {
                  submit(appointmentFormData);
                  navigate("/student/appointments");
                }}
                isLoading={isLoading}
                isSubmitting={isSubmitting}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
