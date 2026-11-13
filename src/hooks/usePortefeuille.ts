import { useQuery } from "@tanstack/react-query";
import { portefeuilleService } from "@/services/portefeuille.service";

export const PORTEFEUILLE_QUERY_KEY = ["portefeuille"] as const;
export const MOUVEMENTS_QUERY_KEY = ["portefeuille", "mouvements"] as const;

export function usePortefeuille() {
  return useQuery({
    queryKey: PORTEFEUILLE_QUERY_KEY,
    queryFn: portefeuilleService.get,
  });
}

export function useMouvements() {
  return useQuery({
    queryKey: MOUVEMENTS_QUERY_KEY,
    queryFn: portefeuilleService.listMouvements,
  });
}
