import { useAuth } from "@/context";
import { useQuery } from "@tanstack/react-query";
import { consentService } from "../services";

export default function useCheckUserConsent(docId?: number) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["userConsent", user?.id, docId],
    queryFn: () => consentService.checkUserConsent(docId!),
    enabled: !!docId && !!user?.id,
  });
}
