import { AlertCircle, IdCard, Mail, Phone, School } from "lucide-react";
import { ProfileFemale, ProfileMale } from "@/assets/icons";
import { asText, renderAddress } from "@/features/iir/utils";
import { StudentSection } from "../../types/IIRForm";
import { NOT_SPECIFIED } from "../../constants";
import { QuickInfo } from "./";

export default function BioCard({
  data,
}: {
  data: StudentSection | undefined;
}) {
  const DefaultProfileIcon =
    data?.personalInfo?.gender?.id === 1 ? ProfileMale : ProfileFemale;

  return (
    <div className="relative mt-10 sm:mt-12 flex flex-col items-center">
      <div className="absolute -top-12 z-10">
        <DefaultProfileIcon className="h-24 w-24 rounded-full bg-background p-1 border-4 border-card shadow-xl text-muted-foreground" />
      </div>

      <div className="w-full rounded-2xl border border-border bg-card px-6 pt-16 pb-6 shadow-xl">
        <div className="text-center mb-6">
          <h2 className="text-xl font-black tracking-tight text-card-foreground">
            {data?.basicInfo?.firstName}{" "}
            {data?.basicInfo?.middleName
              ? `${data.basicInfo.middleName[0]}.`
              : ""}{" "}
            {data?.basicInfo?.lastName}
          </h2>
          <span className="inline-block mt-1 px-3 py-2 rounded-lg bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest">
            {data?.personalInfo?.course?.code || NOT_SPECIFIED}-
            {data?.personalInfo?.yearLevel || NOT_SPECIFIED}
          </span>
        </div>

        <div className="w-full grid grid-cols-1 gap-4 pt-6 border-t border-border/50">
          <QuickInfo
            icon={IdCard}
            label="Student Number"
            value={asText(data?.personalInfo?.studentNumber)}
          />
          <QuickInfo
            icon={Mail}
            label="Email Address"
            value={asText(data?.basicInfo?.email)}
            truncate
          />
          <QuickInfo
            icon={Phone}
            label="Mobile Number"
            value={`+63 ${asText(data?.personalInfo?.mobileNumber)}`}
          />
          <QuickInfo
            icon={School}
            label="Year & Section"
            value={`${asText(data?.personalInfo?.yearLevel)}-${asText(data?.personalInfo?.section)}`}
          />
        </div>
      </div>
      <div className="relative w-full overflow-hidden rounded-2xl border-2 border-border bg-gradient-to-b from-card/100 to-muted/100 px-6 py-5 mt-2">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-secondary" />
        <div className="mb-3 flex items-center gap-2">
          <AlertCircle size={20} className="text-primary" />
          <p className="text-[12px] font-black uppercase tracking-[0.15em] text-muted-foreground">
            Emergency Contact
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 border-l border-border/50 pl-4 sm:grid-cols-2 sm:pl-6">
          <div className="space-y-2">
            <div>
              <p className="text-sm font-bold text-card-foreground leading-tight">
                {asText(data?.personalInfo?.emergencyContact?.firstName)}{" "}
                {data?.personalInfo?.emergencyContact?.middleName
                  ? `${data.personalInfo.emergencyContact.middleName[0]}.`
                  : ""}{" "}
                {asText(data?.personalInfo?.emergencyContact?.lastName)}
              </p>
              <p className="text-[11px] font-semibold text-primary/80 italic uppercase">
                {asText(
                  data?.personalInfo?.emergencyContact?.relationship?.name,
                )}
              </p>
            </div>

            <div className="flex flex-col">
              <span className="text-[9px] uppercase font-bold text-muted-foreground/70">
                Contact Number
              </span>
              <span className="text-xs font-semibold text-card-foreground">
                +63{" "}
                {asText(data?.personalInfo?.emergencyContact?.contactNumber)}
              </span>
            </div>
          </div>

          <div className="flex flex-col">
            <span className="text-[9px] uppercase font-bold text-muted-foreground/70">
              Address
            </span>
            <span className="text-xs text-card-foreground/90">
              {renderAddress(data?.personalInfo?.emergencyContact?.address)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
