import { asText } from "@/features/iir/utils";
import { formatDate } from "@/features/schedules/utils/formatters";
import { CardBlock, EmptyState, InfoItem, SectionTitle } from ".";
import { SignificantNote } from "../../types/IIRForm";
import { NOT_SPECIFIED } from "../../constants";

export default function SignificantNotesView({
  data,
}: {
  data: SignificantNote[] | undefined;
}) {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <SectionTitle title="Significant Notes / Incidents" />
      <div className="grid grid-cols-1 gap-4">
        {(data?.length ?? 0) > 0 ? (
          data!.map((note: any) => (
            <CardBlock key={note.id}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                <InfoItem
                  label="Date"
                  value={
                    note.noteDate ? formatDate(note.noteDate) : NOT_SPECIFIED
                  }
                />
                <InfoItem
                  label="Created"
                  value={
                    note.createdAt ? formatDate(note.createdAt) : NOT_SPECIFIED
                  }
                />
                <InfoItem
                  label="Updated"
                  value={
                    note.updatedAt ? formatDate(note.updatedAt) : NOT_SPECIFIED
                  }
                />
              </div>
              <div className="space-y-3 border-t border-border pt-3">
                <InfoItem
                  label="Incident"
                  value={asText(note.incidentDescription)}
                />
                <InfoItem label="Remarks" value={asText(note.remarks)} />
              </div>
            </CardBlock>
          ))
        ) : (
          <EmptyState label="No significant notes recorded" />
        )}
      </div>
    </div>
  );
}
