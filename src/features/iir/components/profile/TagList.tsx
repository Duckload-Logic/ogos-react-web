import { NOT_SPECIFIED } from "../../constants";

export default function TagList({
  values,
  dark = false,
}: {
  values: string[];
  dark?: boolean;
}) {
  if (!values.length) {
    return <p className="text-xs italic opacity-80">{NOT_SPECIFIED}</p>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {values.map((value, index) => (
        <span
          key={`${value}-${index}`}
          className={`px-2 py-1 rounded-full text-xs ${
            dark
              ? "bg-primary-foreground/10 text-primary-foreground"
              : "bg-primary/10 text-primary"
          }`}
        >
          {value}
        </span>
      ))}
    </div>
  );
}
