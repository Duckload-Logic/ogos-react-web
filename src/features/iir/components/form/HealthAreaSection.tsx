import { InputField, Checkbox } from "@/components/form";

export function HealthAreaSection({
  title,
  fieldPrefix,
  hasData,
  details,
  onChange,
}: {
  title: string;
  fieldPrefix: string;
  hasData: boolean;
  details: string;
  onChange: (path: string, value: any) => void;
}) {
  return (
    <div className="p-4 border border-border rounded-lg bg-card">
      <div className="flex items-center gap-3 mb-3">
        <Checkbox
          id={`has-${title}`}
          label={`Has ${title.toLowerCase()} Problem`}
          name={`has-${title}`}
          checked={hasData}
          onCheckedChange={(checked: boolean | "indeterminate") =>
            onChange(`${fieldPrefix}HasProblem`, checked === true)
          }
        />
      </div>

      {hasData && (
        <InputField
          label="Details"
          isTextarea
          value={details}
          onChange={(val) => onChange(`${fieldPrefix}Details`, val)}
          placeholder="Describe the problem"
        />
      )}
    </div>
  );
}
