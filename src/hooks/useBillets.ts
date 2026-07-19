import { useQuery } from "@tanstack/react-query";
import { billetService, mapBilletToTicket } from "@/services/billet.service";
import { Ticket } from "@/types";

export const BILLETS_QUERY_KEY = ["billets"] as const;

export function useBillets() {
  return useQuery({
    queryKey: BILLETS_QUERY_KEY,
    queryFn: billetService.list,
    select: (billets): Ticket[] => billets.map((b) => mapBilletToTicket(b)),
  });
}

// Même queryKey que useBilletPolling : le billet seedé/rafraîchi par le flux
// d'achat est immédiatement disponible ici sans nouvel appel réseau.
export function useBillet(id: string) {
  return useQuery({
    queryKey: ["billet", id],
    queryFn: () => billetService.get(id),
    enabled: Boolean(id),
    select: (billet): Ticket => mapBilletToTicket(billet),
  });
}
