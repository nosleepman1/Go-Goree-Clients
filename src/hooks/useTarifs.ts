import { useQuery } from "@tanstack/react-query";
import { tarifService } from "@/services/tarif.service";

export function useTarifs() {
  return useQuery({
    queryKey: ["tarifs"],
    queryFn: tarifService.list,
    staleTime: 5 * 60_000, // les tarifs changent rarement
  });
}
