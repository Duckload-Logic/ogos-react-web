import {
  Activity,
  CheckCircle2,
  Ear,
  Eye,
  MessageSquare,
  XCircle,
} from "lucide-react";
import { asText } from "../../utils";
import { formatDate } from "@/features/schedules/utils/formatters";
import { EmptyState, InfoItem, SectionTitle } from ".";
import { ConsultationRecord, HealthSection } from "../../types/IIRForm";
import { NOT_SPECIFIED } from "../../constants";

export default function HealthInformationView({
  data,
}: {
  data: HealthSection | undefined;
}) {
  const physicalStats = [
    {
      label: "Vision",
      value: data?.healthRecord?.visionHasProblem,
      details: data?.healthRecord?.visionDetails,
      icon: Eye,
    },
    {
      label: "Hearing",
      value: data?.healthRecord?.hearingHasProblem,
      details: data?.healthRecord?.hearingDetails,
      icon: Ear,
    },
    {
      label: "Speech",
      value: data?.healthRecord?.speechHasProblem,
      details: data?.healthRecord?.speechDetails,
      icon: MessageSquare,
    },
    {
      label: "General Health",
      value: data?.healthRecord?.generalHealthHasProblem,
      details: data?.healthRecord?.generalHealthDetails,
      icon: Activity,
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <section>
        <SectionTitle title="Physical Remarks" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {physicalStats.map((stat) => (
            <div
              key={stat.label}
              className="p-4 rounded-xl border border-border bg-card shadow-sm hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center gap-3 mb-3 min-h-[62px]">
                <div className="p-2 rounded-lg bg-muted text-muted-foreground">
                  <stat.icon size={18} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  {stat.label}
                </span>
              </div>
              <StatusPill value={stat.value} />
              <div className="border-t border-border mt-3 pt-3 text-xs text-muted-foreground">
                {asText(stat.details)}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <SectionTitle title="Professional Consultation" />
        <div className="mt-6 grid grid-cols-1 gap-4">
          {(data?.consultations?.length ?? 0) > 0 ? (
            data?.consultations.map((consultation: ConsultationRecord) => (
              <div
                key={consultation.id}
                className="p-5 rounded-2xl border border-primary/50 bg-primary/5"
              >
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <h4 className="text-sm font-bold text-card-foreground">
                    {asText(consultation.professionalType)}
                  </h4>
                  {consultation.hasConsulted ? (
                    <div className="flex items-center gap-1 text-green-700 text-xs font-semibold">
                      <CheckCircle2 className="h-4 w-4" /> Consulted
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-muted-foreground text-xs font-semibold">
                      <XCircle className="h-4 w-4" /> Not Consulted
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <InfoItem
                    label="When"
                    value={
                      consultation.whenDate
                        ? formatDate(consultation.whenDate)
                        : NOT_SPECIFIED
                    }
                  />
                  <InfoItem
                    label="Reason"
                    value={asText(consultation.forWhat)}
                  />
                </div>
              </div>
            ))
          ) : (
            <EmptyState label="No consultations recorded" />
          )}
        </div>
      </section>
    </div>
  );
}

function StatusPill({ value }: { value: boolean | null | undefined }) {
  if (value === undefined || value === null) {
    return (
      <div className="text-xs font-bold px-2 py-1 rounded border w-fit">
        {NOT_SPECIFIED}
      </div>
    );
  }

  return value ? (
    <div className="text-xs font-bold px-2 py-1 rounded border border-amber-700 text-amber-700 w-fit">
      Has Problem
    </div>
  ) : (
    <div className="text-xs font-bold px-2 py-1 rounded border border-green-700 text-green-700 w-fit">
      No Problem
    </div>
  );
}
