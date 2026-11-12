import { useQuery } from "@tanstack/react-query";
import { voyageService, ListVoyagesParams } from "@/services/voyage.service";

// Partagé entre home.tsx et TripPickerModal : mêmes params -> même clé de
// requête -> un seul appel réseau, le cache React Query est réutilisé.
export const UPCOMING_VOYAGES_PARAMS: ListVoyagesParams = {
  disponibles: true,
  periode: "semaine",
};

export function useVoyages(params: ListVoyagesParams = {}) {
  return useQuery({
    queryKey: ["voyages", params],
    queryFn: () => voyageService.list(params),
  });
}
