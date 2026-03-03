import { useQuery } from "@tanstack/react-query";
import { slipService } from "../services";
import { SlipCategory } from "../types/slip";

export function useGetSlipCategories() {
  return useQuery<SlipCategory[]>({
    queryKey: ["slip-categories"],
    queryFn: async () => {
      const data = await slipService.getSlipCategories();
      return data;
    },
  });
}
