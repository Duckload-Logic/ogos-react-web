import { Spinner } from "@/components/ui/spinner";

export default function Callback() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <Spinner className="size-20 text-primary" />
      <p className="mt-4 text-sm text-muted-foreground animate-pulse">
        Processing login
      </p>
    </div>
  );
}
