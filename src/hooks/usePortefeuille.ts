import { useQuery } from "@tanstack/react-query";
import { portefeuilleService } from "@/services/portefeuille.service";

export const PORTEFEUILLE_QUERY_KEY = ["portefeuille"] as const;

export function usePortefeuille() {
  return useQuery({
    queryKey: PORTEFEUILLE_QUERY_KEY,
    queryFn: portefeuilleService.get,
  });
}
