import { useQuery } from "@tanstack/react-query";
import { billetService } from "@/services/billet.service";
import { Billet } from "@/types/billet";

const TERMINAL_STATUSES: Billet["statut"][] = ["PAYE", "EXPIRE", "ANNULE"];
const POLL_INTERVAL_MS = 3000;

/**
 * Vérifie le statut d'un billet en attente de confirmation Paydunya. Le
 * webhook Paydunya est la seule source de vérité côté serveur ; ce polling ne
 * fait qu'observer le résultat, jamais le déclencher — l'app ne dépend donc
 * jamais du retour de la webview pour savoir si le paiement est passé.
 */
export function useBilletPolling(billetId: string, enabled: boolean) {
  return useQuery({
    queryKey: ["billet", billetId],
    queryFn: () => billetService.get(billetId),
    enabled: enabled && Boolean(billetId),
    refetchInterval: (query) => {
      const statut = query.state.data?.statut;
      if (statut && TERMINAL_STATUSES.includes(statut)) return false;
      return POLL_INTERVAL_MS;
    },
  });
}
